import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, AIProviderConfig, Message, ChatOptions } from "./types";

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  private model: string;

  constructor(config: AIProviderConfig) {
    this.client = config.client ?? new Anthropic({ apiKey: config.apiKey });
    this.model = config.model;
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1000,
        messages: messages.map(msg => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        })),
        system: messages.find(msg => msg.role === "system")?.content,
      });

      const textContent = response.content.filter(block => block.type === "text");
      return textContent.map(block => block.text).join("");
    } catch (error) {
      if (options?.onError) {
        options.onError(error as Error);
      }
      throw error;
    }
  }

  async streamChat(messages: Message[], options?: ChatOptions): Promise<ReadableStream<Uint8Array>> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1000,
        messages: messages.map(msg => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        })),
        system: messages.find(msg => msg.role === "system")?.content,
        stream: true,
      });

      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              const content = chunk.delta.text;
              controller.enqueue(new TextEncoder().encode(content));
              if (options?.onToken) {
                options.onToken(content);
              }
            }
          }
          controller.close();
          if (options?.onFinish) {
            options.onFinish();
          }
        },
      });

      return stream;
    } catch (error) {
      if (options?.onError) {
        options.onError(error as Error);
      }
      throw error;
    }
  }
} 

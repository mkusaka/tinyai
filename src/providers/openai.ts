import OpenAI from "openai";
import type { AIProvider, AIProviderConfig, Message, ChatOptions } from "./types";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(config: AIProviderConfig) {
    this.client = config.client ?? new OpenAI({ apiKey: config.apiKey });
    this.model = config.model;
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      return response.choices[0]?.message?.content ?? "";
    } catch (error) {
      if (options?.onError) {
        options.onError(error as Error);
      }
      throw error;
    }
  }

  async streamChat(messages: Message[], options?: ChatOptions): Promise<ReadableStream<Uint8Array>> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: true,
      });

      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content ?? "";
            if (content) {
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

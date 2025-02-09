import { z } from "zod";
import { Message as AIMessage } from "ai";

export type Role = "user" | "assistant" | "system";
export type ProviderType = "openai" | "anthropic";

export interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  onError?: (error: Error) => void;
  onToken?: (token: string) => void;
  onFinish?: () => void;
}

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  client?: any;
}

export interface AIProvider {
  chat(messages: Message[], options?: ChatOptions): Promise<string>;
  streamChat(messages: Message[], options?: ChatOptions): Promise<ReadableStream<Uint8Array>>;
}

// Provider schemas
export const providerSchema = z.object({
  type: z.enum(["openai", "anthropic"]),
  apiKey: z.string().optional(),
  model: z.string().optional(),
});

export const openAIConfigSchema = z.object({
  apiKey: z.string(),
  model: z.string().default("gpt-3.5-turbo"),
});

export const anthropicConfigSchema = z.object({
  apiKey: z.string(),
  model: z.string().default("claude-2"),
});

export type ProviderConfig = z.infer<typeof providerSchema>;
export type OpenAIConfig = z.infer<typeof openAIConfigSchema>;
export type AnthropicConfig = z.infer<typeof anthropicConfigSchema>; 

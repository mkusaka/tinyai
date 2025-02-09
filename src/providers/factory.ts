import { z } from "zod";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import type { AIProvider, AIProviderConfig } from "./types";

const providerConfigSchema = z.object({
  type: z.enum(["openai", "anthropic"]),
  apiKey: z.string().min(1, "API key is required"),
  model: z.string().optional(),
});

const defaultModels = {
  openai: "gpt-3.5-turbo",
  anthropic: "claude-3-opus-20240229",
} as const;

export function createProvider(config: z.infer<typeof providerConfigSchema>): AIProvider {
  const result = providerConfigSchema.safeParse(config);
  if (!result.success) {
    throw result.error;
  }

  const { type, apiKey, model } = result.data;
  const providerConfig: AIProviderConfig = {
    apiKey,
    model: model ?? defaultModels[type],
  };

  switch (type) {
    case "openai":
      return new OpenAIProvider(providerConfig);
    case "anthropic":
      return new AnthropicProvider(providerConfig);
    default:
      throw new Error(`Unsupported provider type: ${type}`);
  }
} 

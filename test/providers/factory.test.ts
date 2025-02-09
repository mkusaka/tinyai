import { describe, it, expect } from "vitest";
import { createProvider } from "../../src/providers/factory";
import { OpenAIProvider } from "../../src/providers/openai";
import { AnthropicProvider } from "../../src/providers/anthropic";

describe("Provider Factory", () => {
  it("should create OpenAI provider with valid config", () => {
    const provider = createProvider({
      type: "openai",
      apiKey: "test-key",
      model: "gpt-4",
    });

    expect(provider).toBeInstanceOf(OpenAIProvider);
  });

  it("should create Anthropic provider with valid config", () => {
    const provider = createProvider({
      type: "anthropic",
      apiKey: "test-key",
      model: "claude-3-opus-20240229",
    });

    expect(provider).toBeInstanceOf(AnthropicProvider);
  });

  it("should use default model for OpenAI", () => {
    const provider = createProvider({
      type: "openai",
      apiKey: "test-key",
    });

    expect(provider).toBeInstanceOf(OpenAIProvider);
  });

  it("should use default model for Anthropic", () => {
    const provider = createProvider({
      type: "anthropic",
      apiKey: "test-key",
    });

    expect(provider).toBeInstanceOf(AnthropicProvider);
  });

  it("should throw error for invalid provider type", () => {
    expect(() =>
      createProvider({
        type: "invalid" as any,
        apiKey: "test-key",
      })
    ).toThrow("Invalid enum value. Expected 'openai' | 'anthropic', received 'invalid'");
  });

  it("should throw error when API key is missing", () => {
    expect(() =>
      createProvider({
        type: "openai",
        apiKey: "",
      })
    ).toThrow();
  });
}); 

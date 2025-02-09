import { describe, expect, it, vi } from "vitest";
import { AnthropicProvider } from "../../src/providers/anthropic";
import { mockMessages, createMockAnthropicResponse, createMockAnthropicStreamResponse, createMockError } from "../helpers/mock";

describe("Anthropic Provider", () => {
  it("should handle normal chat completion", async () => {
    const expectedResponse = "Test response";
    const mockClient = {
      messages: {
        create: vi.fn().mockResolvedValue(createMockAnthropicResponse(expectedResponse)),
      },
    };

    const provider = new AnthropicProvider({
      apiKey: "test-key",
      model: "claude-3-opus-20240229",
      client: mockClient as any,
    });

    const response = await provider.chat(mockMessages);
    expect(response).toBe(expectedResponse);
  });

  it("should handle streaming chat completion", async () => {
    const expectedResponse = "Test response";
    const mockStream = {
      [Symbol.asyncIterator]: async function* () {
        yield createMockAnthropicStreamResponse(expectedResponse);
      },
    };

    const mockClient = {
      messages: {
        create: vi.fn().mockResolvedValue(mockStream),
      },
    };

    const provider = new AnthropicProvider({
      apiKey: "test-key",
      model: "claude-3-opus-20240229",
      client: mockClient as any,
    });

    const stream = await provider.streamChat(mockMessages);
    const reader = stream.getReader();
    const { value } = await reader.read();
    const text = new TextDecoder().decode(value);
    expect(text).toBe(expectedResponse);
  });

  it("should handle API errors", async () => {
    const error = createMockError();
    const mockClient = {
      messages: {
        create: vi.fn().mockRejectedValue(error),
      },
    };

    const provider = new AnthropicProvider({
      apiKey: "test-key",
      model: "claude-3-opus-20240229",
      client: mockClient as any,
    });

    const onError = vi.fn();

    await expect(
      provider.chat(mockMessages, { onError })
    ).rejects.toThrow("API error");
    expect(onError).toHaveBeenCalledWith(error);
  });
}); 

import { describe, expect, it, vi } from "vitest";
import { OpenAIProvider } from "../../src/providers/openai";
import { mockMessages, createMockOpenAIResponse, createMockOpenAIStreamResponse, createMockError } from "../helpers/mock";

describe("OpenAI Provider", () => {
  it("should handle normal chat completion", async () => {
    const expectedResponse = "Test response";
    const mockClient = {
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue(createMockOpenAIResponse(expectedResponse)),
        },
      },
    };

    const provider = new OpenAIProvider({
      apiKey: "test-key",
      model: "gpt-3.5-turbo",
      client: mockClient as any,
    });

    const response = await provider.chat(mockMessages);
    expect(response).toBe(expectedResponse);
  });

  it("should handle streaming chat completion", async () => {
    const expectedResponse = "Test response";
    const mockStream = {
      [Symbol.asyncIterator]: async function* () {
        yield createMockOpenAIStreamResponse(expectedResponse);
      },
    };

    const mockClient = {
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue(mockStream),
        },
      },
    };

    const provider = new OpenAIProvider({
      apiKey: "test-key",
      model: "gpt-3.5-turbo",
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
      chat: {
        completions: {
          create: vi.fn().mockRejectedValue(error),
        },
      },
    };

    const provider = new OpenAIProvider({
      apiKey: "test-key",
      model: "gpt-3.5-turbo",
      client: mockClient as any,
    });

    const onError = vi.fn();

    await expect(
      provider.chat(mockMessages, { onError })
    ).rejects.toThrow("API error");
    expect(onError).toHaveBeenCalledWith(error);
  });
}); 

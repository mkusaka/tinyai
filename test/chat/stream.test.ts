import { describe, it, expect, vi } from "vitest";
import { handleChatStream, handleJSONChatStream } from "../../src/chat/stream";
import { createMockProvider, createMockStream, mockMessages } from "../helpers/mock";

describe("Chat Stream Handlers", () => {
  it("should handle normal chat stream", async () => {
    const expectedResponse = "Test response";
    const mockProvider = createMockProvider();
    mockProvider.streamChat.mockResolvedValueOnce(createMockStream(expectedResponse));

    const response = await handleChatStream(mockProvider, mockMessages);
    expect(response).toBe(expectedResponse);
  });

  it("should handle JSON chat stream", async () => {
    const expectedResponse = { message: "Test response" };
    const mockProvider = createMockProvider();
    mockProvider.streamChat.mockResolvedValueOnce(createMockStream(JSON.stringify(expectedResponse)));

    const response = await handleJSONChatStream<typeof expectedResponse>(mockProvider, mockMessages);
    expect(response).toEqual(expectedResponse);
  });

  it("should handle stream errors", async () => {
    const error = new Error("Stream error");
    const mockProvider = createMockProvider();
    mockProvider.streamChat.mockRejectedValueOnce(error);
    const onError = vi.fn();

    await expect(
      handleChatStream(mockProvider, mockMessages, { onError })
    ).rejects.toThrow("Stream error");
    expect(onError).toHaveBeenCalledWith(error);
  });

  it("should handle JSON stream errors", async () => {
    const error = new Error("JSON stream error");
    const mockProvider = createMockProvider();
    mockProvider.streamChat.mockRejectedValueOnce(error);
    const onError = vi.fn();

    await expect(
      handleJSONChatStream(mockProvider, mockMessages, { onError })
    ).rejects.toThrow("JSON stream error");
    expect(onError).toHaveBeenCalledWith(error);
  });

  it("should call onToken callback for each token", async () => {
    const tokens = ["Hello", " ", "world"];
    const mockProvider = createMockProvider();
    const onToken = vi.fn();

    mockProvider.streamChat.mockImplementation(() => {
      return new ReadableStream({
        start(controller) {
          tokens.forEach(token => {
            controller.enqueue(new TextEncoder().encode(token));
          });
          controller.close();
        },
      });
    });

    await handleChatStream(mockProvider, mockMessages, { onToken });
    expect(onToken).toHaveBeenCalledTimes(tokens.length);
    tokens.forEach((token, i) => {
      expect(onToken).toHaveBeenNthCalledWith(i + 1, token);
    });
  });

  it("should call onFinish callback when stream ends", async () => {
    const mockProvider = createMockProvider();
    const onFinish = vi.fn();

    mockProvider.streamChat.mockImplementation(() => {
      return new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("Test"));
          controller.close();
        },
      });
    });

    await handleChatStream(mockProvider, mockMessages, { onFinish });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
}); 

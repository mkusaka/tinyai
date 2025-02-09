import { vi } from "vitest";
import type { AIProvider, Message } from "../../src/providers/types";

export const mockMessages: Message[] = [
  {
    id: "1",
    role: "system",
    content: "You are a helpful assistant.",
  },
  {
    id: "2",
    role: "user",
    content: "Hello!",
  },
  {
    id: "3",
    role: "assistant",
    content: "Hi there! How can I help you today?",
  },
];

export function createMockStream(content: string): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(content));
      controller.close();
    },
  });
}

export function createMockProvider(
  chatResponse: string = "Test response",
  streamResponse: string = "Test response"
): AIProvider & {
  chat: ReturnType<typeof vi.fn>;
  streamChat: ReturnType<typeof vi.fn>;
} {
  const chat = vi.fn().mockResolvedValue(chatResponse);
  const streamChat = vi.fn().mockResolvedValue(createMockStream(streamResponse));

  return {
    chat,
    streamChat,
  };
}

export function createMockOpenAIResponse(content: string) {
  return {
    choices: [
      {
        message: {
          content,
        },
      },
    ],
  };
}

export function createMockAnthropicResponse(content: string) {
  return {
    content: [
      {
        type: "text",
        text: content,
      },
    ],
  };
}

export function createMockOpenAIStreamResponse(content: string) {
  return {
    choices: [
      {
        delta: {
          content,
        },
      },
    ],
  };
}

export function createMockAnthropicStreamResponse(content: string) {
  return {
    type: "content_block_delta",
    delta: {
      type: "text_delta",
      text: content,
    },
  };
}

export function createMockError(message: string = "API error") {
  return new Error(message);
} 

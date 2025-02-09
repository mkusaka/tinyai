import { vi } from "vitest";
import { AIProvider, Message, StreamingOptions } from "../src/providers/types.js";

export function createMockProvider(): AIProvider & {
  chat: ReturnType<typeof vi.fn>;
  streamChat: ReturnType<typeof vi.fn>;
} {
  return {
    chat: vi.fn(),
    streamChat: vi.fn(),
  };
}

export function createMockStream(content: string): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(content);
      controller.close();
    },
  });
}

export const mockMessages: Message[] = [
  {
    id: "system-1",
    role: "system",
    content: "You are a helpful assistant.",
  },
  {
    id: "user-1",
    role: "user",
    content: "Hello!",
  },
  {
    id: "assistant-1",
    role: "assistant",
    content: "Hi! How can I help you today?",
  },
]; 

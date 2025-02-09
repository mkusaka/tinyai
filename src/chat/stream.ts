import type { AIProvider, Message, ChatOptions } from "../providers/types";

export async function handleChatStream(
  provider: AIProvider,
  messages: Message[],
  options?: ChatOptions
): Promise<string> {
  let result = "";

  try {
    const stream = await provider.streamChat(messages, {
      ...options,
      onToken: (token: string) => {
        result += token;
        options?.onToken?.(token);
      },
    });

    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      result += text;
      options?.onToken?.(text);
    }

    options?.onFinish?.();
    return result;
  } catch (error) {
    if (options?.onError) {
      options.onError(error as Error);
    }
    throw error;
  }
}

export async function handleJSONChatStream<T>(
  provider: AIProvider,
  messages: Message[],
  options?: ChatOptions
): Promise<T> {
  try {
    const result = await handleChatStream(provider, messages, options);
    return JSON.parse(result) as T;
  } catch (error) {
    if (options?.onError) {
      options.onError(error as Error);
    }
    throw error;
  }
} 

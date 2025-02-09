import { describe, test, expect } from "vitest";
import { ChatHistory } from "../../src/chat/history.js";

describe("Chat History", () => {
  test("should initialize empty history", () => {
    const history = new ChatHistory();
    expect(history.getMessages()).toHaveLength(0);
  });

  test("should initialize with system message", () => {
    const systemMessage = "You are a helpful assistant.";
    const history = new ChatHistory(systemMessage);
    const messages = history.getMessages();

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      role: "system",
      content: systemMessage,
    });
  });

  test("should add user message", () => {
    const history = new ChatHistory();
    const userMessage = "Hello!";
    history.addUserMessage(userMessage);
    const messages = history.getMessages();

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      role: "user",
      content: userMessage,
    });
  });

  test("should add assistant message", () => {
    const history = new ChatHistory();
    const assistantMessage = "Hi! How can I help you?";
    history.addAssistantMessage(assistantMessage);
    const messages = history.getMessages();

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      role: "assistant",
      content: assistantMessage,
    });
  });

  test("should clear history", () => {
    const history = new ChatHistory("System message");
    history.addUserMessage("User message");
    history.addAssistantMessage("Assistant message");
    expect(history.getMessages()).toHaveLength(3);

    history.clear();
    expect(history.getMessages()).toHaveLength(0);
  });

  test("should maintain message order", () => {
    const history = new ChatHistory("System message");
    history.addUserMessage("User message");
    history.addAssistantMessage("Assistant message");
    const messages = history.getMessages();

    expect(messages).toHaveLength(3);
    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
    expect(messages[2].role).toBe("assistant");
  });
}); 

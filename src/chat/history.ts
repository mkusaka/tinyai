import { Message } from "../providers/types.js";
import { nanoid } from "nanoid";

export class ChatHistory {
  private messages: Message[] = [];

  constructor(systemMessage?: string) {
    if (systemMessage) {
      this.addSystemMessage(systemMessage);
    }
  }

  addSystemMessage(content: string): void {
    this.messages.push({
      id: nanoid(),
      role: "system",
      content,
    });
  }

  addUserMessage(content: string): void {
    this.messages.push({
      id: nanoid(),
      role: "user",
      content,
    });
  }

  addAssistantMessage(content: string): void {
    this.messages.push({
      id: nanoid(),
      role: "assistant",
      content,
    });
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  clear(): void {
    this.messages = [];
  }
} 

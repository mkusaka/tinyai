import { Command } from "@cliffy/command";
import { ChatOptions, chatOptionsSchema } from "../types/schema.js";
import { createProvider } from "../providers/factory.js";
import { ChatHistory } from "../chat/history.js";
import { handleChatStream, handleJsonChatStream } from "../chat/stream.js";
import { getProviderApiKey } from "../config/env.js";
import { ProviderType } from "../providers/types.js";

export function createChatCommand() {
  const cmd = new Command();
  return cmd
    .name("chat")
    .description("Start an interactive chat session with an AI model")
    .option("-p, --provider <provider:string>", "LLM provider to use (e.g., openai, anthropic)")
    .option("-m, --model <model:string>", "Model to use (e.g., gpt-3.5-turbo, claude-2)")
    .option("-k, --api-key <key:string>", "API key for the provider")
    .option("--json", "Output response in JSON format")
    .action(async (options) => {
      const parsedOptions = chatOptionsSchema.safeParse(options);
      if (!parsedOptions.success) {
        console.error("Invalid options:", parsedOptions.error.message);
        process.exit(1);
      }
      await handleChatCommand(parsedOptions.data);
    });
}

async function handleChatCommand(options: ChatOptions): Promise<void> {
  try {
    const provider = options.provider ?? "openai";
    const apiKey = options.apiKey ?? getProviderApiKey(provider);
    
    if (!apiKey) {
      throw new Error(`No API key provided for ${provider}. Please set ${provider.toUpperCase()}_API_KEY environment variable or use --api-key option.`);
    }

    const aiProvider = createProvider({
      type: provider as ProviderType,
      apiKey,
      model: options.model,
    });

    const history = new ChatHistory("You are a helpful AI assistant.");
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("Chat session started. Type 'exit' to end the session.");
    
    while (true) {
      const userInput = await new Promise<string>((resolve) => {
        rl.question("> ", resolve);
      });

      if (userInput.toLowerCase() === "exit") {
        break;
      }

      history.addUserMessage(userInput);

      if (options.json) {
        const response = await handleJsonChatStream(aiProvider, history.getMessages());
        console.log(JSON.stringify({ response }, null, 2));
      } else {
        const response = await handleChatStream(aiProvider, history.getMessages());
        history.addAssistantMessage(response);
      }
    }

    rl.close();
    console.log("Chat session ended.");
  } catch (error: unknown) {
    console.error("Error in chat command:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
} 

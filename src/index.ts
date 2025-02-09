#!/usr/bin/env node
import { Command } from "@cliffy/command";
import { createChatCommand } from "./commands/chat.js";
import { createToolsCommand } from "./commands/tools.js";

const program = new Command();

// ルートコマンドの設定
program
  .name("tinyai")
  .version("0.1.0")
  .description("A CLI tool for interacting with various LLM providers using Vercel AI SDK");

// サブコマンドの登録
const chat = createChatCommand();
const tools = createToolsCommand();

program.command(chat.getName(), chat);
program.command(tools.getName(), tools);

// プログラムの実行
try {
  await program.parse();
} catch (error: unknown) {
  console.error("Error:", error instanceof Error ? error.message : String(error));
  process.exit(1);
} 

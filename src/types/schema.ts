import { z } from "zod";
import { ProviderType } from "../providers/types.js";

// チャットコマンドのスキーマ
export const chatOptionsSchema = z.object({
  provider: z.enum(["openai", "anthropic"]).optional(),
  model: z.string().optional(),
  apiKey: z.string().optional(),
  json: z.boolean().optional(),
});

export type ChatOptions = z.infer<typeof chatOptionsSchema>;

// ツールコマンドのスキーマ
export const toolRunOptionsSchema = z.object({
  json: z.boolean().optional(),
});

export type ToolRunOptions = z.infer<typeof toolRunOptionsSchema>;

export const toolRunArgsSchema = z.tuple([
  z.string().describe("tool name"),
]);

export type ToolRunArgs = z.infer<typeof toolRunArgsSchema>; 

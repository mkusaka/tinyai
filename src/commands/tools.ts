import { Command } from "@cliffy/command";
import { ToolRunOptions, toolRunOptionsSchema, toolRunArgsSchema } from "../types/schema.js";

export function createToolsCommand() {
  const cmd = new Command();
  const toolsCmd = cmd
    .name("tools")
    .description("Access and manage AI tools");

  toolsCmd
    .command("run")
    .arguments("<tool:string>")
    .option("--json", "Output response in JSON format")
    .action(async (options, ...args) => {
      const parsedOptions = toolRunOptionsSchema.safeParse(options);
      if (!parsedOptions.success) {
        console.error("Invalid options:", parsedOptions.error.message);
        process.exit(1);
      }

      const parsedArgs = toolRunArgsSchema.safeParse(args);
      if (!parsedArgs.success) {
        console.error("Invalid arguments:", parsedArgs.error.message);
        process.exit(1);
      }

      const [tool] = parsedArgs.data;
      await handleToolRunCommand(tool, parsedOptions.data);
    });

  toolsCmd
    .command("list")
    .description("List available AI tools")
    .action(async () => {
      await handleToolListCommand();
    });

  return toolsCmd;
}

async function handleToolRunCommand(tool: string, options: ToolRunOptions): Promise<void> {
  try {
    console.log("Running tool:", tool, "with options:", options);
    // TODO: Implement tool execution
    // 1. Validate tool exists
    // 2. Load tool configuration
    // 3. Execute tool
    // 4. Format and output results
  } catch (error: unknown) {
    console.error("Error in tool run command:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function handleToolListCommand(): Promise<void> {
  try {
    console.log("Listing available tools...");
    // TODO: Implement tool listing
    // 1. Load available tools
    // 2. Format and display tool list
  } catch (error: unknown) {
    console.error("Error in tool list command:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
} 

import { vi } from "vitest";

// Mock environment variables
process.env.OPENAI_API_KEY = "test-openai-key";
process.env.ANTHROPIC_API_KEY = "test-anthropic-key";

// Mock API clients
vi.mock("openai");
vi.mock("@anthropic-ai/sdk"); 

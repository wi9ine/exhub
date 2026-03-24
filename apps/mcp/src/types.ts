import type { ZodTypeAny } from "zod";

export type ExchangeKey = "upbit" | "bithumb" | "coinone" | "gopax" | "korbit";

export interface JsonSchema {
  type?: "object" | "string" | "number" | "integer" | "boolean" | "array";
  description?: string;
}

export interface ToolArgumentDefinition {
  name: string;
  required?: boolean;
  schema: JsonSchema;
  validator?: ZodTypeAny;
}

export interface ToolMetadata {
  category: string;
  method: string;
  access: "public" | "private";
  args: readonly ToolArgumentDefinition[];
  specOperationId?: string;
  description?: string;
}

export interface ResolvedToolDefinition extends ToolMetadata {
  name: string;
  inputZodSchema?: ZodTypeAny;
}

export interface ExchangeRuntimeDefinition {
  key: ExchangeKey;
  displayName: string;
  createClient: () => Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>;
  getMissingCredentialEnv: () => string[];
  tools: readonly ResolvedToolDefinition[];
}

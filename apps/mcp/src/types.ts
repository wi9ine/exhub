export type ExchangeKey = "upbit" | "bithumb" | "coinone" | "gopax" | "korbit";

export interface JsonSchema {
  type?: "object" | "string" | "number" | "integer" | "boolean" | "array";
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  additionalProperties?: boolean | JsonSchema;
  enum?: readonly string[];
}

export interface ToolArgumentDefinition {
  name: string;
  required?: boolean;
  schema: JsonSchema;
}

export interface ToolMetadata {
  category: string;
  method: string;
  access: "public" | "private";
  args: readonly ToolArgumentDefinition[];
  description?: string;
}

export interface ResolvedToolDefinition extends ToolMetadata {
  name: string;
  inputSchema: JsonSchema;
}

export interface ExchangeRuntimeDefinition {
  key: ExchangeKey;
  displayName: string;
  createClient: () => Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>;
  getMissingCredentialEnv: () => string[];
  tools: readonly ResolvedToolDefinition[];
}

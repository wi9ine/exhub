import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  type CallToolResult,
  ListToolsRequestSchema,
  type ServerCapabilities,
} from "@modelcontextprotocol/sdk/types.js";

import packageJson from "../package.json";
import { getExchangeRuntime } from "./runtime";
import type {
  ExchangeKey,
  JsonSchema,
  ResolvedToolDefinition,
  ToolArgumentDefinition,
} from "./types";

const SERVER_CAPABILITIES: ServerCapabilities = {
  tools: {
    listChanged: false,
  },
};

export function createExchangeServer(exchange: ExchangeKey): Server {
  const runtime = getExchangeRuntime(exchange);
  const client = runtime.createClient();
  const missingCredentialEnv = runtime.getMissingCredentialEnv();

  validateToolPaths(client, runtime.tools, runtime.displayName);

  const server = new Server(
    {
      name: `exhub-mcp-${exchange}`,
      version: packageJson.version,
    },
    {
      capabilities: SERVER_CAPABILITIES,
      instructions: `${runtime.displayName} 거래소 REST API를 MCP 도구로 제공합니다.`,
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: runtime.tools.map((tool) => ({
      name: tool.name,
      description: tool.description ?? createDefaultToolDescription(runtime.displayName, tool),
      inputSchema: tool.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
    const tool = runtime.tools.find((candidate) => candidate.name === request.params.name);
    if (!tool) {
      return createToolError(`알 수 없는 도구입니다: ${request.params.name}`);
    }

    if (tool.access === "private") {
      if (missingCredentialEnv.length > 0) {
        return createToolError(
          `${runtime.displayName} private API를 사용하려면 다음 환경 변수가 필요합니다: ${missingCredentialEnv.join(", ")}`,
        );
      }
    }

    try {
      const category = client[tool.category];
      const method = category?.[tool.method];
      if (typeof method !== "function") {
        return createToolError(
          `클라이언트 메서드를 찾지 못했습니다: ${tool.category}.${tool.method}`,
        );
      }

      const input = toInputRecord(request.params.arguments);
      const orderedArguments = tool.args.map((argument) => input[argument.name]);

      while (orderedArguments.length > 0 && orderedArguments.at(-1) === undefined) {
        orderedArguments.pop();
      }

      const result = await method(...orderedArguments);
      const structuredContent =
        result && typeof result === "object" && !Array.isArray(result)
          ? (result as Record<string, unknown>)
          : undefined;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
        ...(structuredContent ? { structuredContent } : {}),
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return createToolError(message);
    }
  });

  return server;
}

function validateToolPaths(
  client: Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>,
  tools: readonly ResolvedToolDefinition[],
  exchangeName: string,
): void {
  for (const tool of tools) {
    const category = client[tool.category];
    if (!category || typeof category[tool.method] !== "function") {
      throw new Error(
        `${exchangeName} 클라이언트에 ${tool.category}.${tool.method} 메서드가 존재하지 않습니다.`,
      );
    }
  }
}

function createDefaultToolDescription(
  exchangeName: string,
  tool: Pick<ResolvedToolDefinition, "category" | "method" | "access">,
) {
  const accessLabel = tool.access === "private" ? "private" : "public";
  return `${exchangeName} ${accessLabel} API 메서드 ${tool.category}.${tool.method} 호출`;
}

function toInputRecord(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  return input as Record<string, unknown>;
}

function createToolError(message: string): CallToolResult {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: message,
      },
    ],
  };
}

export function buildToolInputSchema(properties: readonly ToolArgumentDefinition[]): JsonSchema {
  const mappedProperties = Object.fromEntries(
    properties.map((property) => [property.name, property.schema]),
  );
  const required = properties
    .filter((property) => property.required)
    .map((property) => property.name);

  return {
    type: "object",
    properties: mappedProperties,
    additionalProperties: false,
    ...(required.length > 0 ? { required } : {}),
  };
}

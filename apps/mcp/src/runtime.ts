import {
  EXCHANGE_RUNTIME_BASE,
  getExchangeSpecOperationIds,
  getExchangeTools,
  loadExchangeZod,
  type SpecOperationIdMap,
} from "./generated/exchange-runtime";
import { TOOL_SUMMARIES } from "./generated/tool-summaries";
import { buildToolInputZodSchema } from "./schema";
import type {
  ExchangeKey,
  ExchangeRuntimeDefinition,
  ResolvedToolDefinition,
  ToolMetadata,
} from "./types";

const runtimeCache = new Map<ExchangeKey, ExchangeRuntimeDefinition>();

function attachSpecOperationIds(
  exchange: ExchangeKey,
  tools: readonly ToolMetadata[],
  specOperationIds: SpecOperationIdMap,
): readonly ToolMetadata[] {
  const resolvedTools = tools.map((candidate) => {
    const key = `${candidate.category}.${candidate.method}`;
    const specOperationId = specOperationIds[key];

    return {
      ...candidate,
      ...(specOperationId ? { specOperationId } : {}),
    };
  });

  const missing = resolvedTools
    .filter((candidate) => !candidate.description && !candidate.specOperationId)
    .map((candidate) => `${candidate.category}.${candidate.method}`);
  if (missing.length > 0) {
    throw new Error(`${exchange} MCP 도구에 specOperationId가 없습니다: ${missing.join(", ")}`);
  }

  const extra = Object.keys(specOperationIds).filter(
    (key) =>
      !resolvedTools.some((candidate) => `${candidate.category}.${candidate.method}` === key),
  );
  if (extra.length > 0) {
    throw new Error(
      `${exchange} specOperationId 매핑이 실제 도구와 일치하지 않습니다: ${extra.join(", ")}`,
    );
  }

  return resolvedTools;
}

function resolveToolSummary(exchange: ExchangeKey, specOperationId?: string): string | undefined {
  if (!specOperationId) return undefined;
  return TOOL_SUMMARIES[exchange][specOperationId];
}

export function resolveTools(
  exchange: ExchangeKey,
  tools: readonly ToolMetadata[],
): readonly ResolvedToolDefinition[] {
  const duplicates = new Map<string, number>();
  for (const candidate of tools) {
    duplicates.set(candidate.method, (duplicates.get(candidate.method) ?? 0) + 1);
  }

  const resolved = tools.map((candidate) => {
    const name =
      (duplicates.get(candidate.method) ?? 0) > 1
        ? `${candidate.category}_${candidate.method}`
        : candidate.method;
    const inputZodSchema = buildToolInputZodSchema(candidate.args);
    const description =
      candidate.description ?? resolveToolSummary(exchange, candidate.specOperationId);
    const resolvedTool = {
      ...candidate,
      name,
      ...(description ? { description } : {}),
      ...(inputZodSchema ? { inputZodSchema } : {}),
    };

    return resolvedTool;
  });

  // 최종 도구명 유일성 검증
  const seen = new Set<string>();
  const duplicateNames: string[] = [];
  for (const tool of resolved) {
    if (seen.has(tool.name)) {
      duplicateNames.push(tool.name);
    }
    seen.add(tool.name);
  }

  if (duplicateNames.length > 0) {
    throw new Error(`도구 이름이 중복됩니다: ${[...new Set(duplicateNames)].join(", ")}`);
  }

  return resolved;
}

export { requireNamedValidator } from "./generated/exchange-runtime";

export function listSupportedExchanges(): readonly ExchangeKey[] {
  return Object.keys(EXCHANGE_RUNTIME_BASE) as ExchangeKey[];
}

export async function getExchangeRuntime(
  exchange: ExchangeKey,
): Promise<ExchangeRuntimeDefinition> {
  const cached = runtimeCache.get(exchange);
  if (cached) return cached;

  await loadExchangeZod(exchange);
  const rawTools = getExchangeTools(exchange);
  const toolsWithIds = attachSpecOperationIds(
    exchange,
    rawTools,
    getExchangeSpecOperationIds(exchange),
  );
  const tools = resolveTools(exchange, toolsWithIds);

  const runtime: ExchangeRuntimeDefinition = {
    ...EXCHANGE_RUNTIME_BASE[exchange],
    tools,
  };
  runtimeCache.set(exchange, runtime);
  return runtime;
}

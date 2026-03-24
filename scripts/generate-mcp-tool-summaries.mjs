import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "apps/mcp/src/generated/tool-summaries.ts");

const SPEC_FILES = {
  upbit: ["specs/upbit/rest/quotation-api.json", "specs/upbit/rest/exchange-api.json"],
  bithumb: ["specs/bithumb/rest/public-api.json", "specs/bithumb/rest/private-api.json"],
  coinone: ["specs/coinone/rest/public-api.json", "specs/coinone/rest/private-api.json"],
  gopax: ["specs/gopax/rest/public-api.json", "specs/gopax/rest/private-api.json"],
  korbit: ["specs/korbit/rest/public-api.json", "specs/korbit/rest/private-api.json"],
};

function toCamelSeed(value) {
  return String(value)
    .normalize("NFKD")
    .split("")
    .map((char) => (char.charCodeAt(0) > 127 ? " " : char))
    .join("")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();
}

function toSnakeCase(value) {
  const seed = toCamelSeed(value);
  if (!seed) return "";

  return seed
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase())
    .join("_");
}

function fallbackOperationId(method, route) {
  const cleanRoute = route.replace(/^\/v\d+/, "");
  return toSnakeCase(`${method} ${cleanRoute}`);
}

function normalizeOperationId(operationId, method, route) {
  return toSnakeCase(operationId) || fallbackOperationId(method, route);
}

function getOperationSummary(operation) {
  const summary = typeof operation.summary === "string" ? operation.summary.trim() : "";
  if (summary) return summary;

  const description = typeof operation.description === "string" ? operation.description.trim() : "";
  return description || undefined;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function buildSummaryRegistry() {
  const registry = {};

  for (const [exchange, files] of Object.entries(SPEC_FILES)) {
    const exchangeSummaries = {};

    for (const relativePath of files) {
      const spec = loadJson(path.join(ROOT, relativePath));

      for (const [route, methods] of Object.entries(spec.paths ?? {})) {
        for (const [method, operation] of Object.entries(methods ?? {})) {
          if (!operation || typeof operation !== "object") {
            continue;
          }

          const summary = getOperationSummary(operation);
          if (!summary) {
            continue;
          }

          const normalizedOperationId = normalizeOperationId(operation.operationId, method, route);
          const previous = exchangeSummaries[normalizedOperationId];

          if (previous && previous !== summary) {
            throw new Error(
              `${exchange} 스펙에서 같은 operationId에 서로 다른 summary가 있습니다: ${normalizedOperationId}`,
            );
          }

          exchangeSummaries[normalizedOperationId] = summary;
        }
      }
    }

    registry[exchange] = Object.fromEntries(
      Object.entries(exchangeSummaries).sort(([left], [right]) => left.localeCompare(right)),
    );
  }

  return registry;
}

function renderSource(registry) {
  const body = JSON.stringify(registry, null, 2);

  return `import type { ExchangeKey } from "../types";

// 이 파일은 \`pnpm generate\`로 생성됩니다. 직접 수정하지 마세요.
export const TOOL_SUMMARIES: Record<ExchangeKey, Record<string, string>> = ${body};
`;
}

const registry = buildSummaryRegistry();
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, renderSource(registry));
console.log(`생성 완료: ${path.relative(ROOT, OUTPUT_PATH)}`);

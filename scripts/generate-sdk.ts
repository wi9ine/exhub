/**
 * config.yaml + OpenAPI spec에서 types.ts, client.ts를 자동 생성하는 스크립트
 *
 * 사용법: npx tsx scripts/generate-sdk.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─── 타입 정의 ───────────────────────────────────────────────

interface ConfigAuth {
  type: string;
  hashAlgorithm: string;
  credentialFields: Record<string, string>;
  envVars: Record<string, string>;
  autoInjectedParams: string[];
  optionalParams?: Record<string, { type: string; envVar: string }>;
}

interface ConfigSpec {
  id: string;
  path: string;
  access: "public" | "private";
}

interface ConfigCategory {
  tags?: string[];
  operationIds?: string[];
}

interface ExchangeConfig {
  name: string;
  displayName: string;
  auth: ConfigAuth;
  specs: {
    rest: ConfigSpec[];
    ws?: { id: string; path: string }[];
  };
  categories: Record<string, ConfigCategory>;
}

interface OpenApiOperation {
  operationId: string;
  parameters?: OpenApiParameter[];
  requestBody?: {
    content?: {
      "application/json"?: {
        schema?: { type?: string; properties?: Record<string, unknown> };
      };
    };
  };
  responses?: Record<
    string,
    {
      content?: {
        "application/json"?: {
          schema?: { type?: string; items?: unknown; $ref?: string };
        };
      };
    }
  >;
  tags?: string[];
  deprecated?: boolean;
  "x-sdk-defaults"?: Record<string, unknown>;
}

interface OpenApiParameter {
  name: string;
  in: "path" | "query" | "header";
  required?: boolean;
  description?: string;
  schema?: {
    type?: string;
    enum?: unknown[];
    default?: unknown;
  };
}

interface OpenApiSpec {
  paths: Record<string, Record<string, OpenApiOperation>>;
}

// ─── 유틸 함수 ───────────────────────────────────────────────

function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toCamelCase(kebab: string): string {
  const pascal = toPascalCase(kebab);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnakeCase(kebab: string): string {
  return kebab.replace(/-/g, "_");
}

function loadYaml(filePath: string): unknown {
  return YAML.parse(fs.readFileSync(filePath, "utf8"));
}

function loadJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// ─── 오퍼레이션 분석 ─────────────────────────────────────────

interface AnalyzedOperation {
  operationId: string;
  pascalId: string;
  camelId: string;
  method: "GET" | "POST" | "DELETE";
  routePath: string;
  specId: string;
  access: "public" | "private";
  pathParams: {
    name: string;
    camelName: string;
    type: string;
    enumValues?: unknown[];
    defaultValue?: unknown;
    description: string;
  }[];
  hasQueryParams: boolean;
  queryRequiredFields: string[];
  hasBody: boolean;
  bodyFieldCount: number;
  bodyRequiredFields: string[];
  responseIsArray: boolean;
  successStatus: string;
  /** orval이 named type을 생성하지 않는 primitive 응답 (void, string[], number[][] 등) */
  rawResponseType: string | null;
  deprecated: boolean;
  tags: string[];
}

function analyzeOperation(
  routePath: string,
  method: string,
  operation: OpenApiOperation,
  specId: string,
  access: "public" | "private",
): AnalyzedOperation {
  const SUPPORTED_METHODS = ["GET", "POST", "DELETE"] as const;
  const upperMethod = method.toUpperCase();
  if (!SUPPORTED_METHODS.includes(upperMethod as typeof SUPPORTED_METHODS[number])) {
    throw new Error(`지원하지 않는 HTTP 메서드: ${method} (operationId: ${operation.operationId})`);
  }
  const httpMethod = upperMethod as "GET" | "POST" | "DELETE";
  const operationId = operation.operationId;
  const pascalId = toPascalCase(operationId);
  const camelId = toCamelCase(operationId);

  // path params
  const pathParams = (operation.parameters ?? [])
    .filter((p) => p.in === "path")
    .map((p) => ({
      name: p.name,
      camelName: toCamelCase(p.name.replace(/_/g, "-")),
      type: p.schema?.type === "integer" || p.schema?.type === "number" ? "number" : "string",
      enumValues: p.schema?.enum,
      defaultValue: p.schema?.default,
      description: p.description ?? p.name,
    }));

  // query params (excluding path params and header params)
  const queryParams = (operation.parameters ?? []).filter((p) => p.in === "query");
  const hasQueryParams = queryParams.length > 0;
  const queryRequiredFields = queryParams.filter((p) => p.required).map((p) => p.name);

  // request body
  const hasBody = !!operation.requestBody?.content?.["application/json"]?.schema;
  const bodySchema = operation.requestBody?.content?.["application/json"]?.schema;
  const bodyFieldCount = Object.keys(bodySchema?.properties ?? {}).length;
  const bodyRequiredFields: string[] = (bodySchema as { required?: string[] })?.required ?? [];

  // response analysis
  let responseIsArray = false;
  let successStatus = "200";
  let rawResponseType: string | null = null;

  const responses = operation.responses ?? {};

  // 응답 본문이 없는 경우 (void)
  const hasResponseBody = ["200", "201"].some(
    (s) => responses[s]?.content?.["application/json"]?.schema,
  );
  if (!hasResponseBody) {
    rawResponseType = "void";
  }

  for (const status of ["200", "201"]) {
    const resp = responses[status];
    if (resp?.content?.["application/json"]?.schema) {
      successStatus = status;
      const schema = resp.content["application/json"].schema;
      if (schema.type === "array") {
        responseIsArray = true;
        // primitive array 감지: orval이 named type을 생성하지 않는 경우
        const items = schema.items as { type?: string; items?: { type?: string } } | undefined;
        if (items?.type === "string") {
          rawResponseType = "string[]";
        } else if (items?.type === "integer" || items?.type === "number") {
          rawResponseType = "number[]";
        } else if (items?.type === "array") {
          // nested array (e.g., number[][])
          const innerItems = items.items as { type?: string } | undefined;
          if (innerItems?.type === "integer" || innerItems?.type === "number") {
            rawResponseType = "number[][]";
          }
        }
      }
      break;
    }
  }

  // 200과 201 둘 다 있는 경우 (e.g., createDepositAddress)
  const hasMultipleSuccess = responses["200"]?.content?.["application/json"]?.schema &&
    responses["201"]?.content?.["application/json"]?.schema;
  if (hasMultipleSuccess) {
    // 메인은 200, union type으로 처리
    successStatus = "200|201";
  }

  return {
    operationId,
    pascalId,
    camelId,
    method: httpMethod,
    routePath,
    specId,
    access,
    pathParams,
    hasQueryParams,
    queryRequiredFields,
    hasBody,
    bodyFieldCount,
    bodyRequiredFields,
    responseIsArray,
    successStatus,
    rawResponseType,
    deprecated: !!operation.deprecated,
    tags: operation.tags ?? [],
  };
}

function resolveCategory(
  op: AnalyzedOperation,
  categories: Record<string, ConfigCategory>,
): string | null {
  for (const [categoryName, config] of Object.entries(categories)) {
    if (config.tags) {
      for (const tag of op.tags) {
        if (config.tags.includes(tag)) return categoryName;
      }
    }
    if (config.operationIds) {
      if (config.operationIds.includes(op.operationId)) return categoryName;
    }
  }
  return null;
}

// ─── types.ts 생성 ───────────────────────────────────────────

function generateResponseType(op: AnalyzedOperation): string {
  if (op.rawResponseType) return op.rawResponseType;
  if (op.successStatus === "200|201") {
    const base = op.pascalId;
    return `${base}200 | ${base}201`;
  }
  const suffix = op.responseIsArray ? `${op.successStatus}Item[]` : op.successStatus;
  return `${op.pascalId}${suffix}`;
}

/** import해야 할 orval 생성 타입명 (rawResponseType이면 import 불필요) */
function generateResponseTypeName(op: AnalyzedOperation): string[] {
  if (op.rawResponseType) return [];
  if (op.successStatus === "200|201") {
    return [`${op.pascalId}200`, `${op.pascalId}201`];
  }
  if (op.responseIsArray) {
    return [`${op.pascalId}${op.successStatus}Item`];
  }
  return [`${op.pascalId}${op.successStatus}`];
}

function generateParamsTypeName(op: AnalyzedOperation): string | null {
  if (!op.hasQueryParams) return null;
  return `${op.pascalId}Params`;
}

function generateBodyTypeName(op: AnalyzedOperation): string | null {
  if (!op.hasBody) return null;
  return `${op.pascalId}Body`;
}

function wrapWithOmit(typeName: string, omitFields: string[]): string {
  if (omitFields.length === 0) return typeName;
  return `Omit<${typeName}, ${omitFields.map((f) => `"${f}"`).join(" | ")}>`;
}

function generateMethodSignature(
  op: AnalyzedOperation,
  autoInjectedParams: string[],
): string {
  const parts: string[] = [];

  // query params or body 준비
  const paramsType = generateParamsTypeName(op);
  const bodyType = generateBodyTypeName(op);

  // body optional 판단: autoInjectedParams를 제외한 후 required 필드가 없으면 optional
  let bodyIsOptional = false;
  if (bodyType && autoInjectedParams.length > 0) {
    const remainingRequired = op.bodyRequiredFields.filter(
      (f) => !autoInjectedParams.includes(f),
    );
    // required 필드가 모두 autoInjected이거나, non-auth 필드가 없으면 optional
    bodyIsOptional = remainingRequired.length === 0;
  }

  // trailing required param이 있는지 확인 (optional path param 처리용)
  const hasTrailingRequired =
    (paramsType !== null) ||
    (bodyType !== null && !bodyIsOptional);

  // path params
  for (const pp of op.pathParams) {
    const typeStr = pp.enumValues
      ? pp.enumValues.map((v) => JSON.stringify(v)).join(" | ")
      : pp.type;

    if (pp.defaultValue !== undefined) {
      if (hasTrailingRequired) {
        parts.push(`${pp.camelName}: ${typeStr} | undefined`);
      } else {
        parts.push(`${pp.camelName}?: ${typeStr}`);
      }
    } else {
      parts.push(`${pp.camelName}: ${typeStr}`);
    }
  }

  if (paramsType) {
    const typeStr = wrapWithOmit(paramsType, autoInjectedParams);
    parts.push(`params?: ${typeStr}`);
  }

  if (bodyType) {
    const typeStr = wrapWithOmit(bodyType, autoInjectedParams);
    parts.push(`body${bodyIsOptional ? "?" : ""}: ${typeStr}`);
  }

  const responseType = generateResponseType(op);
  const argsStr = parts.length > 0 ? `(${parts.join(", ")})` : "()";
  return `${argsStr} => Promise<${responseType}>`;
}

function generateTypesFile(
  config: ExchangeConfig,
  operationsByCategory: Map<string, AnalyzedOperation[]>,
  operationsBySpec: Map<string, AnalyzedOperation[]>,
): string {
  const exchangeName = toPascalCase(config.name);
  const lines: string[] = [];

  // 이 파일은 자동 생성됩니다
  lines.push("// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.");
  lines.push('import type { ExHubClientOptions } from "@exhub/core";');
  lines.push("");

  // 스펙별 import 수집
  for (const [specId, ops] of operationsBySpec) {
    const typeNames = new Set<string>();
    for (const op of ops) {
      for (const name of generateResponseTypeName(op)) {
        typeNames.add(name);
      }
      const paramsType = generateParamsTypeName(op);
      if (paramsType) typeNames.add(paramsType);
      const bodyType = generateBodyTypeName(op);
      if (bodyType) typeNames.add(bodyType);
    }

    if (typeNames.size > 0) {
      const sorted = [...typeNames].sort();
      lines.push("import type {");
      for (const name of sorted) {
        lines.push(`  ${name},`);
      }
      lines.push(`} from "../generated/${specId}/model";`);
    }
  }

  lines.push("");

  // Credentials 인터페이스
  lines.push(`export interface ${exchangeName}Credentials {`);
  for (const [field, _type] of Object.entries(config.auth.credentialFields)) {
    lines.push(`  ${field}: string;`);
  }
  // optional params from auth
  if (config.auth.optionalParams) {
    for (const [field, opt] of Object.entries(config.auth.optionalParams)) {
      lines.push(`  ${field}?: ${opt.type};`);
    }
  }
  lines.push("}");
  lines.push("");

  // ClientOptions
  lines.push(`export type ${exchangeName}ClientOptions = ExHubClientOptions<${exchangeName}Credentials>;`);
  lines.push("");

  // Coinone/Korbit specific helper types
  if (config.auth.autoInjectedParams.includes("access_token")) {
    lines.push(`export type CreateCoinoneSignedBodyInput = Record<string, unknown> | undefined;`);
    lines.push("");
  }
  if (config.auth.autoInjectedParams.includes("timestamp")) {
    lines.push(`export type ${exchangeName}SignedParamsInput = Record<string, unknown> | undefined;`);
    lines.push("");
  }

  // Client 인터페이스
  lines.push(`export interface ${exchangeName}Client {`);
  for (const [category, ops] of operationsByCategory) {
    lines.push(`  ${category}: {`);
    for (const op of ops) {
      const sig = generateMethodSignature(op, config.auth.autoInjectedParams);
      lines.push(`    ${op.camelId}: ${sig};`);
    }
    lines.push("  };");
  }
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

// ─── client.ts 생성 ──────────────────────────────────────────

function generateClientFile(
  config: ExchangeConfig,
  operationsByCategory: Map<string, AnalyzedOperation[]>,
): string {
  const exchangeName = toPascalCase(config.name);
  const lines: string[] = [];

  lines.push("// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.");
  lines.push(`import { createRequestFunctions } from "./auth";`);
  lines.push(`import type { ${exchangeName}Client, ${exchangeName}ClientOptions } from "./types";`);
  lines.push("");
  lines.push(
    "type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>",
  );
  lines.push("  ? TResult");
  lines.push("  : never;");
  lines.push("");

  // encodePathSegment (필요한 경우)
  const needsEncode = [...operationsByCategory.values()]
    .flat()
    .some((op) => op.pathParams.length > 0 && op.pathParams.some((p) => p.type === "string"));
  if (needsEncode) {
    lines.push("function encodePathSegment(value: string): string {");
    lines.push("  return encodeURIComponent(value);");
    lines.push("}");
    lines.push("");
  }

  lines.push(
    `export function create${exchangeName}Client(options: ${exchangeName}ClientOptions = {}): ${exchangeName}Client {`,
  );
  lines.push("  const { requestPublic, requestPrivate } = createRequestFunctions(options);");
  lines.push("");
  lines.push("  return {");

  for (const [category, ops] of operationsByCategory) {
    lines.push(`    ${category}: {`);
    for (const op of ops) {
      const methodLine = generateClientMethod(op, exchangeName, category, config);
      lines.push(methodLine);
    }
    lines.push("    },");
  }

  lines.push("  };");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

function generateClientMethod(
  op: AnalyzedOperation,
  exchangeName: string,
  category: string,
  config: ExchangeConfig,
): string {
  const resultType = `AsyncResult<${exchangeName}Client["${category}"]["${op.camelId}"]>`;

  // 함수 인자 생성
  const args: string[] = [];
  for (const pp of op.pathParams) {
    if (pp.defaultValue !== undefined) {
      args.push(`${pp.camelName} = ${JSON.stringify(pp.defaultValue)}`);
    } else {
      args.push(pp.camelName);
    }
  }

  if (op.hasQueryParams) args.push("params");
  if (op.hasBody) args.push("body");

  const argsStr = args.length > 0 ? args.join(", ") : "";

  // 경로 생성
  const routePath = generateRoutePath(op);

  // public vs private
  if (op.access === "public") {
    // requestPublic(path, query?)
    const queryArg = op.hasQueryParams ? ", params" : "";
    if (argsStr) {
      return `      ${op.camelId}: async (${argsStr}) =>\n        requestPublic<${resultType}>(${routePath}${queryArg}),`;
    }
    return `      ${op.camelId}: async () =>\n        requestPublic<${resultType}>(${routePath}),`;
  }

  // private - requestPrivate({ method, path, query?, body? })
  const configParts: string[] = [];
  configParts.push(`method: "${op.method}"`);
  configParts.push(`path: ${routePath}`);
  if (op.hasQueryParams) configParts.push("query: params");
  if (op.hasBody) configParts.push("body");

  const configStr = configParts.join(", ");

  if (argsStr) {
    return `      ${op.camelId}: async (${argsStr}) =>\n        requestPrivate<${resultType}>({ ${configStr} }),`;
  }
  return `      ${op.camelId}: async () =>\n        requestPrivate<${resultType}>({ ${configStr} }),`;
}

function generateRoutePath(op: AnalyzedOperation): string {
  if (op.pathParams.length === 0) {
    return `"${op.routePath}"`;
  }

  // 템플릿 리터럴로 변환
  let template = op.routePath;
  for (const pp of op.pathParams) {
    // OpenAPI path param pattern: {param_name}
    const patterns = [
      `{${pp.name}}`,
      `{${pp.name.replace(/([A-Z])/g, "_$1").toLowerCase()}}`, // camelCase → snake_case
    ];
    for (const pattern of patterns) {
      if (template.includes(pattern)) {
        const encode = pp.type === "string" ? `encodePathSegment(${pp.camelName})` : `\${${pp.camelName}}`;
        if (pp.type === "string") {
          template = template.replace(pattern, `\${${encode}}`);
        } else {
          template = template.replace(pattern, encode);
        }
        break;
      }
    }
  }

  return `\`${template}\``;
}

// ─── MCP exchange-runtime.ts 생성 ────────────────────────────

interface McpExchangeData {
  config: ExchangeConfig;
  operationsByCategory: Map<string, AnalyzedOperation[]>;
  operationsBySpec: Map<string, AnalyzedOperation[]>;
}

function generateMcpExchangeRuntime(exchanges: McpExchangeData[]): string {
  const lines: string[] = [];
  lines.push("// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.");
  lines.push("");

  // imports
  for (const { config } of exchanges) {
    const name = config.name;
    const pascalName = toPascalCase(name);
    lines.push(`import { create${pascalName}Client } from "@exhub/${name}";`);
  }
  lines.push('import type { ZodTypeAny } from "zod";');
  lines.push("");
  lines.push('import type { ExchangeKey, ExchangeRuntimeDefinition, ToolArgumentDefinition, ToolMetadata } from "../types";');
  lines.push("");

  // ─── 헬퍼 함수 ───
  lines.push("// ─── 헬퍼 함수 ───");
  lines.push("");
  lines.push("type RuntimeOptions = { baseURL?: string; timeout?: number };");
  lines.push("type ValidatorNamespace = Record<string, unknown>;");
  lines.push("");
  lines.push(`const objectSchema = (description: string): ToolArgumentDefinition["schema"] => ({
  type: "object",
  description,
});

const stringSchema = (description: string): ToolArgumentDefinition["schema"] => ({
  type: "string",
  description,
});

const numberSchema = (description: string): ToolArgumentDefinition["schema"] => ({
  type: "number",
  description,
});

const arg = (
  name: string,
  schema: ToolArgumentDefinition["schema"],
  required = false,
  validator?: ZodTypeAny,
): ToolArgumentDefinition => ({
  name,
  schema,
  required,
  ...(validator ? { validator } : {}),
});

const paramsArg = (required = false, validator?: ZodTypeAny) =>
  arg("params", objectSchema("SDK 메서드에 전달할 query/params 객체"), required, validator);
const bodyArg = (required = true, validator?: ZodTypeAny) =>
  arg("body", objectSchema("SDK 메서드에 전달할 body 객체"), required, validator);
const stringArg = (name: string, description: string, required = true) =>
  arg(name, stringSchema(description), required);
const numberArg = (name: string, description: string, required = true) =>
  arg(name, numberSchema(description), required);`);
  lines.push("");

  lines.push(`export function requireNamedValidator(namespace: ValidatorNamespace, name: string): ZodTypeAny {
  const validator = namespace[name];
  if (!validator) {
    throw new Error(\`generated-zod validator를 찾지 못했습니다: \${name}\`);
  }
  return validator as ZodTypeAny;
}

function createValidatorArgFactory(
  getNamespace: () => ValidatorNamespace | undefined,
  label: string,
) {
  return {
    query(prefix: string, required = false) {
      return paramsArg(
        required,
        requireNamedValidator(requireLoadedNamespace(getNamespace(), label), \`\${prefix}QueryParams\`),
      );
    },
    body(prefix: string, required = true) {
      return bodyArg(
        required,
        requireNamedValidator(requireLoadedNamespace(getNamespace(), label), \`\${prefix}Body\`),
      );
    },
  };
}

function requireLoadedNamespace(
  namespace: ValidatorNamespace | undefined,
  label: string,
): ValidatorNamespace {
  if (!namespace) {
    throw new Error(\`\${label} zod namespace가 아직 로드되지 않았습니다.\`);
  }
  return namespace;
}

function tool(
  category: string,
  method: string,
  access: "public" | "private",
  args: readonly ToolArgumentDefinition[] = [],
  description?: string,
): ToolMetadata {
  return {
    category,
    method,
    access,
    args,
    ...(description ? { description } : {}),
  };
}

function resolveOptions(prefix: string): RuntimeOptions {
  const baseURL = process.env[\`\${prefix}_BASE_URL\`];
  const timeoutValue = process.env[\`\${prefix}_TIMEOUT_MS\`];
  if (!timeoutValue) {
    return baseURL ? { baseURL } : {};
  }
  const timeout = Number(timeoutValue);
  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error(\`\${prefix}_TIMEOUT_MS 값이 올바르지 않습니다: \${timeoutValue}\`);
  }
  return { timeout, ...(baseURL ? { baseURL } : {}) };
}

function resolveCredentialState(requiredEnvNames: readonly string[]) {
  const values = Object.fromEntries(
    requiredEnvNames.map((name) => [name, process.env[name]]),
  ) as Record<string, string | undefined>;
  const missing = requiredEnvNames.filter((name) => !values[name]);
  return { values, missing, hasCredentials: missing.length === 0 };
}

function getRequiredEnvValue(values: Record<string, string | undefined>, name: string): string {
  const value = values[name];
  if (!value) {
    throw new Error(\`\${name} 환경 변수가 필요합니다.\`);
  }
  return value;
}

function parseOptionalNumberEnv(name: string): number | undefined {
  const value = process.env[name];
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(\`\${name} 값이 올바르지 않습니다: \${value}\`);
  }
  return parsed;
}`);
  lines.push("");

  // ─── Zod 변수 및 로딩 ───
  lines.push("// ─── Zod 변수 및 로딩 ───");
  lines.push("");

  for (const { config } of exchanges) {
    for (const spec of config.specs.rest) {
      lines.push(`let ${config.name}${toPascalCase(spec.id)}Zod: ValidatorNamespace | undefined;`);
    }
  }
  lines.push("");

  for (const { config } of exchanges) {
    const name = config.name;
    const restSpecs = config.specs.rest;
    const fnName = `ensure${toPascalCase(name)}ZodLoaded`;
    const varNames = restSpecs.map((s) => `${name}${toPascalCase(s.id)}Zod`);
    const condition = varNames.map((v) => `!${v}`).join(" || ");
    const assignments = restSpecs
      .map((s) => {
        const varName = `${name}${toPascalCase(s.id)}Zod`;
        return `      ${varName} ?? import("@exhub/${name}/zod/${s.id}")`;
      })
      .join(",\n");

    lines.push(`async function ${fnName}() {`);
    lines.push(`  if (${condition}) {`);
    lines.push(`    [${varNames.join(", ")}] = await Promise.all([`);
    lines.push(assignments);
    lines.push("    ]);");
    lines.push("  }");
    lines.push("}");
    lines.push("");
  }

  // Validator arg factories
  lines.push("// ─── Validator arg factories ───");
  lines.push("");
  for (const { config } of exchanges) {
    for (const spec of config.specs.rest) {
      const varName = `${config.name}${toPascalCase(spec.id)}Args`;
      const zodVar = `${config.name}${toPascalCase(spec.id)}Zod`;
      const label = `${config.name} ${spec.id}`;
      lines.push(`const ${varName} = createValidatorArgFactory(() => ${zodVar}, "${label}");`);
    }
  }
  lines.push("");

  // Tool caches
  for (const { config } of exchanges) {
    lines.push(`let ${config.name}ToolsCache: readonly ToolMetadata[] | undefined;`);
  }
  lines.push("");

  // ─── SPEC_OPERATION_IDS ───
  lines.push("// ─── SPEC_OPERATION_IDS ───");
  lines.push("");
  lines.push("export type SpecOperationIdMap = Record<string, string>;");
  lines.push("");

  for (const { config, operationsByCategory } of exchanges) {
    const constName = `${config.name.toUpperCase()}_SPEC_OPERATION_IDS`;
    lines.push(`const ${constName} = {`);
    for (const [category, ops] of operationsByCategory) {
      for (const op of ops) {
        if (op.deprecated) continue;
        lines.push(`  "${category}.${op.camelId}": "${toSnakeCase(op.operationId)}",`);
      }
    }
    lines.push("} as const satisfies SpecOperationIdMap;");
    lines.push("");
  }

  // ─── getTools 함수 ───
  lines.push("// ─── getTools 함수 ───");
  lines.push("");

  for (const { config, operationsByCategory } of exchanges) {
    const pascalName = toPascalCase(config.name);
    const fnName = `get${pascalName}Tools`;
    const cacheName = `${config.name}ToolsCache`;
    const constName = `${config.name.toUpperCase()}_SPEC_OPERATION_IDS`;

    lines.push(`function ${fnName}() {`);
    lines.push(`  if (${cacheName}) return ${cacheName};`);
    lines.push("");
    lines.push(`  ${cacheName} = [`);

    for (const [category, ops] of operationsByCategory) {
      for (const op of ops) {
        if (op.deprecated) continue;
        const toolArgs = generateMcpToolArgs(op, config);
        const argsStr = toolArgs.length > 0 ? `, [${toolArgs.join(", ")}]` : "";
        lines.push(`    tool("${category}", "${op.camelId}", "${op.access}"${argsStr}),`);
      }
    }

    lines.push("  ];");
    lines.push("");
    lines.push(`  return ${cacheName};`);
    lines.push("}");
    lines.push("");
  }

  // ─── EXCHANGE_RUNTIME_BASE ───
  lines.push("// ─── EXCHANGE_RUNTIME_BASE ───");
  lines.push("");
  lines.push(`const EXCHANGE_RUNTIME_BASE: Record<ExchangeKey, Omit<ExchangeRuntimeDefinition, "tools">> = {`);

  for (const { config } of exchanges) {
    const name = config.name;
    const pascalName = toPascalCase(name);
    const envPrefix = `EXHUB_${name.toUpperCase()}`;
    const envVars = config.auth.envVars;
    const envNames = Object.values(envVars);
    const credFields = Object.entries(config.auth.credentialFields);
    const optionalParams = config.auth.optionalParams;

    lines.push(`  ${name}: {`);
    lines.push(`    key: "${name}",`);
    lines.push(`    displayName: "${config.displayName}",`);
    lines.push("    createClient: () => {");
    lines.push(`      const credentialState = resolveCredentialState([${envNames.map((e) => `"${e}"`).join(", ")}]);`);
    lines.push(`      const options = resolveOptions("${envPrefix}");`);

    // Optional number params (e.g., receiveWindow, recvWindow)
    if (optionalParams) {
      for (const [field, opt] of Object.entries(optionalParams)) {
        lines.push(`      const ${field} = parseOptionalNumberEnv("${opt.envVar}");`);
      }
    }

    lines.push(`      return create${pascalName}Client({`);
    lines.push("        ...options,");
    lines.push("        ...(credentialState.hasCredentials");
    lines.push("          ? {");
    lines.push("              credentials: {");
    for (const [field] of credFields) {
      const envName = envVars[field];
      lines.push(`                ${field}: getRequiredEnvValue(credentialState.values, "${envName}"),`);
    }
    if (optionalParams) {
      for (const [field] of Object.entries(optionalParams)) {
        lines.push(`                ...(${field} !== undefined ? { ${field} } : {}),`);
      }
    }
    lines.push("              },");
    lines.push("            }");
    lines.push("          : {}),");
    lines.push(`      }) as unknown as Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>;`);
    lines.push("    },");
    lines.push(`    getMissingCredentialEnv: () =>`);
    lines.push(`      resolveCredentialState([${envNames.map((e) => `"${e}"`).join(", ")}]).missing,`);
    lines.push("  },");
  }

  lines.push("};");
  lines.push("");

  // ─── ensureZodLoaded, getTools exports ───
  lines.push("// ─── exports ───");
  lines.push("");

  lines.push("export { EXCHANGE_RUNTIME_BASE };");
  lines.push("");

  // export getExchangeTools and ensureZodLoaded
  lines.push("export async function loadExchangeZod(exchange: ExchangeKey): Promise<void> {");
  lines.push("  switch (exchange) {");
  for (const { config } of exchanges) {
    const pascalName = toPascalCase(config.name);
    lines.push(`    case "${config.name}":`);
    lines.push(`      await ensure${pascalName}ZodLoaded();`);
    lines.push("      break;");
  }
  lines.push("  }");
  lines.push("}");
  lines.push("");

  lines.push("export function getExchangeTools(exchange: ExchangeKey): readonly ToolMetadata[] {");
  lines.push("  switch (exchange) {");
  for (const { config } of exchanges) {
    const pascalName = toPascalCase(config.name);
    lines.push(`    case "${config.name}":`);
    lines.push(`      return get${pascalName}Tools();`);
  }
  lines.push("  }");
  lines.push("}");
  lines.push("");

  lines.push("export function getExchangeSpecOperationIds(exchange: ExchangeKey): SpecOperationIdMap {");
  lines.push("  switch (exchange) {");
  for (const { config } of exchanges) {
    lines.push(`    case "${config.name}":`);
    lines.push(`      return ${config.name.toUpperCase()}_SPEC_OPERATION_IDS;`);
  }
  lines.push("  }");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

function generateMcpToolArgs(op: AnalyzedOperation, config: ExchangeConfig): string[] {
  const args: string[] = [];
  const autoInjected = config.auth.autoInjectedParams;

  // path params
  for (const pp of op.pathParams) {
    const required = pp.defaultValue === undefined;
    const argFn = pp.type === "number" ? "numberArg" : "stringArg";
    args.push(`${argFn}("${pp.camelName}", "${pp.description}", ${required})`);
  }

  // query params → validator arg factory
  if (op.hasQueryParams) {
    const argsFactory = `${config.name}${toPascalCase(op.specId)}Args`;
    // query required if there are required query params after autoInjected removal
    // We use conservative default: false for most query params
    const queryRequired = hasRequiredQueryParams(op, autoInjected);
    args.push(`${argsFactory}.query("${op.pascalId}", ${queryRequired})`);
  }

  // body → validator arg factory
  if (op.hasBody) {
    const argsFactory = `${config.name}${toPascalCase(op.specId)}Args`;
    const remainingRequired = op.bodyRequiredFields.filter(
      (f) => !autoInjected.includes(f),
    );
    const bodyRequired = remainingRequired.length > 0;
    args.push(`${argsFactory}.body("${op.pascalId}", ${bodyRequired})`);
  }

  return args;
}

function hasRequiredQueryParams(op: AnalyzedOperation, autoInjected: string[]): boolean {
  const remaining = op.queryRequiredFields.filter((f) => !autoInjected.includes(f));
  return remaining.length > 0;
}

// ─── 메인 로직 ───────────────────────────────────────────────

function processExchange(configDir: string): McpExchangeData {
  const configPath = path.join(configDir, "config.yaml");
  const config = loadYaml(configPath) as ExchangeConfig;
  console.log(`처리 중: ${config.displayName} (${config.name})`);

  // REST 스펙만 처리
  const restSpecs = config.specs.rest ?? [];
  const allOperations: AnalyzedOperation[] = [];
  const operationsBySpec = new Map<string, AnalyzedOperation[]>();

  for (const specConfig of restSpecs) {
    const specPath = path.resolve(configDir, specConfig.path);
    const spec = loadJson(specPath) as OpenApiSpec;
    const ops: AnalyzedOperation[] = [];

    for (const [routePath, methods] of Object.entries(spec.paths ?? {})) {
      for (const [method, operation] of Object.entries(methods)) {
        if (!operation || typeof operation !== "object" || !operation.operationId) continue;
        const op = analyzeOperation(routePath, method, operation, specConfig.id, specConfig.access);
        ops.push(op);
        allOperations.push(op);
      }
    }

    operationsBySpec.set(specConfig.id, ops);
  }

  // 카테고리 매핑
  const operationsByCategory = new Map<string, AnalyzedOperation[]>();
  for (const op of allOperations) {
    const category = resolveCategory(op, config.categories);
    if (!category) {
      console.warn(`  경고: ${op.operationId}가 어떤 카테고리에도 속하지 않습니다.`);
      continue;
    }
    if (!operationsByCategory.has(category)) {
      operationsByCategory.set(category, []);
    }
    operationsByCategory.get(category)!.push(op);
  }

  // types.ts 생성
  const exchangePkg = path.join(ROOT, "packages", config.name, "src", "lib");
  const typesContent = generateTypesFile(config, operationsByCategory, operationsBySpec);
  const typesPath = path.join(exchangePkg, "types.ts");
  fs.writeFileSync(typesPath, typesContent);
  console.log(`  생성: ${path.relative(ROOT, typesPath)}`);

  // client.ts 생성
  const clientContent = generateClientFile(config, operationsByCategory);
  const clientPath = path.join(exchangePkg, "client.ts");
  fs.writeFileSync(clientPath, clientContent);
  console.log(`  생성: ${path.relative(ROOT, clientPath)}`);

  return { config, operationsByCategory, operationsBySpec };
}

// ─── 실행 ────────────────────────────────────────────────────

const SPEC_DIR = path.join(ROOT, "packages", "spec");
const exchangeNames = fs
  .readdirSync(SPEC_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(SPEC_DIR, d.name, "config.yaml")))
  .map((d) => d.name);

console.log(`거래소 ${exchangeNames.length}개 발견: ${exchangeNames.join(", ")}`);
console.log("");

const allExchangeData: McpExchangeData[] = [];
for (const exchange of exchangeNames) {
  allExchangeData.push(processExchange(path.join(SPEC_DIR, exchange)));
  console.log("");
}

// MCP exchange-runtime.ts 생성
const mcpGeneratedDir = path.join(ROOT, "apps", "mcp", "src", "generated");
const mcpRuntimeContent = generateMcpExchangeRuntime(allExchangeData);
const mcpRuntimePath = path.join(mcpGeneratedDir, "exchange-runtime.ts");
fs.writeFileSync(mcpRuntimePath, mcpRuntimeContent);
console.log(`생성: ${path.relative(ROOT, mcpRuntimePath)}`);
console.log("");

console.log("SDK 생성 완료!");

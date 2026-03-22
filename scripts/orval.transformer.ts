import { defineTransformer } from "orval";

function toCamelSeed(value: unknown) {
  return String(value)
    .normalize("NFKD")
    .split("")
    .map((char) => (char.charCodeAt(0) > 127 ? " " : char))
    .join("")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();
}

function toSnakeCase(value: unknown) {
  const seed = toCamelSeed(value);
  if (!seed) return "";
  return seed
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase())
    .join("_");
}

function fallbackOperationId(method: string, route: string) {
  return toSnakeCase(`${method} ${route}`);
}

export default defineTransformer((inputSchema) => {
  const doc = structuredClone(inputSchema) as {
    paths?: Record<string, Record<string, Record<string, unknown>>>;
  };

  for (const [route, methods] of Object.entries(doc.paths ?? {})) {
    for (const [method, operation] of Object.entries(methods ?? {})) {
      if (!operation || typeof operation !== "object") {
        continue;
      }

      delete operation.externalDocs;
      delete operation["x-doc-url"];

      const parameters = "parameters" in operation ? operation.parameters : undefined;
      if (Array.isArray(parameters)) {
        operation.parameters = parameters.map((parameter) => {
          const next = { ...parameter };
          delete next.allowReserved;
          return next;
        });
      }

      const currentOperationId = "operationId" in operation ? operation.operationId : undefined;
      operation.operationId = toSnakeCase(currentOperationId) || fallbackOperationId(method, route);
    }
  }

  return doc;
});

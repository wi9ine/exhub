import { z } from "zod";

import type { ToolArgumentDefinition } from "./types";

const stringToUnknownRecord = z.record(z.string(), z.unknown());

function buildArgZodSchema(argument: ToolArgumentDefinition) {
  if (argument.validator) {
    return argument.validator;
  }

  switch (argument.schema.type) {
    case "string":
      return z.string().describe(argument.schema.description ?? "");
    case "number":
    case "integer":
      return z.number().describe(argument.schema.description ?? "");
    case "boolean":
      return z.boolean().describe(argument.schema.description ?? "");
    default:
      return stringToUnknownRecord.describe(argument.schema.description ?? "");
  }
}

export function buildToolInputZodSchema(properties: readonly ToolArgumentDefinition[]) {
  if (properties.length === 0) {
    return undefined;
  }

  const shape = Object.fromEntries(
    properties.map((property) => [
      property.name,
      property.required ? buildArgZodSchema(property) : buildArgZodSchema(property).optional(),
    ]),
  );

  return z.object(shape);
}

import { defineConfig } from "orval";

const ROOT = "/Users/nukeguys/Projects/exhub";

function createTarget({ input, output }: { input: string; output: string }) {
  return {
    input: {
      target: input,
      override: {
        transformer: `${ROOT}/scripts/orval.transformer.ts`,
      },
    },
    output: {
      target: output,
      schemas: `${output.replace(/\/index\.ts$/, "")}/model`,
      client: "axios-functions" as const,
      mode: "split" as const,
      clean: true,
      prettier: false,
      biome: false,
    },
  };
}

function createZodTarget({ input, output }: { input: string; output: string }) {
  return {
    input: {
      target: input,
      override: {
        transformer: `${ROOT}/scripts/orval.transformer.ts`,
      },
    },
    output: {
      target: output,
      client: "zod" as const,
      mode: "single" as const,
      clean: true,
      prettier: false,
      biome: false,
      override: {
        zod: {
          generate: {
            body: true,
            query: true,
            param: true,
            header: true,
            response: false,
          },
        },
      },
    },
  };
}

export default defineConfig({
  upbitQuotation: createTarget({
    input: `${ROOT}/packages/spec/upbit/rest/quotation-api.json`,
    output: `${ROOT}/packages/upbit/src/generated/quotation/index.ts`,
  }),
  upbitQuotationZod: createZodTarget({
    input: `${ROOT}/packages/spec/upbit/rest/quotation-api.json`,
    output: `${ROOT}/packages/upbit/src/generated-zod/quotation/index.ts`,
  }),
  upbitExchange: createTarget({
    input: `${ROOT}/packages/spec/upbit/rest/exchange-api.json`,
    output: `${ROOT}/packages/upbit/src/generated/exchange/index.ts`,
  }),
  upbitExchangeZod: createZodTarget({
    input: `${ROOT}/packages/spec/upbit/rest/exchange-api.json`,
    output: `${ROOT}/packages/upbit/src/generated-zod/exchange/index.ts`,
  }),
  bithumbPublic: createTarget({
    input: `${ROOT}/packages/spec/bithumb/rest/public-api.json`,
    output: `${ROOT}/packages/bithumb/src/generated/public/index.ts`,
  }),
  bithumbPublicZod: createZodTarget({
    input: `${ROOT}/packages/spec/bithumb/rest/public-api.json`,
    output: `${ROOT}/packages/bithumb/src/generated-zod/public/index.ts`,
  }),
  bithumbPrivate: createTarget({
    input: `${ROOT}/packages/spec/bithumb/rest/private-api.json`,
    output: `${ROOT}/packages/bithumb/src/generated/private/index.ts`,
  }),
  bithumbPrivateZod: createZodTarget({
    input: `${ROOT}/packages/spec/bithumb/rest/private-api.json`,
    output: `${ROOT}/packages/bithumb/src/generated-zod/private/index.ts`,
  }),
  coinonePublic: createTarget({
    input: `${ROOT}/packages/spec/coinone/rest/public-api.json`,
    output: `${ROOT}/packages/coinone/src/generated/public/index.ts`,
  }),
  coinonePublicZod: createZodTarget({
    input: `${ROOT}/packages/spec/coinone/rest/public-api.json`,
    output: `${ROOT}/packages/coinone/src/generated-zod/public/index.ts`,
  }),
  coinonePrivate: createTarget({
    input: `${ROOT}/packages/spec/coinone/rest/private-api.json`,
    output: `${ROOT}/packages/coinone/src/generated/private/index.ts`,
  }),
  coinonePrivateZod: createZodTarget({
    input: `${ROOT}/packages/spec/coinone/rest/private-api.json`,
    output: `${ROOT}/packages/coinone/src/generated-zod/private/index.ts`,
  }),
  korbitPublic: createTarget({
    input: `${ROOT}/packages/spec/korbit/rest/public-api.json`,
    output: `${ROOT}/packages/korbit/src/generated/public/index.ts`,
  }),
  korbitPublicZod: createZodTarget({
    input: `${ROOT}/packages/spec/korbit/rest/public-api.json`,
    output: `${ROOT}/packages/korbit/src/generated-zod/public/index.ts`,
  }),
  korbitPrivate: createTarget({
    input: `${ROOT}/packages/spec/korbit/rest/private-api.json`,
    output: `${ROOT}/packages/korbit/src/generated/private/index.ts`,
  }),
  korbitPrivateZod: createZodTarget({
    input: `${ROOT}/packages/spec/korbit/rest/private-api.json`,
    output: `${ROOT}/packages/korbit/src/generated-zod/private/index.ts`,
  }),
  gopaxPublic: createTarget({
    input: `${ROOT}/packages/spec/gopax/rest/public-api.json`,
    output: `${ROOT}/packages/gopax/src/generated/public/index.ts`,
  }),
  gopaxPublicZod: createZodTarget({
    input: `${ROOT}/packages/spec/gopax/rest/public-api.json`,
    output: `${ROOT}/packages/gopax/src/generated-zod/public/index.ts`,
  }),
  gopaxPrivate: createTarget({
    input: `${ROOT}/packages/spec/gopax/rest/private-api.json`,
    output: `${ROOT}/packages/gopax/src/generated/private/index.ts`,
  }),
  gopaxPrivateZod: createZodTarget({
    input: `${ROOT}/packages/spec/gopax/rest/private-api.json`,
    output: `${ROOT}/packages/gopax/src/generated-zod/private/index.ts`,
  }),
});

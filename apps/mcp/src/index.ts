#!/usr/bin/env node

import { pathToFileURL } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import packageJson from "../package.json";
import { formatUsage, parseCliArgs } from "./cli";
import { createExchangeServer } from "./server";

async function main() {
  const parsed = parseCliArgs(process.argv.slice(2));
  if (!parsed.ok) {
    console.error(parsed.message);
    process.exit(1);
  }

  const server = await createExchangeServer(parsed.exchange);
  const transport = new StdioServerTransport();

  let isClosing = false;
  const closeServer = async (signal?: string) => {
    if (isClosing) return;
    isClosing = true;

    try {
      await server.close();
    } finally {
      if (signal) {
        process.exit(0);
      }
    }
  };

  process.on("SIGINT", () => {
    void closeServer("SIGINT");
  });
  process.on("SIGTERM", () => {
    void closeServer("SIGTERM");
  });

  await server.connect(transport);
  console.error(
    `exhub-mcp ${packageJson.version} (${parsed.exchange}) 서버가 stdio에서 실행 중입니다.`,
  );
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  void main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message || formatUsage());
    process.exit(1);
  });
}

import { listSupportedExchanges } from "./runtime";
import type { ExchangeKey } from "./types";

export interface ParseCliArgsSuccess {
  ok: true;
  exchange: ExchangeKey;
}

export interface ParseCliArgsFailure {
  ok: false;
  message: string;
}

export type ParseCliArgsResult = ParseCliArgsSuccess | ParseCliArgsFailure;

export function formatUsage(): string {
  return [
    "사용법: exhub-mcp --exchange <exchange>",
    `지원 거래소: ${listSupportedExchanges().join(", ")}`,
  ].join("\n");
}

export function parseCliArgs(args: readonly string[]): ParseCliArgsResult {
  if (args.length !== 2 || args[0] !== "--exchange") {
    return {
      ok: false,
      message: formatUsage(),
    };
  }

  const exchange = args[1];
  if (!listSupportedExchanges().includes(exchange as ExchangeKey)) {
    return {
      ok: false,
      message: `지원하지 않는 거래소입니다: ${exchange}\n${formatUsage()}`,
    };
  }

  return {
    ok: true,
    exchange: exchange as ExchangeKey,
  };
}

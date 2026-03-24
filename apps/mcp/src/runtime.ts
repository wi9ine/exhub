import { createBithumbClient } from "@exhub/bithumb";
import { createCoinoneClient } from "@exhub/coinone";
import { createGopaxClient } from "@exhub/gopax";
import { createKorbitClient } from "@exhub/korbit";
import { createUpbitClient } from "@exhub/upbit";

import { buildToolInputSchema } from "./server";
import type {
  ExchangeKey,
  ExchangeRuntimeDefinition,
  JsonSchema,
  ResolvedToolDefinition,
  ToolArgumentDefinition,
  ToolMetadata,
} from "./types";

type RuntimeOptions = {
  baseURL?: string;
  timeout?: number;
};

const objectSchema = (description: string): JsonSchema => ({
  type: "object",
  description,
  additionalProperties: true,
});

const stringSchema = (description: string): JsonSchema => ({
  type: "string",
  description,
});

const numberSchema = (description: string): JsonSchema => ({
  type: "number",
  description,
});

const arg = (name: string, schema: JsonSchema, required = false): ToolArgumentDefinition => ({
  name,
  schema,
  required,
});

const paramsArg = (required = false) =>
  arg("params", objectSchema("SDK 메서드에 전달할 query/params 객체"), required);
const bodyArg = (required = true) =>
  arg("body", objectSchema("SDK 메서드에 전달할 body 객체"), required);
const stringArg = (name: string, description: string, required = true) =>
  arg(name, stringSchema(description), required);
const numberArg = (name: string, description: string, required = true) =>
  arg(name, numberSchema(description), required);

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

export function resolveTools(tools: readonly ToolMetadata[]): readonly ResolvedToolDefinition[] {
  const duplicates = new Map<string, number>();
  for (const candidate of tools) {
    duplicates.set(candidate.method, (duplicates.get(candidate.method) ?? 0) + 1);
  }

  const resolved = tools.map((candidate) => {
    const name =
      (duplicates.get(candidate.method) ?? 0) > 1
        ? `${candidate.category}.${candidate.method}`
        : candidate.method;

    return {
      ...candidate,
      name,
      inputSchema: buildToolInputSchema(candidate.args),
    };
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

function resolveOptions(prefix: string): RuntimeOptions {
  const baseURL = process.env[`${prefix}_BASE_URL`];
  const timeoutValue = process.env[`${prefix}_TIMEOUT_MS`];

  if (!timeoutValue) {
    return baseURL ? { baseURL } : {};
  }

  const timeout = Number(timeoutValue);
  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error(`${prefix}_TIMEOUT_MS 값이 올바르지 않습니다: ${timeoutValue}`);
  }

  return {
    timeout,
    ...(baseURL ? { baseURL } : {}),
  };
}

function resolveCredentialState(requiredEnvNames: readonly string[]) {
  const values = Object.fromEntries(
    requiredEnvNames.map((name) => [name, process.env[name]]),
  ) as Record<string, string | undefined>;
  const missing = requiredEnvNames.filter((name) => !values[name]);

  return {
    values,
    missing,
    hasCredentials: missing.length === 0,
  };
}

function getRequiredEnvValue(values: Record<string, string | undefined>, name: string): string {
  const value = values[name];
  if (!value) {
    throw new Error(`${name} 환경 변수가 필요합니다.`);
  }

  return value;
}

function parseOptionalNumberEnv(name: string): number | undefined {
  const value = process.env[name];
  if (!value) return undefined;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} 값이 올바르지 않습니다: ${value}`);
  }

  return parsed;
}

const UPBIT_TOOLS = resolveTools([
  tool("tradingPairs", "listTradingPairs", "public", [paramsArg()]),
  tool("candles", "listCandlesSeconds", "public", [paramsArg(true)]),
  tool("candles", "listCandlesMinutes", "public", [
    numberArg("unit", "분 캔들 단위", true),
    paramsArg(true),
  ]),
  tool("candles", "listCandlesDays", "public", [paramsArg(true)]),
  tool("candles", "listCandlesWeeks", "public", [paramsArg(true)]),
  tool("candles", "listCandlesMonths", "public", [paramsArg(true)]),
  tool("candles", "listCandlesYears", "public", [paramsArg(true)]),
  tool("trades", "recentTradesHistory", "public", [paramsArg(true)]),
  tool("tickers", "listTickers", "public", [paramsArg(true)]),
  tool("tickers", "listQuoteTickers", "public", [paramsArg(true)]),
  tool("orderbook", "listOrderbooks", "public", [paramsArg(true)]),
  tool("orderbook", "listOrderbookInstruments", "public", [paramsArg(true)]),
  tool("orderbook", "listOrderbookLevels", "public", [paramsArg(true)]),
  tool("assets", "getBalance", "private"),
  tool("orders", "availableOrderInformation", "private", [paramsArg(true)]),
  tool("orders", "newOrder", "private", [bodyArg()]),
  tool("orders", "testOrder", "private", [bodyArg()]),
  tool("orders", "getOrder", "private", [paramsArg()]),
  tool("orders", "cancelOrder", "private", [paramsArg()]),
  tool("orders", "listOrdersByIds", "private", [paramsArg()]),
  tool("orders", "cancelOrdersByIds", "private", [paramsArg()]),
  tool("orders", "listOpenOrders", "private", [paramsArg()]),
  tool("orders", "batchCancelOrders", "private", [paramsArg()]),
  tool("orders", "listClosedOrders", "private", [paramsArg()]),
  tool("orders", "cancelAndNewOrder", "private", [bodyArg()]),
  tool("withdrawals", "availableWithdrawalInformation", "private", [paramsArg(true)]),
  tool("withdrawals", "listWithdrawalAddresses", "private"),
  tool("withdrawals", "withdraw", "private", [bodyArg()]),
  tool("withdrawals", "cancelWithdrawal", "private", [paramsArg(true)]),
  tool("withdrawals", "withdrawKrw", "private", [bodyArg()]),
  tool("withdrawals", "getWithdrawal", "private", [paramsArg()]),
  tool("withdrawals", "listWithdrawals", "private", [paramsArg()]),
  tool("deposits", "availableDepositInformation", "private", [paramsArg(true)]),
  tool("deposits", "createDepositAddress", "private", [bodyArg()]),
  tool("deposits", "getDepositAddress", "private", [paramsArg(true)]),
  tool("deposits", "listDepositAddresses", "private"),
  tool("deposits", "depositKrw", "private", [bodyArg()]),
  tool("deposits", "getDeposit", "private", [paramsArg()]),
  tool("deposits", "listDeposits", "private", [paramsArg()]),
  tool("travelRule", "listTravelruleVasps", "private"),
  tool("travelRule", "verifyTravelruleByUuid", "private", [bodyArg()]),
  tool("travelRule", "verifyTravelruleByTxid", "private", [bodyArg()]),
  tool("service", "getServiceStatus", "private"),
  tool("service", "listApiKeys", "private"),
]);

const BITHUMB_TOOLS = resolveTools([
  tool("markets", "getMarketAll", "public", [paramsArg()]),
  tool("markets", "getMarketVirtualAssetWarning", "public"),
  tool("candles", "minute1", "public", [paramsArg(true), numberArg("unit", "분 캔들 단위", false)]),
  tool("candles", "day", "public", [paramsArg(true)]),
  tool("candles", "week", "public", [paramsArg(true)]),
  tool("candles", "month", "public", [paramsArg(true)]),
  tool("trades", "getTradesTicks", "public", [paramsArg(true)]),
  tool("tickers", "getTicker", "public", [paramsArg(true)]),
  tool("orderbook", "getOrderbook", "public", [paramsArg(true)]),
  tool("service", "getNotices", "public"),
  tool("service", "getFeeInfo", "public", [stringArg("currency", "조회할 통화 코드", true)]),
  tool("service", "getStatusWallet", "private"),
  tool("service", "api", "private"),
  tool("accounts", "getAccounts", "private"),
  tool("orders", "getOrdersChance", "private", [paramsArg(true)]),
  tool("orders", "placeOrder", "private", [bodyArg()]),
  tool("orders", "placeBatchOrders", "private", [bodyArg()]),
  tool("orders", "getOrder", "private", [paramsArg()]),
  tool("orders", "cancelOrder", "private", [paramsArg()]),
  tool("orders", "cancelOrders", "private", [bodyArg()]),
  tool("orders", "getOrders", "private", [paramsArg()]),
  tool("orders", "getTwapOrders", "private", [paramsArg()]),
  tool("orders", "cancelTwapOrder", "private", [paramsArg(true)]),
  tool("orders", "createTwapOrder", "private", [paramsArg(true)]),
  tool("withdrawals", "getWithdraws", "private", [paramsArg()]),
  tool("withdrawals", "getWithdrawsKrw", "private", [paramsArg()]),
  tool("withdrawals", "getWithdraw", "private", [paramsArg(true)]),
  tool("withdrawals", "getWithdrawsChance", "private", [paramsArg(true)]),
  tool("withdrawals", "getWithdrawsCoinAddresses", "private"),
  tool("withdrawals", "withdrawCoin", "private", [bodyArg()]),
  tool("withdrawals", "withdrawKrw", "private", [bodyArg()]),
  tool("deposits", "getDeposits", "private", [paramsArg()]),
  tool("deposits", "getDepositsKrw", "private", [paramsArg()]),
  tool("deposits", "getDeposit", "private", [paramsArg(true)]),
  tool("deposits", "getDepositsCoinAddresses", "private"),
  tool("deposits", "getDepositsCoinAddress", "private", [paramsArg(true)]),
  tool("deposits", "depositKrw", "private", [bodyArg()]),
  tool("deposits", "generateCoinAddress", "private", [bodyArg()]),
]);

const COINONE_TOOLS = resolveTools([
  tool("market", "rangeUnit", "public", [
    stringArg("quoteCurrency", "quote currency", false),
    stringArg("targetCurrency", "target currency", false),
  ]),
  tool("market", "markets", "public", [stringArg("quoteCurrency", "quote currency", false)]),
  tool("market", "market", "public", [
    stringArg("quoteCurrency", "quote currency", false),
    stringArg("targetCurrency", "target currency", false),
  ]),
  tool("market", "orderbook", "public", [
    stringArg("quoteCurrency", "quote currency", false),
    stringArg("targetCurrency", "target currency", false),
    paramsArg(),
  ]),
  tool("market", "recentCompletedOrders", "public", [
    stringArg("quoteCurrency", "quote currency", false),
    stringArg("targetCurrency", "target currency", false),
    paramsArg(),
  ]),
  tool("market", "tickers", "public", [
    stringArg("quoteCurrency", "quote currency", false),
    paramsArg(),
  ]),
  tool("market", "ticker", "public", [
    stringArg("quoteCurrency", "quote currency", false),
    stringArg("targetCurrency", "target currency", false),
    paramsArg(),
  ]),
  tool("market", "utcTickers", "public", [
    stringArg("quoteCurrency", "quote currency", false),
    paramsArg(),
  ]),
  tool("market", "utcTicker", "public", [
    stringArg("quoteCurrency", "quote currency", false),
    stringArg("targetCurrency", "target currency", false),
    paramsArg(),
  ]),
  tool("market", "currencies", "public"),
  tool("market", "currency", "public", [stringArg("currency", "통화 코드", false)]),
  tool("market", "chart", "public", [
    stringArg("quoteCurrency", "quote currency", true),
    stringArg("targetCurrency", "target currency", true),
    paramsArg(true),
  ]),
  tool("market", "orderbookDeprecated", "public", [paramsArg()]),
  tool("market", "tickerDeprecated", "public", [paramsArg()]),
  tool("market", "tickerUtcDeprecated", "public", [paramsArg()]),
  tool("market", "recentCompletedOrdersDeprecated", "public", [paramsArg()]),
  tool("account", "findBalance", "private"),
  tool("account", "findBalanceByCurrencies", "private", [bodyArg()]),
  tool("account", "findAllTradeFees", "private"),
  tool("account", "findTradeFeeByPair", "private", [
    stringArg("quoteCurrency", "quote currency", false),
    stringArg("targetCurrency", "target currency", false),
    bodyArg(false),
  ]),
  tool("orders", "findActiveOrders", "private", [bodyArg(false)]),
  tool("orders", "placeOrder", "private", [bodyArg()]),
  tool("orders", "placeLimitOrder", "private", [bodyArg()]),
  tool("orders", "cancelOrders", "private", [bodyArg()]),
  tool("orders", "cancelOrder", "private", [bodyArg()]),
  tool("orders", "orderDetail", "private", [bodyArg()]),
  tool("orders", "findAllCompletedOrders", "private", [bodyArg()]),
  tool("orders", "findCompletedOrders", "private", [bodyArg()]),
  tool("orders", "findAllOpenOrders", "private", [bodyArg(false)]),
  tool("orders", "findOpenOrders", "private", [bodyArg()]),
  tool("orders", "findOrderInfo", "private", [bodyArg()]),
  tool("transactions", "krwTransactionHistory", "private", [bodyArg(false)]),
  tool("transactions", "coinTransactionHistory", "private", [bodyArg(false)]),
  tool("transactions", "singleCoinTransactionHistory", "private", [bodyArg()]),
  tool("transactions", "coinWithdrawalLimit", "private", [bodyArg()]),
  tool("transactions", "coinWithdrawalAddressBook", "private", [bodyArg(false)]),
  tool("transactions", "coinWithdrawal", "private", [bodyArg()]),
  tool("rewards", "orderRewardPrograms", "private", [bodyArg(false)]),
  tool("rewards", "orderRewardHistory", "private", [bodyArg(false)]),
]);

const GOPAX_TOOLS = resolveTools([
  tool("market", "assets", "public"),
  tool("market", "tradingPairs", "public"),
  tool("market", "priceTickSize", "public", [stringArg("tradingPair", "거래 페어", true)]),
  tool("market", "ticker", "public", [stringArg("tradingPair", "거래 페어", true)]),
  tool("market", "orderbook", "public", [stringArg("tradingPair", "거래 페어", true), paramsArg()]),
  tool("market", "trades", "public", [stringArg("tradingPair", "거래 페어", true), paramsArg()]),
  tool("market", "stats", "public", [stringArg("tradingPair", "거래 페어", true)]),
  tool("market", "allStats", "public"),
  tool("market", "candles", "public", [
    stringArg("tradingPair", "거래 페어", true),
    paramsArg(true),
  ]),
  tool("market", "cautions", "public", [paramsArg()]),
  tool("market", "tickers", "public"),
  tool("market", "time", "public"),
  tool("market", "notices", "public", [paramsArg()]),
  tool("account", "getBalances", "private"),
  tool("account", "getBalance", "private", [stringArg("assetName", "자산 코드", true)]),
  tool("orders", "getOrders", "private", [paramsArg()]),
  tool("orders", "placeOrder", "private", [bodyArg()]),
  tool("orders", "getOrder", "private", [stringArg("orderId", "주문 ID", true)]),
  tool("orders", "cancelOrder", "private", [stringArg("orderId", "주문 ID", true)]),
  tool("orders", "getOrderByClientOrderId", "private", [
    stringArg("clientOrderId", "클라이언트 주문 ID", true),
  ]),
  tool("orders", "cancelOrderByClientOrderId", "private", [
    stringArg("clientOrderId", "클라이언트 주문 ID", true),
  ]),
  tool("trades", "getTrades", "private", [paramsArg()]),
  tool("wallet", "getDepositWithdrawalStatus", "private", [paramsArg()]),
  tool("wallet", "getCryptoDepositAddresses", "private"),
  tool("wallet", "getCryptoWithdrawalAddresses", "private"),
  tool("wallet", "withdraw", "private", [bodyArg()]),
]);

const KORBIT_TOOLS = resolveTools([
  tool("market", "tickers", "public", [paramsArg()]),
  tool("market", "orderbook", "public", [paramsArg(true)]),
  tool("market", "trades", "public", [paramsArg(true)]),
  tool("market", "candles", "public", [paramsArg(true)]),
  tool("market", "currencyPairs", "public"),
  tool("market", "tickSizePolicy", "public", [paramsArg(true)]),
  tool("market", "currencies", "public"),
  tool("market", "time", "public"),
  tool("orders", "placeOrder", "private", [bodyArg()]),
  tool("orders", "cancelOrder", "private", [paramsArg(true)]),
  tool("orders", "getOrder", "private", [paramsArg(true)]),
  tool("orders", "getOpenOrders", "private", [paramsArg(true)]),
  tool("orders", "getAllOrders", "private", [paramsArg(true)]),
  tool("orders", "getMyTrades", "private", [paramsArg(true)]),
  tool("assets", "getBalance", "private", [paramsArg()]),
  tool("cryptoDeposits", "getDepositAddresses", "private"),
  tool("cryptoDeposits", "createDepositAddress", "private", [bodyArg()]),
  tool("cryptoDeposits", "getDepositAddress", "private", [paramsArg(true)]),
  tool("cryptoDeposits", "getRecentDeposits", "private", [paramsArg(true)]),
  tool("cryptoDeposits", "getDeposit", "private", [paramsArg(true)]),
  tool("cryptoWithdrawals", "getWithdrawableAddresses", "private"),
  tool("cryptoWithdrawals", "getWithdrawableAmount", "private", [paramsArg()]),
  tool("cryptoWithdrawals", "withdraw", "private", [bodyArg()]),
  tool("cryptoWithdrawals", "cancelWithdrawal", "private", [paramsArg(true)]),
  tool("cryptoWithdrawals", "getRecentWithdrawals", "private", [paramsArg(true)]),
  tool("cryptoWithdrawals", "getWithdrawal", "private", [paramsArg(true)]),
  tool("krw", "sendDepositPush", "private", [bodyArg()]),
  tool("krw", "sendWithdrawalPush", "private", [bodyArg()]),
  tool("krw", "getRecentDeposits", "private", [paramsArg(true)]),
  tool("krw", "getRecentWithdrawals", "private", [paramsArg(true)]),
  tool("service", "getTradingFeePolicy", "private", [paramsArg()]),
  tool("service", "getCurrentKeyInfo", "private"),
]);

const EXCHANGE_RUNTIMES: Record<ExchangeKey, ExchangeRuntimeDefinition> = {
  upbit: {
    key: "upbit",
    displayName: "Upbit",
    createClient: () => {
      const credentialState = resolveCredentialState([
        "EXHUB_UPBIT_ACCESS_KEY",
        "EXHUB_UPBIT_SECRET_KEY",
      ]);
      const options = resolveOptions("EXHUB_UPBIT");
      return createUpbitClient({
        ...options,
        ...(credentialState.hasCredentials
          ? {
              credentials: {
                accessKey: getRequiredEnvValue(credentialState.values, "EXHUB_UPBIT_ACCESS_KEY"),
                secretKey: getRequiredEnvValue(credentialState.values, "EXHUB_UPBIT_SECRET_KEY"),
              },
            }
          : {}),
      }) as unknown as Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>;
    },
    getMissingCredentialEnv: () =>
      resolveCredentialState(["EXHUB_UPBIT_ACCESS_KEY", "EXHUB_UPBIT_SECRET_KEY"]).missing,
    tools: UPBIT_TOOLS,
  },
  bithumb: {
    key: "bithumb",
    displayName: "Bithumb",
    createClient: () => {
      const credentialState = resolveCredentialState([
        "EXHUB_BITHUMB_API_KEY",
        "EXHUB_BITHUMB_SECRET_KEY",
      ]);
      const options = resolveOptions("EXHUB_BITHUMB");
      return createBithumbClient({
        ...options,
        ...(credentialState.hasCredentials
          ? {
              credentials: {
                apiKey: getRequiredEnvValue(credentialState.values, "EXHUB_BITHUMB_API_KEY"),
                secretKey: getRequiredEnvValue(credentialState.values, "EXHUB_BITHUMB_SECRET_KEY"),
              },
            }
          : {}),
      }) as unknown as Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>;
    },
    getMissingCredentialEnv: () =>
      resolveCredentialState(["EXHUB_BITHUMB_API_KEY", "EXHUB_BITHUMB_SECRET_KEY"]).missing,
    tools: BITHUMB_TOOLS,
  },
  coinone: {
    key: "coinone",
    displayName: "Coinone",
    createClient: () => {
      const credentialState = resolveCredentialState([
        "EXHUB_COINONE_ACCESS_TOKEN",
        "EXHUB_COINONE_SECRET_KEY",
      ]);
      const options = resolveOptions("EXHUB_COINONE");
      return createCoinoneClient({
        ...options,
        ...(credentialState.hasCredentials
          ? {
              credentials: {
                accessToken: getRequiredEnvValue(
                  credentialState.values,
                  "EXHUB_COINONE_ACCESS_TOKEN",
                ),
                secretKey: getRequiredEnvValue(credentialState.values, "EXHUB_COINONE_SECRET_KEY"),
              },
            }
          : {}),
      }) as unknown as Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>;
    },
    getMissingCredentialEnv: () =>
      resolveCredentialState(["EXHUB_COINONE_ACCESS_TOKEN", "EXHUB_COINONE_SECRET_KEY"]).missing,
    tools: COINONE_TOOLS,
  },
  gopax: {
    key: "gopax",
    displayName: "GOPAX",
    createClient: () => {
      const credentialState = resolveCredentialState([
        "EXHUB_GOPAX_API_KEY",
        "EXHUB_GOPAX_SECRET_KEY",
      ]);
      const options = resolveOptions("EXHUB_GOPAX");
      const receiveWindow = parseOptionalNumberEnv("EXHUB_GOPAX_RECEIVE_WINDOW");
      return createGopaxClient({
        ...options,
        ...(credentialState.hasCredentials
          ? {
              credentials: {
                apiKey: getRequiredEnvValue(credentialState.values, "EXHUB_GOPAX_API_KEY"),
                secretKey: getRequiredEnvValue(credentialState.values, "EXHUB_GOPAX_SECRET_KEY"),
                ...(receiveWindow !== undefined ? { receiveWindow } : {}),
              },
            }
          : {}),
      }) as unknown as Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>;
    },
    getMissingCredentialEnv: () =>
      resolveCredentialState(["EXHUB_GOPAX_API_KEY", "EXHUB_GOPAX_SECRET_KEY"]).missing,
    tools: GOPAX_TOOLS,
  },
  korbit: {
    key: "korbit",
    displayName: "Korbit",
    createClient: () => {
      const credentialState = resolveCredentialState([
        "EXHUB_KORBIT_API_KEY",
        "EXHUB_KORBIT_SECRET_KEY",
      ]);
      const options = resolveOptions("EXHUB_KORBIT");
      const recvWindow = parseOptionalNumberEnv("EXHUB_KORBIT_RECV_WINDOW");
      return createKorbitClient({
        ...options,
        ...(credentialState.hasCredentials
          ? {
              credentials: {
                apiKey: getRequiredEnvValue(credentialState.values, "EXHUB_KORBIT_API_KEY"),
                secretKey: getRequiredEnvValue(credentialState.values, "EXHUB_KORBIT_SECRET_KEY"),
                ...(recvWindow !== undefined ? { recvWindow } : {}),
              },
            }
          : {}),
      }) as unknown as Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>;
    },
    getMissingCredentialEnv: () =>
      resolveCredentialState(["EXHUB_KORBIT_API_KEY", "EXHUB_KORBIT_SECRET_KEY"]).missing,
    tools: KORBIT_TOOLS,
  },
};

export function listSupportedExchanges(): readonly ExchangeKey[] {
  return Object.keys(EXCHANGE_RUNTIMES) as ExchangeKey[];
}

export function getExchangeRuntime(exchange: ExchangeKey): ExchangeRuntimeDefinition {
  return EXCHANGE_RUNTIMES[exchange];
}

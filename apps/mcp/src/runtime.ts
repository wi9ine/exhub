import { createBithumbClient } from "@exhub/bithumb";
import { createCoinoneClient } from "@exhub/coinone";
import { createGopaxClient } from "@exhub/gopax";
import { createKorbitClient } from "@exhub/korbit";
import { createUpbitClient } from "@exhub/upbit";
import type { ZodTypeAny } from "zod";

import { buildToolInputZodSchema } from "./schema";
import type {
  ExchangeKey,
  ExchangeRuntimeDefinition,
  ResolvedToolDefinition,
  ToolArgumentDefinition,
  ToolMetadata,
} from "./types";

type RuntimeOptions = {
  baseURL?: string;
  timeout?: number;
};

type ValidatorNamespace = Record<string, unknown>;

let upbitQuotationZod: ValidatorNamespace | undefined;
let upbitExchangeZod: ValidatorNamespace | undefined;
let bithumbPublicZod: ValidatorNamespace | undefined;
let bithumbPrivateZod: ValidatorNamespace | undefined;
let coinonePublicZod: ValidatorNamespace | undefined;
let coinonePrivateZod: ValidatorNamespace | undefined;
let gopaxPublicZod: ValidatorNamespace | undefined;
let gopaxPrivateZod: ValidatorNamespace | undefined;
let korbitPublicZod: ValidatorNamespace | undefined;
let korbitPrivateZod: ValidatorNamespace | undefined;

let upbitToolsCache: readonly ResolvedToolDefinition[] | undefined;
let bithumbToolsCache: readonly ResolvedToolDefinition[] | undefined;
let coinoneToolsCache: readonly ResolvedToolDefinition[] | undefined;
let gopaxToolsCache: readonly ResolvedToolDefinition[] | undefined;
let korbitToolsCache: readonly ResolvedToolDefinition[] | undefined;

const runtimeCache = new Map<ExchangeKey, ExchangeRuntimeDefinition>();

const objectSchema = (description: string): ToolArgumentDefinition["schema"] => ({
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
  arg(name, numberSchema(description), required);

export function requireNamedValidator(namespace: ValidatorNamespace, name: string): ZodTypeAny {
  const validator = namespace[name];
  if (!validator) {
    throw new Error(`generated-zod validator를 찾지 못했습니다: ${name}`);
  }

  return validator as ZodTypeAny;
}

function requireLoadedNamespace(
  namespace: ValidatorNamespace | undefined,
  label: string,
): ValidatorNamespace {
  if (!namespace) {
    throw new Error(`${label} zod namespace가 아직 로드되지 않았습니다.`);
  }

  return namespace;
}

async function ensureUpbitZodLoaded() {
  if (!upbitQuotationZod) {
    upbitQuotationZod = await import("@exhub/upbit/zod/quotation");
  }
  if (!upbitExchangeZod) {
    upbitExchangeZod = await import("@exhub/upbit/zod/exchange");
  }
}

async function ensureBithumbZodLoaded() {
  if (!bithumbPublicZod) {
    bithumbPublicZod = await import("@exhub/bithumb/zod/public");
  }
  if (!bithumbPrivateZod) {
    bithumbPrivateZod = await import("@exhub/bithumb/zod/private");
  }
}

async function ensureCoinoneZodLoaded() {
  if (!coinonePublicZod) {
    coinonePublicZod = await import("@exhub/coinone/zod/public");
  }
  if (!coinonePrivateZod) {
    coinonePrivateZod = await import("@exhub/coinone/zod/private");
  }
}

async function ensureGopaxZodLoaded() {
  if (!gopaxPublicZod) {
    gopaxPublicZod = await import("@exhub/gopax/zod/public");
  }
  if (!gopaxPrivateZod) {
    gopaxPrivateZod = await import("@exhub/gopax/zod/private");
  }
}

async function ensureKorbitZodLoaded() {
  if (!korbitPublicZod) {
    korbitPublicZod = await import("@exhub/korbit/zod/public");
  }
  if (!korbitPrivateZod) {
    korbitPrivateZod = await import("@exhub/korbit/zod/private");
  }
}

const upbitQuotationQuery = (prefix: string, required = false) =>
  paramsArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(upbitQuotationZod, "upbit quotation"),
      `${prefix}QueryParams`,
    ),
  );
const upbitExchangeQuery = (prefix: string, required = false) =>
  paramsArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(upbitExchangeZod, "upbit exchange"),
      `${prefix}QueryParams`,
    ),
  );
const upbitExchangeBody = (prefix: string, required = true) =>
  bodyArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(upbitExchangeZod, "upbit exchange"),
      `${prefix}Body`,
    ),
  );

const bithumbPublicQuery = (prefix: string, required = false) =>
  paramsArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(bithumbPublicZod, "bithumb public"),
      `${prefix}QueryParams`,
    ),
  );
const bithumbPrivateQuery = (prefix: string, required = false) =>
  paramsArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(bithumbPrivateZod, "bithumb private"),
      `${prefix}QueryParams`,
    ),
  );
const bithumbPrivateBody = (prefix: string, required = true) =>
  bodyArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(bithumbPrivateZod, "bithumb private"),
      `${prefix}Body`,
    ),
  );

const coinonePublicQuery = (prefix: string, required = false) =>
  paramsArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(coinonePublicZod, "coinone public"),
      `${prefix}QueryParams`,
    ),
  );
const coinonePrivateBody = (prefix: string, required = true) =>
  bodyArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(coinonePrivateZod, "coinone private"),
      `${prefix}Body`,
    ),
  );

const gopaxPublicQuery = (prefix: string, required = false) =>
  paramsArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(gopaxPublicZod, "gopax public"),
      `${prefix}QueryParams`,
    ),
  );
const gopaxPrivateQuery = (prefix: string, required = false) =>
  paramsArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(gopaxPrivateZod, "gopax private"),
      `${prefix}QueryParams`,
    ),
  );
const gopaxPrivateBody = (prefix: string, required = true) =>
  bodyArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(gopaxPrivateZod, "gopax private"),
      `${prefix}Body`,
    ),
  );

const korbitPublicQuery = (prefix: string, required = false) =>
  paramsArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(korbitPublicZod, "korbit public"),
      `${prefix}QueryParams`,
    ),
  );
const korbitPrivateQuery = (prefix: string, required = false) =>
  paramsArg(
    required,
    requireNamedValidator(
      requireLoadedNamespace(korbitPrivateZod, "korbit private"),
      `${prefix}QueryParams`,
    ),
  );

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
    const inputZodSchema = buildToolInputZodSchema(candidate.args);
    const resolvedTool = {
      ...candidate,
      name,
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

function getUpbitTools() {
  if (upbitToolsCache) return upbitToolsCache;

  upbitToolsCache = resolveTools([
    tool("tradingPairs", "listTradingPairs", "public", [upbitQuotationQuery("ListTradingPairs")]),
    tool("candles", "listCandlesSeconds", "public", [
      upbitQuotationQuery("ListCandlesSeconds", true),
    ]),
    tool("candles", "listCandlesMinutes", "public", [
      numberArg("unit", "분 캔들 단위", true),
      upbitQuotationQuery("ListCandlesMinutes", true),
    ]),
    tool("candles", "listCandlesDays", "public", [upbitQuotationQuery("ListCandlesDays", true)]),
    tool("candles", "listCandlesWeeks", "public", [upbitQuotationQuery("ListCandlesWeeks", true)]),
    tool("candles", "listCandlesMonths", "public", [
      upbitQuotationQuery("ListCandlesMonths", true),
    ]),
    tool("candles", "listCandlesYears", "public", [upbitQuotationQuery("ListCandlesYears", true)]),
    tool("trades", "recentTradesHistory", "public", [
      upbitQuotationQuery("RecentTradesHistory", true),
    ]),
    tool("tickers", "listTickers", "public", [upbitQuotationQuery("ListTickers", true)]),
    tool("tickers", "listQuoteTickers", "public", [upbitQuotationQuery("ListQuoteTickers", true)]),
    tool("orderbook", "listOrderbooks", "public", [upbitQuotationQuery("ListOrderbooks", true)]),
    tool("orderbook", "listOrderbookInstruments", "public", [
      upbitQuotationQuery("ListOrderbookInstruments", true),
    ]),
    tool("orderbook", "listOrderbookLevels", "public", [
      upbitQuotationQuery("ListOrderbookLevels", true),
    ]),
    tool("assets", "getBalance", "private"),
    tool("orders", "availableOrderInformation", "private", [
      upbitExchangeQuery("AvailableOrderInformation", true),
    ]),
    tool("orders", "newOrder", "private", [upbitExchangeBody("NewOrder")]),
    tool("orders", "testOrder", "private", [upbitExchangeBody("TestOrder")]),
    tool("orders", "getOrder", "private", [upbitExchangeQuery("GetOrder")]),
    tool("orders", "cancelOrder", "private", [upbitExchangeQuery("CancelOrder")]),
    tool("orders", "listOrdersByIds", "private", [upbitExchangeQuery("ListOrdersByIds")]),
    tool("orders", "cancelOrdersByIds", "private", [upbitExchangeQuery("CancelOrdersByIds")]),
    tool("orders", "listOpenOrders", "private", [upbitExchangeQuery("ListOpenOrders")]),
    tool("orders", "batchCancelOrders", "private", [upbitExchangeQuery("BatchCancelOrders")]),
    tool("orders", "listClosedOrders", "private", [upbitExchangeQuery("ListClosedOrders")]),
    tool("orders", "cancelAndNewOrder", "private", [upbitExchangeBody("CancelAndNewOrder")]),
    tool("withdrawals", "availableWithdrawalInformation", "private", [
      upbitExchangeQuery("AvailableWithdrawalInformation", true),
    ]),
    tool("withdrawals", "listWithdrawalAddresses", "private"),
    tool("withdrawals", "withdraw", "private", [upbitExchangeBody("Withdraw")]),
    tool("withdrawals", "cancelWithdrawal", "private", [
      upbitExchangeQuery("CancelWithdrawal", true),
    ]),
    tool("withdrawals", "withdrawKrw", "private", [upbitExchangeBody("WithdrawKrw")]),
    tool("withdrawals", "getWithdrawal", "private", [upbitExchangeQuery("GetWithdrawal")]),
    tool("withdrawals", "listWithdrawals", "private", [upbitExchangeQuery("ListWithdrawals")]),
    tool("deposits", "availableDepositInformation", "private", [
      upbitExchangeQuery("AvailableDepositInformation", true),
    ]),
    tool("deposits", "createDepositAddress", "private", [
      upbitExchangeBody("CreateDepositAddress"),
    ]),
    tool("deposits", "getDepositAddress", "private", [
      upbitExchangeQuery("GetDepositAddress", true),
    ]),
    tool("deposits", "listDepositAddresses", "private"),
    tool("deposits", "depositKrw", "private", [upbitExchangeBody("DepositKrw")]),
    tool("deposits", "getDeposit", "private", [upbitExchangeQuery("GetDeposit")]),
    tool("deposits", "listDeposits", "private", [upbitExchangeQuery("ListDeposits")]),
    tool("travelRule", "listTravelruleVasps", "private"),
    tool("travelRule", "verifyTravelruleByUuid", "private", [
      upbitExchangeBody("VerifyTravelruleByUuid"),
    ]),
    tool("travelRule", "verifyTravelruleByTxid", "private", [
      upbitExchangeBody("VerifyTravelruleByTxid"),
    ]),
    tool("service", "getServiceStatus", "private"),
    tool("service", "listApiKeys", "private"),
  ]);

  return upbitToolsCache;
}

function getBithumbTools() {
  if (bithumbToolsCache) return bithumbToolsCache;

  bithumbToolsCache = resolveTools([
    tool("markets", "getMarketAll", "public", [bithumbPublicQuery("GetMarketAll")]),
    tool("markets", "getMarketVirtualAssetWarning", "public"),
    tool("candles", "minute1", "public", [
      bithumbPublicQuery("Minute1", true),
      numberArg("unit", "분 캔들 단위", false),
    ]),
    tool("candles", "day", "public", [bithumbPublicQuery("Day", true)]),
    tool("candles", "week", "public", [bithumbPublicQuery("Week", true)]),
    tool("candles", "month", "public", [bithumbPublicQuery("Month", true)]),
    tool("trades", "getTradesTicks", "public", [bithumbPublicQuery("GetTradesTicks", true)]),
    tool("tickers", "getTicker", "public", [bithumbPublicQuery("GetTicker", true)]),
    tool("orderbook", "getOrderbook", "public", [bithumbPublicQuery("GetOrderbook", true)]),
    tool("service", "getNotices", "public"),
    tool("service", "getFeeInfo", "public", [stringArg("currency", "조회할 통화 코드", true)]),
    tool("service", "getStatusWallet", "private"),
    tool("service", "api", "private"),
    tool("accounts", "getAccounts", "private"),
    tool("orders", "getOrdersChance", "private", [bithumbPrivateQuery("GetOrdersChance", true)]),
    tool("orders", "placeOrder", "private", [bithumbPrivateBody("PostOrders")]),
    tool("orders", "placeBatchOrders", "private", [bithumbPrivateBody("PostOrdersBatch")]),
    tool("orders", "getOrder", "private", [bithumbPrivateQuery("GetOrder")]),
    tool("orders", "cancelOrder", "private", [bithumbPrivateQuery("DeleteOrder")]),
    tool("orders", "cancelOrders", "private", [bithumbPrivateBody("PostOrdersCancel")]),
    tool("orders", "getOrders", "private", [bithumbPrivateQuery("GetOrders")]),
    tool("orders", "getTwapOrders", "private", [bithumbPrivateQuery("Gettwaporders")]),
    tool("orders", "cancelTwapOrder", "private", [bithumbPrivateQuery("Canceltwaporder", true)]),
    tool("orders", "createTwapOrder", "private", [bithumbPrivateQuery("Createtwaporder", true)]),
    tool("withdrawals", "getWithdraws", "private", [bithumbPrivateQuery("GetWithdraws")]),
    tool("withdrawals", "getWithdrawsKrw", "private", [bithumbPrivateQuery("GetWithdrawsKrw")]),
    tool("withdrawals", "getWithdraw", "private", [bithumbPrivateQuery("GetWithdraw", true)]),
    tool("withdrawals", "getWithdrawsChance", "private", [
      bithumbPrivateQuery("GetWithdrawsChance", true),
    ]),
    tool("withdrawals", "getWithdrawsCoinAddresses", "private"),
    tool("withdrawals", "withdrawCoin", "private", [bithumbPrivateBody("PostWithdrawsCoin")]),
    tool("withdrawals", "withdrawKrw", "private", [bithumbPrivateBody("PostWithdrawsKrw")]),
    tool("deposits", "getDeposits", "private", [bithumbPrivateQuery("GetDeposits")]),
    tool("deposits", "getDepositsKrw", "private", [bithumbPrivateQuery("GetDepositsKrw")]),
    tool("deposits", "getDeposit", "private", [bithumbPrivateQuery("GetDeposit", true)]),
    tool("deposits", "getDepositsCoinAddresses", "private"),
    tool("deposits", "getDepositsCoinAddress", "private", [
      bithumbPrivateQuery("GetDepositsCoinAddress", true),
    ]),
    tool("deposits", "depositKrw", "private", [bithumbPrivateBody("PostDepositsKrw")]),
    tool("deposits", "generateCoinAddress", "private", [
      bithumbPrivateBody("PostDepositsGenerateCoinAddress"),
    ]),
  ]);

  return bithumbToolsCache;
}

function getCoinoneTools() {
  if (coinoneToolsCache) return coinoneToolsCache;

  coinoneToolsCache = resolveTools([
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
      coinonePublicQuery("Orderbook"),
    ]),
    tool("market", "recentCompletedOrders", "public", [
      stringArg("quoteCurrency", "quote currency", false),
      stringArg("targetCurrency", "target currency", false),
      coinonePublicQuery("RecentCompletedOrders"),
    ]),
    tool("market", "tickers", "public", [
      stringArg("quoteCurrency", "quote currency", false),
      coinonePublicQuery("Tickers"),
    ]),
    tool("market", "ticker", "public", [
      stringArg("quoteCurrency", "quote currency", false),
      stringArg("targetCurrency", "target currency", false),
      coinonePublicQuery("Ticker"),
    ]),
    tool("market", "utcTickers", "public", [
      stringArg("quoteCurrency", "quote currency", false),
      coinonePublicQuery("UtcTickers"),
    ]),
    tool("market", "utcTicker", "public", [
      stringArg("quoteCurrency", "quote currency", false),
      stringArg("targetCurrency", "target currency", false),
      coinonePublicQuery("UtcTicker"),
    ]),
    tool("market", "currencies", "public"),
    tool("market", "currency", "public", [stringArg("currency", "통화 코드", false)]),
    tool("market", "chart", "public", [
      stringArg("quoteCurrency", "quote currency", true),
      stringArg("targetCurrency", "target currency", true),
      coinonePublicQuery("Chart", true),
    ]),
    tool("market", "orderbookDeprecated", "public", [coinonePublicQuery("OrderbookDeprecated")]),
    tool("market", "tickerDeprecated", "public", [coinonePublicQuery("Ticker1")]),
    tool("market", "tickerUtcDeprecated", "public", [coinonePublicQuery("TickerUtcDeprecated")]),
    tool("market", "recentCompletedOrdersDeprecated", "public", [
      coinonePublicQuery("RecentCompleteOrdersDeprecated"),
    ]),
    tool("account", "findBalance", "private"),
    tool("account", "findBalanceByCurrencies", "private", [
      coinonePrivateBody("FindBalanceByCurrencies"),
    ]),
    tool("account", "findAllTradeFees", "private"),
    tool("account", "findTradeFeeByPair", "private", [
      stringArg("quoteCurrency", "quote currency", false),
      stringArg("targetCurrency", "target currency", false),
      coinonePrivateBody("FindTradeFeeByPair", false),
    ]),
    tool("orders", "findActiveOrders", "private", [coinonePrivateBody("FindActiveOrders", false)]),
    tool("orders", "placeOrder", "private", [coinonePrivateBody("PlaceOrder")]),
    tool("orders", "placeLimitOrder", "private", [coinonePrivateBody("OrderPlaceLimitOrder")]),
    tool("orders", "cancelOrders", "private", [coinonePrivateBody("CancelOrders")]),
    tool("orders", "cancelOrder", "private", [coinonePrivateBody("CancelOrder")]),
    tool("orders", "orderDetail", "private", [coinonePrivateBody("OrderDetail")]),
    tool("orders", "findAllCompletedOrders", "private", [
      coinonePrivateBody("FindAllCompletedOrders"),
    ]),
    tool("orders", "findCompletedOrders", "private", [coinonePrivateBody("FindCompletedOrders")]),
    tool("orders", "findAllOpenOrders", "private", [
      coinonePrivateBody("FindAllOpenOrders", false),
    ]),
    tool("orders", "findOpenOrders", "private", [coinonePrivateBody("FindOpenOrders")]),
    tool("orders", "findOrderInfo", "private", [coinonePrivateBody("FindOrderInfo")]),
    tool("transactions", "krwTransactionHistory", "private", [
      coinonePrivateBody("KrwTransactionHistory", false),
    ]),
    tool("transactions", "coinTransactionHistory", "private", [
      coinonePrivateBody("CoinTransactionHistory", false),
    ]),
    tool("transactions", "singleCoinTransactionHistory", "private", [
      coinonePrivateBody("SingleCoinTransactionHistory"),
    ]),
    tool("transactions", "coinWithdrawalLimit", "private", [
      coinonePrivateBody("CoinWithdrawalLimit"),
    ]),
    tool("transactions", "coinWithdrawalAddressBook", "private", [
      coinonePrivateBody("CoinWithdrawalAddressBook", false),
    ]),
    tool("transactions", "coinWithdrawal", "private", [coinonePrivateBody("CoinWithdrawal")]),
    tool("rewards", "orderRewardPrograms", "private", [
      coinonePrivateBody("OrderRewardPrograms", false),
    ]),
    tool("rewards", "orderRewardHistory", "private", [
      coinonePrivateBody("OrderRewardHistory", false),
    ]),
  ]);

  return coinoneToolsCache;
}

function getGopaxTools() {
  if (gopaxToolsCache) return gopaxToolsCache;

  gopaxToolsCache = resolveTools([
    tool("market", "assets", "public"),
    tool("market", "tradingPairs", "public"),
    tool("market", "priceTickSize", "public", [stringArg("tradingPair", "거래 페어", true)]),
    tool("market", "ticker", "public", [stringArg("tradingPair", "거래 페어", true)]),
    tool("market", "orderbook", "public", [
      stringArg("tradingPair", "거래 페어", true),
      gopaxPublicQuery("Gettradingpairstradingpairbook"),
    ]),
    tool("market", "trades", "public", [
      stringArg("tradingPair", "거래 페어", true),
      gopaxPublicQuery("Gettradingpairstradingpairtrades"),
    ]),
    tool("market", "stats", "public", [stringArg("tradingPair", "거래 페어", true)]),
    tool("market", "allStats", "public"),
    tool("market", "candles", "public", [
      stringArg("tradingPair", "거래 페어", true),
      gopaxPublicQuery("Gettradingpairstradingpaircandles", true),
    ]),
    tool("market", "cautions", "public", [gopaxPublicQuery("Gettradingpairscautions")]),
    tool("market", "tickers", "public"),
    tool("market", "time", "public"),
    tool("market", "notices", "public", [gopaxPublicQuery("Getnotices")]),
    tool("account", "getBalances", "private"),
    tool("account", "getBalance", "private", [stringArg("assetName", "자산 코드", true)]),
    tool("orders", "getOrders", "private", [gopaxPrivateQuery("Getorders")]),
    tool("orders", "placeOrder", "private", [gopaxPrivateBody("Postorders")]),
    tool("orders", "getOrder", "private", [stringArg("orderId", "주문 ID", true)]),
    tool("orders", "cancelOrder", "private", [stringArg("orderId", "주문 ID", true)]),
    tool("orders", "getOrderByClientOrderId", "private", [
      stringArg("clientOrderId", "클라이언트 주문 ID", true),
    ]),
    tool("orders", "cancelOrderByClientOrderId", "private", [
      stringArg("clientOrderId", "클라이언트 주문 ID", true),
    ]),
    tool("trades", "getTrades", "private", [gopaxPrivateQuery("Gettrades")]),
    tool("wallet", "getDepositWithdrawalStatus", "private", [
      gopaxPrivateQuery("Getdepositwithdrawalstatus"),
    ]),
    tool("wallet", "getCryptoDepositAddresses", "private"),
    tool("wallet", "getCryptoWithdrawalAddresses", "private"),
    tool("wallet", "withdraw", "private", [gopaxPrivateBody("Postwithdrawals")]),
  ]);

  return gopaxToolsCache;
}

function getKorbitTools() {
  if (korbitToolsCache) return korbitToolsCache;

  korbitToolsCache = resolveTools([
    tool("market", "tickers", "public", [korbitPublicQuery("Getv2tickers")]),
    tool("market", "orderbook", "public", [korbitPublicQuery("Getv2orderbook", true)]),
    tool("market", "trades", "public", [korbitPublicQuery("Getv2trades", true)]),
    tool("market", "candles", "public", [korbitPublicQuery("Getv2candles", true)]),
    tool("market", "currencyPairs", "public"),
    tool("market", "tickSizePolicy", "public", [korbitPublicQuery("Getv2ticksizepolicy", true)]),
    tool("market", "currencies", "public"),
    tool("market", "time", "public"),
    tool("orders", "placeOrder", "private", [bodyArg()]),
    tool("orders", "cancelOrder", "private", [korbitPrivateQuery("Deletev2orders", true)]),
    tool("orders", "getOrder", "private", [korbitPrivateQuery("Getv2orders", true)]),
    tool("orders", "getOpenOrders", "private", [korbitPrivateQuery("Getv2openorders", true)]),
    tool("orders", "getAllOrders", "private", [korbitPrivateQuery("Getv2allorders", true)]),
    tool("orders", "getMyTrades", "private", [korbitPrivateQuery("Getv2mytrades", true)]),
    tool("assets", "getBalance", "private", [korbitPrivateQuery("Getv2balance")]),
    tool("cryptoDeposits", "getDepositAddresses", "private"),
    tool("cryptoDeposits", "createDepositAddress", "private", [bodyArg()]),
    tool("cryptoDeposits", "getDepositAddress", "private", [
      korbitPrivateQuery("Getv2coindepositaddress", true),
    ]),
    tool("cryptoDeposits", "getRecentDeposits", "private", [
      korbitPrivateQuery("Getv2coinrecentdeposits", true),
    ]),
    tool("cryptoDeposits", "getDeposit", "private", [korbitPrivateQuery("Getv2coindeposit", true)]),
    tool("cryptoWithdrawals", "getWithdrawableAddresses", "private"),
    tool("cryptoWithdrawals", "getWithdrawableAmount", "private", [
      korbitPrivateQuery("Getv2coinwithdrawableamount"),
    ]),
    tool("cryptoWithdrawals", "withdraw", "private", [bodyArg()]),
    tool("cryptoWithdrawals", "cancelWithdrawal", "private", [
      korbitPrivateQuery("Deletev2coinwithdrawal", true),
    ]),
    tool("cryptoWithdrawals", "getRecentWithdrawals", "private", [
      korbitPrivateQuery("Getv2coinrecentwithdrawals", true),
    ]),
    tool("cryptoWithdrawals", "getWithdrawal", "private", [
      korbitPrivateQuery("Getv2coinwithdrawal", true),
    ]),
    tool("krw", "sendDepositPush", "private", [bodyArg()]),
    tool("krw", "sendWithdrawalPush", "private", [bodyArg()]),
    tool("krw", "getRecentDeposits", "private", [
      korbitPrivateQuery("Getv2krwrecentdeposits", true),
    ]),
    tool("krw", "getRecentWithdrawals", "private", [
      korbitPrivateQuery("Getv2krwrecentwithdrawals", true),
    ]),
    tool("service", "getTradingFeePolicy", "private", [
      korbitPrivateQuery("Getv2tradingfeepolicy"),
    ]),
    tool("service", "getCurrentKeyInfo", "private"),
  ]);

  return korbitToolsCache;
}

const EXCHANGE_RUNTIME_BASE: Record<ExchangeKey, Omit<ExchangeRuntimeDefinition, "tools">> = {
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
  },
};

export function listSupportedExchanges(): readonly ExchangeKey[] {
  return Object.keys(EXCHANGE_RUNTIME_BASE) as ExchangeKey[];
}

export async function getExchangeRuntime(
  exchange: ExchangeKey,
): Promise<ExchangeRuntimeDefinition> {
  const cached = runtimeCache.get(exchange);
  if (cached) return cached;

  let tools: readonly ResolvedToolDefinition[];
  switch (exchange) {
    case "upbit":
      await ensureUpbitZodLoaded();
      tools = getUpbitTools();
      break;
    case "bithumb":
      await ensureBithumbZodLoaded();
      tools = getBithumbTools();
      break;
    case "coinone":
      await ensureCoinoneZodLoaded();
      tools = getCoinoneTools();
      break;
    case "gopax":
      await ensureGopaxZodLoaded();
      tools = getGopaxTools();
      break;
    case "korbit":
      await ensureKorbitZodLoaded();
      tools = getKorbitTools();
      break;
  }

  const runtime: ExchangeRuntimeDefinition = {
    ...EXCHANGE_RUNTIME_BASE[exchange],
    tools,
  };
  runtimeCache.set(exchange, runtime);
  return runtime;
}

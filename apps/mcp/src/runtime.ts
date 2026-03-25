import { createBithumbClient } from "@exhub/bithumb";
import { createCoinoneClient } from "@exhub/coinone";
import { createGopaxClient } from "@exhub/gopax";
import { createKorbitClient } from "@exhub/korbit";
import { createUpbitClient } from "@exhub/upbit";
import type { ZodTypeAny } from "zod";

import { TOOL_SUMMARIES } from "./generated/tool-summaries";
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

function createValidatorArgFactory(
  getNamespace: () => ValidatorNamespace | undefined,
  label: string,
) {
  return {
    query(prefix: string, required = false) {
      return paramsArg(
        required,
        requireNamedValidator(
          requireLoadedNamespace(getNamespace(), label),
          `${prefix}QueryParams`,
        ),
      );
    },
    body(prefix: string, required = true) {
      return bodyArg(
        required,
        requireNamedValidator(requireLoadedNamespace(getNamespace(), label), `${prefix}Body`),
      );
    },
  };
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
  if (!upbitQuotationZod || !upbitExchangeZod) {
    [upbitQuotationZod, upbitExchangeZod] = await Promise.all([
      upbitQuotationZod ?? import("@exhub/upbit/zod/quotation"),
      upbitExchangeZod ?? import("@exhub/upbit/zod/exchange"),
    ]);
  }
}

async function ensureBithumbZodLoaded() {
  if (!bithumbPublicZod || !bithumbPrivateZod) {
    [bithumbPublicZod, bithumbPrivateZod] = await Promise.all([
      bithumbPublicZod ?? import("@exhub/bithumb/zod/public"),
      bithumbPrivateZod ?? import("@exhub/bithumb/zod/private"),
    ]);
  }
}

async function ensureCoinoneZodLoaded() {
  if (!coinonePublicZod || !coinonePrivateZod) {
    [coinonePublicZod, coinonePrivateZod] = await Promise.all([
      coinonePublicZod ?? import("@exhub/coinone/zod/public"),
      coinonePrivateZod ?? import("@exhub/coinone/zod/private"),
    ]);
  }
}

async function ensureGopaxZodLoaded() {
  if (!gopaxPublicZod || !gopaxPrivateZod) {
    [gopaxPublicZod, gopaxPrivateZod] = await Promise.all([
      gopaxPublicZod ?? import("@exhub/gopax/zod/public"),
      gopaxPrivateZod ?? import("@exhub/gopax/zod/private"),
    ]);
  }
}

async function ensureKorbitZodLoaded() {
  if (!korbitPublicZod || !korbitPrivateZod) {
    [korbitPublicZod, korbitPrivateZod] = await Promise.all([
      korbitPublicZod ?? import("@exhub/korbit/zod/public"),
      korbitPrivateZod ?? import("@exhub/korbit/zod/private"),
    ]);
  }
}

const upbitQuotationArgs = createValidatorArgFactory(() => upbitQuotationZod, "upbit quotation");
const upbitExchangeArgs = createValidatorArgFactory(() => upbitExchangeZod, "upbit exchange");
const bithumbPublicArgs = createValidatorArgFactory(() => bithumbPublicZod, "bithumb public");
const bithumbPrivateArgs = createValidatorArgFactory(() => bithumbPrivateZod, "bithumb private");
const coinonePublicArgs = createValidatorArgFactory(() => coinonePublicZod, "coinone public");
const coinonePrivateArgs = createValidatorArgFactory(() => coinonePrivateZod, "coinone private");
const gopaxPublicArgs = createValidatorArgFactory(() => gopaxPublicZod, "gopax public");
const gopaxPrivateArgs = createValidatorArgFactory(() => gopaxPrivateZod, "gopax private");
const korbitPublicArgs = createValidatorArgFactory(() => korbitPublicZod, "korbit public");
const korbitPrivateArgs = createValidatorArgFactory(() => korbitPrivateZod, "korbit private");

const upbitQuotationQuery = upbitQuotationArgs.query.bind(upbitQuotationArgs);
const upbitExchangeQuery = upbitExchangeArgs.query.bind(upbitExchangeArgs);
const upbitExchangeBody = upbitExchangeArgs.body.bind(upbitExchangeArgs);
const bithumbPublicQuery = bithumbPublicArgs.query.bind(bithumbPublicArgs);
const bithumbPrivateQuery = bithumbPrivateArgs.query.bind(bithumbPrivateArgs);
const bithumbPrivateBody = bithumbPrivateArgs.body.bind(bithumbPrivateArgs);
const coinonePublicQuery = coinonePublicArgs.query.bind(coinonePublicArgs);
const coinonePrivateBody = coinonePrivateArgs.body.bind(coinonePrivateArgs);
const gopaxPublicQuery = gopaxPublicArgs.query.bind(gopaxPublicArgs);
const gopaxPrivateQuery = gopaxPrivateArgs.query.bind(gopaxPrivateArgs);
const gopaxPrivateBody = gopaxPrivateArgs.body.bind(gopaxPrivateArgs);
const korbitPublicQuery = korbitPublicArgs.query.bind(korbitPublicArgs);
const korbitPrivateQuery = korbitPrivateArgs.query.bind(korbitPrivateArgs);

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

type SpecOperationIdMap = Record<string, string>;

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

const UPBIT_SPEC_OPERATION_IDS = {
  "tradingPairs.listTradingPairs": "list_trading_pairs",
  "candles.getSecondCandles": "get_second_candles",
  "candles.getMinuteCandles": "get_minute_candles",
  "candles.getDayCandles": "get_day_candles",
  "candles.getWeekCandles": "get_week_candles",
  "candles.getMonthCandles": "get_month_candles",
  "candles.getYearCandles": "get_year_candles",
  "trades.listTradesTicks": "list_trades_ticks",
  "tickers.listTickers": "list_tickers",
  "tickers.listQuoteTickers": "list_quote_tickers",
  "orderbook.listOrderbooks": "list_orderbooks",
  "orderbook.listOrderbookInstruments": "list_orderbook_instruments",
  "orderbook.listOrderbookSupportedLevels": "list_orderbook_supported_levels",
  "assets.listBalance": "list_balance",
  "orders.getOrderChance": "get_order_chance",
  "orders.createOrder": "create_order",
  "orders.createTestOrder": "create_test_order",
  "orders.getOrder": "get_order",
  "orders.cancelOrder": "cancel_order",
  "orders.listOrdersByIds": "list_orders_by_ids",
  "orders.cancelOrdersByIds": "cancel_orders_by_ids",
  "orders.listOpenOrders": "list_open_orders",
  "orders.cancelOpenOrders": "cancel_open_orders",
  "orders.listClosedOrders": "list_closed_orders",
  "orders.cancelAndCreateOrder": "cancel_and_create_order",
  "withdrawals.getWithdrawChance": "get_withdraw_chance",
  "withdrawals.listWithdrawalAddresses": "list_withdrawal_addresses",
  "withdrawals.withdraw": "create_withdrawal",
  "withdrawals.cancelWithdrawal": "cancel_withdrawal",
  "withdrawals.createWithdrawKrw": "create_withdraw_krw",
  "withdrawals.getWithdrawal": "get_withdrawal",
  "withdrawals.listWithdrawals": "list_withdrawals",
  "deposits.getDepositChance": "get_deposit_chance",
  "deposits.createDepositAddress": "create_deposit_address",
  "deposits.getDepositAddress": "get_deposit_address",
  "deposits.listDepositAddresses": "list_deposit_addresses",
  "deposits.createDepositKrw": "create_deposit_krw",
  "deposits.getDeposit": "get_deposit",
  "deposits.listDeposits": "list_deposits",
  "travelRule.listTravelRuleVasps": "list_travel_rule_vasps",
  "travelRule.verifyTravelRuleByUuid": "verify_travel_rule_by_uuid",
  "travelRule.verifyTravelRuleByTxid": "verify_travel_rule_by_txid",
  "service.getServiceStatus": "get_service_status",
  "service.listApiKeys": "list_api_keys",
} as const satisfies SpecOperationIdMap;

const BITHUMB_SPEC_OPERATION_IDS = {
  "markets.getMarkets": "get_markets",
  "markets.getMarketVirtualAssetWarning": "get_market_virtual_asset_warning",
  "candles.getMinuteCandles": "get_minute_candles",
  "candles.getDayCandles": "get_day_candles",
  "candles.getWeekCandles": "get_week_candles",
  "candles.getMonthCandles": "get_month_candles",
  "trades.listTradesTicks": "list_trades_ticks",
  "tickers.getTicker": "get_ticker",
  "orderbook.getOrderbook": "get_orderbook",
  "service.listNotices": "list_notices",
  "service.getFeeInfo": "get_fee_info",
  "service.getWalletStatus": "get_wallet_status",
  "service.listApiKeys": "list_api_keys",
  "accounts.listAccounts": "list_accounts",
  "orders.getOrderChance": "get_order_chance",
  "orders.createOrder": "create_order",
  "orders.createOrdersBatch": "create_orders_batch",
  "orders.getOrder": "get_order",
  "orders.cancelOrder": "cancel_order",
  "orders.cancelOrders": "cancel_orders",
  "orders.listOrders": "list_orders",
  "orders.listTwapOrders": "list_twap_orders",
  "orders.cancelTwapOrder": "cancel_twap_order",
  "orders.createTwapOrder": "create_twap_order",
  "withdrawals.listWithdraws": "list_withdraws",
  "withdrawals.listWithdrawsKrw": "list_withdraws_krw",
  "withdrawals.getWithdraw": "get_withdraw",
  "withdrawals.getWithdrawChance": "get_withdraw_chance",
  "withdrawals.listWithdrawsCoinAddresses": "list_withdraws_coin_addresses",
  "withdrawals.createWithdrawsCoin": "create_withdraws_coin",
  "withdrawals.createWithdrawsKrw": "create_withdraws_krw",
  "deposits.listDeposits": "list_deposits",
  "deposits.listDepositsKrw": "list_deposits_krw",
  "deposits.getDeposit": "get_deposit",
  "deposits.listDepositsCoinAddresses": "list_deposits_coin_addresses",
  "deposits.getDepositsCoinAddress": "get_deposits_coin_address",
  "deposits.createDepositsKrw": "create_deposits_krw",
  "deposits.createDepositAddress": "create_deposit_address",
} as const satisfies SpecOperationIdMap;

const COINONE_SPEC_OPERATION_IDS = {
  "market.getRangeUnit": "get_range_unit",
  "market.listMarkets": "list_markets",
  "market.getMarket": "get_market",
  "market.getOrderbook": "get_orderbook",
  "market.listTrades": "list_trades",
  "market.listTickers": "list_tickers",
  "market.getTicker": "get_ticker",
  "market.listTickerUtc": "list_ticker_utc",
  "market.getTickerUtc": "get_ticker_utc",
  "market.listCurrencies": "list_currencies",
  "market.getCurrency": "get_currency",
  "market.getChart": "get_chart",
  "account.listBalance": "list_balance",
  "account.listBalanceByCurrencies": "list_balance_by_currencies",
  "account.listTradeFees": "list_trade_fees",
  "account.getTradeFeeByPair": "get_trade_fee_by_pair",
  "orders.listActiveOrders": "list_active_orders",
  "orders.createOrder": "create_order",
  "orders.createLimitOrder": "create_limit_order",
  "orders.cancelOrders": "cancel_orders",
  "orders.cancelOrder": "cancel_order",
  "orders.getOrderDetail": "get_order_detail",
  "orders.listCompletedOrdersAll": "list_completed_orders_all",
  "orders.listCompletedOrders": "list_completed_orders",
  "orders.listOpenOrdersAll": "list_open_orders_all",
  "orders.listOpenOrders": "list_open_orders",
  "orders.getOrderInfo": "get_order_info",
  "transactions.listKrwTransactionHistory": "list_krw_transaction_history",
  "transactions.listCoinTransactionHistory": "list_coin_transaction_history",
  "transactions.getCoinTransactionHistoryDetail": "get_coin_transaction_history_detail",
  "transactions.getCoinWithdrawalLimit": "get_coin_withdrawal_limit",
  "transactions.listCoinWithdrawalAddressBook": "list_coin_withdrawal_address_book",
  "transactions.createCoinWithdrawal": "create_coin_withdrawal",
  "rewards.listOrderRewardPrograms": "list_order_reward_programs",
  "rewards.listOrderRewardHistory": "list_order_reward_history",
} as const satisfies SpecOperationIdMap;

const GOPAX_SPEC_OPERATION_IDS = {
  "market.assets": "list_assets",
  "market.tradingPairs": "list_trading_pairs",
  "market.priceTickSize": "get_trading_pair_price_tick_size",
  "market.ticker": "get_trading_pair_ticker",
  "market.orderbook": "get_trading_pair_book",
  "market.trades": "list_trading_pair_trades",
  "market.stats": "get_trading_pair_stats",
  "market.allStats": "list_trading_pairs_stats",
  "market.candles": "get_trading_pair_candles",
  "market.cautions": "list_trading_pairs_cautions",
  "market.tickers": "list_tickers",
  "market.time": "get_time",
  "market.notices": "list_notices",
  "account.listBalances": "list_balances",
  "account.getBalance": "get_balance",
  "orders.listOrders": "list_orders",
  "orders.createOrder": "create_order",
  "orders.getOrder": "get_order",
  "orders.cancelOrder": "cancel_order",
  "orders.getOrderByClientOrderId": "get_order_by_client_order_id",
  "orders.cancelOrderByClientOrderId": "cancel_order_by_client_order_id",
  "trades.listTrades": "list_trades",
  "wallet.listDepositWithdrawalStatus": "list_deposit_withdrawal_status",
  "wallet.listCryptoDepositAddresses": "list_crypto_deposit_addresses",
  "wallet.listCryptoWithdrawalAddresses": "list_crypto_withdrawal_addresses",
  "wallet.withdraw": "create_withdrawal",
} as const satisfies SpecOperationIdMap;

const KORBIT_SPEC_OPERATION_IDS = {
  "market.tickers": "list_tickers",
  "market.orderbook": "get_orderbook",
  "market.trades": "list_trades",
  "market.candles": "get_candles",
  "market.currencyPairs": "list_currency_pairs",
  "market.tickSizePolicy": "get_tick_size_policy",
  "market.currencies": "list_currencies",
  "market.time": "get_time",
  "orders.createOrder": "create_order",
  "orders.cancelOrder": "cancel_order",
  "orders.getOrder": "get_order",
  "orders.listOpenOrders": "list_open_orders",
  "orders.listAllOrders": "list_all_orders",
  "orders.listMyTrades": "list_my_trades",
  "assets.listBalance": "list_balance",
  "cryptoDeposits.listDepositAddresses": "list_coin_deposit_addresses",
  "cryptoDeposits.createDepositAddress": "create_coin_deposit_address",
  "cryptoDeposits.getDepositAddress": "get_coin_deposit_address",
  "cryptoDeposits.listRecentDeposits": "list_coin_recent_deposits",
  "cryptoDeposits.getDeposit": "get_coin_deposit",
  "cryptoWithdrawals.listWithdrawableAddresses": "list_coin_withdrawable_addresses",
  "cryptoWithdrawals.getWithdrawableAmount": "get_coin_withdrawable_amount",
  "cryptoWithdrawals.createWithdrawal": "create_coin_withdrawal",
  "cryptoWithdrawals.cancelWithdrawal": "cancel_coin_withdrawal",
  "cryptoWithdrawals.listRecentWithdrawals": "list_coin_recent_withdrawals",
  "cryptoWithdrawals.getWithdrawal": "get_coin_withdrawal",
  "krw.requestDepositPush": "request_krw_deposit",
  "krw.requestWithdrawalPush": "request_krw_withdrawal",
  "krw.listRecentDeposits": "list_krw_recent_deposits",
  "krw.listRecentWithdrawals": "list_krw_recent_withdrawals",
  "service.getTradingFeePolicy": "get_trading_fee_policy",
  "service.getCurrentKeyInfo": "get_current_key_info",
} as const satisfies SpecOperationIdMap;

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

  upbitToolsCache = resolveTools(
    "upbit",
    attachSpecOperationIds(
      "upbit",
      [
        tool("tradingPairs", "listTradingPairs", "public", [
          upbitQuotationQuery("ListTradingPairs"),
        ]),
        tool("candles", "getSecondCandles", "public", [
          upbitQuotationQuery("GetSecondCandles", true),
        ]),
        tool("candles", "getMinuteCandles", "public", [
          numberArg("unit", "분 캔들 단위", true),
          upbitQuotationQuery("GetMinuteCandles", true),
        ]),
        tool("candles", "getDayCandles", "public", [upbitQuotationQuery("GetDayCandles", true)]),
        tool("candles", "getWeekCandles", "public", [upbitQuotationQuery("GetWeekCandles", true)]),
        tool("candles", "getMonthCandles", "public", [
          upbitQuotationQuery("GetMonthCandles", true),
        ]),
        tool("candles", "getYearCandles", "public", [upbitQuotationQuery("GetYearCandles", true)]),
        tool("trades", "listTradesTicks", "public", [upbitQuotationQuery("ListTradesTicks", true)]),
        tool("tickers", "listTickers", "public", [upbitQuotationQuery("ListTickers", true)]),
        tool("tickers", "listQuoteTickers", "public", [
          upbitQuotationQuery("ListQuoteTickers", true),
        ]),
        tool("orderbook", "listOrderbooks", "public", [
          upbitQuotationQuery("ListOrderbooks", true),
        ]),
        tool("orderbook", "listOrderbookInstruments", "public", [
          upbitQuotationQuery("ListOrderbookInstruments", true),
        ]),
        tool("orderbook", "listOrderbookSupportedLevels", "public", [
          upbitQuotationQuery("ListOrderbookSupportedLevels", true),
        ]),
        tool("assets", "listBalance", "private"),
        tool("orders", "getOrderChance", "private", [upbitExchangeQuery("GetOrderChance", true)]),
        tool("orders", "createOrder", "private", [upbitExchangeBody("CreateOrder")]),
        tool("orders", "createTestOrder", "private", [upbitExchangeBody("CreateTestOrder")]),
        tool("orders", "getOrder", "private", [upbitExchangeQuery("GetOrder")]),
        tool("orders", "cancelOrder", "private", [upbitExchangeQuery("CancelOrder")]),
        tool("orders", "listOrdersByIds", "private", [upbitExchangeQuery("ListOrdersByIds")]),
        tool("orders", "cancelOrdersByIds", "private", [upbitExchangeQuery("CancelOrdersByIds")]),
        tool("orders", "listOpenOrders", "private", [upbitExchangeQuery("ListOpenOrders")]),
        tool("orders", "cancelOpenOrders", "private", [upbitExchangeQuery("CancelOpenOrders")]),
        tool("orders", "listClosedOrders", "private", [upbitExchangeQuery("ListClosedOrders")]),
        tool("orders", "cancelAndCreateOrder", "private", [
          upbitExchangeBody("CancelAndCreateOrder"),
        ]),
        tool("withdrawals", "getWithdrawChance", "private", [
          upbitExchangeQuery("GetWithdrawChance", true),
        ]),
        tool("withdrawals", "listWithdrawalAddresses", "private"),
        tool("withdrawals", "withdraw", "private", [upbitExchangeBody("CreateWithdrawal")]),
        tool("withdrawals", "cancelWithdrawal", "private", [
          upbitExchangeQuery("CancelWithdrawal", true),
        ]),
        tool("withdrawals", "createWithdrawKrw", "private", [
          upbitExchangeBody("CreateWithdrawKrw"),
        ]),
        tool("withdrawals", "getWithdrawal", "private", [upbitExchangeQuery("GetWithdrawal")]),
        tool("withdrawals", "listWithdrawals", "private", [upbitExchangeQuery("ListWithdrawals")]),
        tool("deposits", "getDepositChance", "private", [
          upbitExchangeQuery("GetDepositChance", true),
        ]),
        tool("deposits", "createDepositAddress", "private", [
          upbitExchangeBody("CreateDepositAddress"),
        ]),
        tool("deposits", "getDepositAddress", "private", [
          upbitExchangeQuery("GetDepositAddress", true),
        ]),
        tool("deposits", "listDepositAddresses", "private"),
        tool("deposits", "createDepositKrw", "private", [upbitExchangeBody("CreateDepositKrw")]),
        tool("deposits", "getDeposit", "private", [upbitExchangeQuery("GetDeposit")]),
        tool("deposits", "listDeposits", "private", [upbitExchangeQuery("ListDeposits")]),
        tool("travelRule", "listTravelRuleVasps", "private"),
        tool("travelRule", "verifyTravelRuleByUuid", "private", [
          upbitExchangeBody("VerifyTravelRuleByUuid"),
        ]),
        tool("travelRule", "verifyTravelRuleByTxid", "private", [
          upbitExchangeBody("VerifyTravelRuleByTxid"),
        ]),
        tool("service", "getServiceStatus", "private"),
        tool("service", "listApiKeys", "private"),
      ],
      UPBIT_SPEC_OPERATION_IDS,
    ),
  );

  return upbitToolsCache;
}

function getBithumbTools() {
  if (bithumbToolsCache) return bithumbToolsCache;

  bithumbToolsCache = resolveTools(
    "bithumb",
    attachSpecOperationIds(
      "bithumb",
      [
        tool("markets", "getMarkets", "public", [bithumbPublicQuery("GetMarkets")]),
        tool("markets", "getMarketVirtualAssetWarning", "public"),
        tool("candles", "getMinuteCandles", "public", [
          bithumbPublicQuery("GetMinuteCandles", true),
          numberArg("unit", "분 캔들 단위", false),
        ]),
        tool("candles", "getDayCandles", "public", [bithumbPublicQuery("GetDayCandles", true)]),
        tool("candles", "getWeekCandles", "public", [bithumbPublicQuery("GetWeekCandles", true)]),
        tool("candles", "getMonthCandles", "public", [bithumbPublicQuery("GetMonthCandles", true)]),
        tool("trades", "listTradesTicks", "public", [bithumbPublicQuery("ListTradesTicks", true)]),
        tool("tickers", "getTicker", "public", [bithumbPublicQuery("GetTicker", true)]),
        tool("orderbook", "getOrderbook", "public", [bithumbPublicQuery("GetOrderbook", true)]),
        tool("service", "listNotices", "public"),
        tool("service", "getFeeInfo", "public", [stringArg("currency", "조회할 통화 코드", true)]),
        tool("service", "getWalletStatus", "private"),
        tool("service", "listApiKeys", "private"),
        tool("accounts", "listAccounts", "private"),
        tool("orders", "getOrderChance", "private", [bithumbPrivateQuery("GetOrderChance", true)]),
        tool("orders", "createOrder", "private", [bithumbPrivateBody("CreateOrder")]),
        tool("orders", "createOrdersBatch", "private", [bithumbPrivateBody("CreateOrdersBatch")]),
        tool("orders", "getOrder", "private", [bithumbPrivateQuery("GetOrder")]),
        tool("orders", "cancelOrder", "private", [bithumbPrivateQuery("CancelOrder")]),
        tool("orders", "cancelOrders", "private", [bithumbPrivateBody("CancelOrders")]),
        tool("orders", "listOrders", "private", [bithumbPrivateQuery("ListOrders")]),
        tool("orders", "listTwapOrders", "private", [bithumbPrivateQuery("ListTwapOrders")]),
        tool("orders", "cancelTwapOrder", "private", [
          bithumbPrivateQuery("CancelTwapOrder", true),
        ]),
        tool("orders", "createTwapOrder", "private", [
          bithumbPrivateQuery("CreateTwapOrder", true),
        ]),
        tool("withdrawals", "listWithdraws", "private", [bithumbPrivateQuery("ListWithdraws")]),
        tool("withdrawals", "listWithdrawsKrw", "private", [
          bithumbPrivateQuery("ListWithdrawsKrw"),
        ]),
        tool("withdrawals", "getWithdraw", "private", [bithumbPrivateQuery("GetWithdraw", true)]),
        tool("withdrawals", "getWithdrawChance", "private", [
          bithumbPrivateQuery("GetWithdrawChance", true),
        ]),
        tool("withdrawals", "listWithdrawsCoinAddresses", "private"),
        tool("withdrawals", "createWithdrawsCoin", "private", [
          bithumbPrivateBody("CreateWithdrawsCoin"),
        ]),
        tool("withdrawals", "createWithdrawsKrw", "private", [
          bithumbPrivateBody("CreateWithdrawsKrw"),
        ]),
        tool("deposits", "listDeposits", "private", [bithumbPrivateQuery("ListDeposits")]),
        tool("deposits", "listDepositsKrw", "private", [bithumbPrivateQuery("ListDepositsKrw")]),
        tool("deposits", "getDeposit", "private", [bithumbPrivateQuery("GetDeposit", true)]),
        tool("deposits", "listDepositsCoinAddresses", "private"),
        tool("deposits", "getDepositsCoinAddress", "private", [
          bithumbPrivateQuery("GetDepositsCoinAddress", true),
        ]),
        tool("deposits", "createDepositsKrw", "private", [bithumbPrivateBody("CreateDepositsKrw")]),
        tool("deposits", "createDepositAddress", "private", [
          bithumbPrivateBody("CreateDepositAddress"),
        ]),
      ],
      BITHUMB_SPEC_OPERATION_IDS,
    ),
  );

  return bithumbToolsCache;
}

function getCoinoneTools() {
  if (coinoneToolsCache) return coinoneToolsCache;

  coinoneToolsCache = resolveTools(
    "coinone",
    attachSpecOperationIds(
      "coinone",
      [
        tool("market", "getRangeUnit", "public", [
          stringArg("quoteCurrency", "quote currency", false),
          stringArg("targetCurrency", "target currency", false),
        ]),
        tool("market", "listMarkets", "public", [
          stringArg("quoteCurrency", "quote currency", false),
        ]),
        tool("market", "getMarket", "public", [
          stringArg("quoteCurrency", "quote currency", false),
          stringArg("targetCurrency", "target currency", false),
        ]),
        tool("market", "getOrderbook", "public", [
          stringArg("quoteCurrency", "quote currency", false),
          stringArg("targetCurrency", "target currency", false),
          coinonePublicQuery("GetOrderbook"),
        ]),
        tool("market", "listTrades", "public", [
          stringArg("quoteCurrency", "quote currency", false),
          stringArg("targetCurrency", "target currency", false),
          coinonePublicQuery("ListTrades"),
        ]),
        tool("market", "listTickers", "public", [
          stringArg("quoteCurrency", "quote currency", false),
          coinonePublicQuery("ListTickers"),
        ]),
        tool("market", "getTicker", "public", [
          stringArg("quoteCurrency", "quote currency", false),
          stringArg("targetCurrency", "target currency", false),
          coinonePublicQuery("GetTicker"),
        ]),
        tool("market", "listTickerUtc", "public", [
          stringArg("quoteCurrency", "quote currency", false),
          coinonePublicQuery("ListTickerUtc"),
        ]),
        tool("market", "getTickerUtc", "public", [
          stringArg("quoteCurrency", "quote currency", false),
          stringArg("targetCurrency", "target currency", false),
          coinonePublicQuery("GetTickerUtc"),
        ]),
        tool("market", "listCurrencies", "public"),
        tool("market", "getCurrency", "public", [stringArg("currency", "통화 코드", false)]),
        tool("market", "getChart", "public", [
          stringArg("quoteCurrency", "quote currency", true),
          stringArg("targetCurrency", "target currency", true),
          coinonePublicQuery("GetChart", true),
        ]),
        tool("account", "listBalance", "private"),
        tool("account", "listBalanceByCurrencies", "private", [
          coinonePrivateBody("ListBalanceByCurrencies"),
        ]),
        tool("account", "listTradeFees", "private"),
        tool("account", "getTradeFeeByPair", "private", [
          stringArg("quoteCurrency", "quote currency", false),
          stringArg("targetCurrency", "target currency", false),
          coinonePrivateBody("GetTradeFeeByPair", false),
        ]),
        tool("orders", "listActiveOrders", "private", [
          coinonePrivateBody("ListActiveOrders", false),
        ]),
        tool("orders", "createOrder", "private", [coinonePrivateBody("CreateOrder")]),
        tool("orders", "createLimitOrder", "private", [coinonePrivateBody("CreateLimitOrder")]),
        tool("orders", "cancelOrders", "private", [coinonePrivateBody("CancelOrders")]),
        tool("orders", "cancelOrder", "private", [coinonePrivateBody("CancelOrder")]),
        tool("orders", "getOrderDetail", "private", [coinonePrivateBody("GetOrderDetail")]),
        tool("orders", "listCompletedOrdersAll", "private", [
          coinonePrivateBody("ListCompletedOrdersAll"),
        ]),
        tool("orders", "listCompletedOrders", "private", [
          coinonePrivateBody("ListCompletedOrders"),
        ]),
        tool("orders", "listOpenOrdersAll", "private", [
          coinonePrivateBody("ListOpenOrdersAll", false),
        ]),
        tool("orders", "listOpenOrders", "private", [coinonePrivateBody("ListOpenOrders")]),
        tool("orders", "getOrderInfo", "private", [coinonePrivateBody("GetOrderInfo")]),
        tool("transactions", "listKrwTransactionHistory", "private", [
          coinonePrivateBody("ListKrwTransactionHistory", false),
        ]),
        tool("transactions", "listCoinTransactionHistory", "private", [
          coinonePrivateBody("ListCoinTransactionHistory", false),
        ]),
        tool("transactions", "getCoinTransactionHistoryDetail", "private", [
          coinonePrivateBody("GetCoinTransactionHistoryDetail"),
        ]),
        tool("transactions", "getCoinWithdrawalLimit", "private", [
          coinonePrivateBody("GetCoinWithdrawalLimit"),
        ]),
        tool("transactions", "listCoinWithdrawalAddressBook", "private", [
          coinonePrivateBody("ListCoinWithdrawalAddressBook", false),
        ]),
        tool("transactions", "createCoinWithdrawal", "private", [
          coinonePrivateBody("CreateCoinWithdrawal"),
        ]),
        tool("rewards", "listOrderRewardPrograms", "private", [
          coinonePrivateBody("ListOrderRewardPrograms", false),
        ]),
        tool("rewards", "listOrderRewardHistory", "private", [
          coinonePrivateBody("ListOrderRewardHistory", false),
        ]),
      ],
      COINONE_SPEC_OPERATION_IDS,
    ),
  );

  return coinoneToolsCache;
}

function getGopaxTools() {
  if (gopaxToolsCache) return gopaxToolsCache;

  gopaxToolsCache = resolveTools(
    "gopax",
    attachSpecOperationIds(
      "gopax",
      [
        tool("market", "assets", "public"),
        tool("market", "tradingPairs", "public"),
        tool("market", "priceTickSize", "public", [stringArg("tradingPair", "거래 페어", true)]),
        tool("market", "ticker", "public", [stringArg("tradingPair", "거래 페어", true)]),
        tool("market", "orderbook", "public", [
          stringArg("tradingPair", "거래 페어", true),
          gopaxPublicQuery("GetTradingPairBook"),
        ]),
        tool("market", "trades", "public", [
          stringArg("tradingPair", "거래 페어", true),
          gopaxPublicQuery("ListTradingPairTrades"),
        ]),
        tool("market", "stats", "public", [stringArg("tradingPair", "거래 페어", true)]),
        tool("market", "allStats", "public"),
        tool("market", "candles", "public", [
          stringArg("tradingPair", "거래 페어", true),
          gopaxPublicQuery("GetTradingPairCandles", true),
        ]),
        tool("market", "cautions", "public", [gopaxPublicQuery("ListTradingPairsCautions")]),
        tool("market", "tickers", "public"),
        tool("market", "time", "public"),
        tool("market", "notices", "public", [gopaxPublicQuery("ListNotices")]),
        tool("account", "listBalances", "private"),
        tool("account", "getBalance", "private", [stringArg("assetName", "자산 코드", true)]),
        tool("orders", "listOrders", "private", [gopaxPrivateQuery("ListOrders")]),
        tool("orders", "createOrder", "private", [gopaxPrivateBody("CreateOrder")]),
        tool("orders", "getOrder", "private", [stringArg("orderId", "주문 ID", true)]),
        tool("orders", "cancelOrder", "private", [stringArg("orderId", "주문 ID", true)]),
        tool("orders", "getOrderByClientOrderId", "private", [
          stringArg("clientOrderId", "클라이언트 주문 ID", true),
        ]),
        tool("orders", "cancelOrderByClientOrderId", "private", [
          stringArg("clientOrderId", "클라이언트 주문 ID", true),
        ]),
        tool("trades", "listTrades", "private", [gopaxPrivateQuery("ListTrades")]),
        tool("wallet", "listDepositWithdrawalStatus", "private", [
          gopaxPrivateQuery("ListDepositWithdrawalStatus"),
        ]),
        tool("wallet", "listCryptoDepositAddresses", "private"),
        tool("wallet", "listCryptoWithdrawalAddresses", "private"),
        tool("wallet", "withdraw", "private", [gopaxPrivateBody("CreateWithdrawal")]),
      ],
      GOPAX_SPEC_OPERATION_IDS,
    ),
  );

  return gopaxToolsCache;
}

function getKorbitTools() {
  if (korbitToolsCache) return korbitToolsCache;

  korbitToolsCache = resolveTools(
    "korbit",
    attachSpecOperationIds(
      "korbit",
      [
        tool("market", "tickers", "public", [korbitPublicQuery("ListTickers")]),
        tool("market", "orderbook", "public", [korbitPublicQuery("GetOrderbook", true)]),
        tool("market", "trades", "public", [korbitPublicQuery("ListTrades", true)]),
        tool("market", "candles", "public", [korbitPublicQuery("GetCandles", true)]),
        tool("market", "currencyPairs", "public"),
        tool("market", "tickSizePolicy", "public", [korbitPublicQuery("GetTickSizePolicy", true)]),
        tool("market", "currencies", "public"),
        tool("market", "time", "public"),
        tool("orders", "createOrder", "private", [bodyArg()]),
        tool("orders", "cancelOrder", "private", [korbitPrivateQuery("CancelOrder", true)]),
        tool("orders", "getOrder", "private", [korbitPrivateQuery("GetOrder", true)]),
        tool("orders", "listOpenOrders", "private", [korbitPrivateQuery("ListOpenOrders", true)]),
        tool("orders", "listAllOrders", "private", [korbitPrivateQuery("ListAllOrders", true)]),
        tool("orders", "listMyTrades", "private", [korbitPrivateQuery("ListMyTrades", true)]),
        tool("assets", "listBalance", "private", [korbitPrivateQuery("ListBalance")]),
        tool("cryptoDeposits", "listDepositAddresses", "private"),
        tool("cryptoDeposits", "createDepositAddress", "private", [bodyArg()]),
        tool("cryptoDeposits", "getDepositAddress", "private", [
          korbitPrivateQuery("GetCoinDepositAddress", true),
        ]),
        tool("cryptoDeposits", "listRecentDeposits", "private", [
          korbitPrivateQuery("ListCoinRecentDeposits", true),
        ]),
        tool("cryptoDeposits", "getDeposit", "private", [
          korbitPrivateQuery("GetCoinDeposit", true),
        ]),
        tool("cryptoWithdrawals", "listWithdrawableAddresses", "private"),
        tool("cryptoWithdrawals", "getWithdrawableAmount", "private", [
          korbitPrivateQuery("GetCoinWithdrawableAmount"),
        ]),
        tool("cryptoWithdrawals", "createWithdrawal", "private", [bodyArg()]),
        tool("cryptoWithdrawals", "cancelWithdrawal", "private", [
          korbitPrivateQuery("CancelCoinWithdrawal", true),
        ]),
        tool("cryptoWithdrawals", "listRecentWithdrawals", "private", [
          korbitPrivateQuery("ListCoinRecentWithdrawals", true),
        ]),
        tool("cryptoWithdrawals", "getWithdrawal", "private", [
          korbitPrivateQuery("GetCoinWithdrawal", true),
        ]),
        tool("krw", "requestDepositPush", "private", [bodyArg()]),
        tool("krw", "requestWithdrawalPush", "private", [bodyArg()]),
        tool("krw", "listRecentDeposits", "private", [
          korbitPrivateQuery("ListKrwRecentDeposits", true),
        ]),
        tool("krw", "listRecentWithdrawals", "private", [
          korbitPrivateQuery("ListKrwRecentWithdrawals", true),
        ]),
        tool("service", "getTradingFeePolicy", "private", [
          korbitPrivateQuery("GetTradingFeePolicy"),
        ]),
        tool("service", "getCurrentKeyInfo", "private"),
      ],
      KORBIT_SPEC_OPERATION_IDS,
    ),
  );

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

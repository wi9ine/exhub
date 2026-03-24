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
  "candles.listCandlesSeconds": "list_candles_seconds",
  "candles.listCandlesMinutes": "list_candles_minutes",
  "candles.listCandlesDays": "list_candles_days",
  "candles.listCandlesWeeks": "list_candles_weeks",
  "candles.listCandlesMonths": "list_candles_months",
  "candles.listCandlesYears": "list_candles_years",
  "trades.recentTradesHistory": "recent_trades_history",
  "tickers.listTickers": "list_tickers",
  "tickers.listQuoteTickers": "list_quote_tickers",
  "orderbook.listOrderbooks": "list_orderbooks",
  "orderbook.listOrderbookInstruments": "list_orderbook_instruments",
  "orderbook.listOrderbookLevels": "list_orderbook_levels",
  "assets.getBalance": "get_balance",
  "orders.availableOrderInformation": "available_order_information",
  "orders.newOrder": "new_order",
  "orders.testOrder": "test_order",
  "orders.getOrder": "get_order",
  "orders.cancelOrder": "cancel_order",
  "orders.listOrdersByIds": "list_orders_by_ids",
  "orders.cancelOrdersByIds": "cancel_orders_by_ids",
  "orders.listOpenOrders": "list_open_orders",
  "orders.batchCancelOrders": "batch_cancel_orders",
  "orders.listClosedOrders": "list_closed_orders",
  "orders.cancelAndNewOrder": "cancel_and_new_order",
  "withdrawals.availableWithdrawalInformation": "available_withdrawal_information",
  "withdrawals.listWithdrawalAddresses": "list_withdrawal_addresses",
  "withdrawals.withdraw": "withdraw",
  "withdrawals.cancelWithdrawal": "cancel_withdrawal",
  "withdrawals.withdrawKrw": "withdraw_krw",
  "withdrawals.getWithdrawal": "get_withdrawal",
  "withdrawals.listWithdrawals": "list_withdrawals",
  "deposits.availableDepositInformation": "available_deposit_information",
  "deposits.createDepositAddress": "create_deposit_address",
  "deposits.getDepositAddress": "get_deposit_address",
  "deposits.listDepositAddresses": "list_deposit_addresses",
  "deposits.depositKrw": "deposit_krw",
  "deposits.getDeposit": "get_deposit",
  "deposits.listDeposits": "list_deposits",
  "travelRule.listTravelruleVasps": "list_travelrule_vasps",
  "travelRule.verifyTravelruleByUuid": "verify_travelrule_by_uuid",
  "travelRule.verifyTravelruleByTxid": "verify_travelrule_by_txid",
  "service.getServiceStatus": "get_service_status",
  "service.listApiKeys": "list_api_keys",
} as const satisfies SpecOperationIdMap;

const BITHUMB_SPEC_OPERATION_IDS = {
  "markets.getMarketAll": "get_market_all",
  "markets.getMarketVirtualAssetWarning": "get_market_virtual_asset_warning",
  "candles.minute1": "minute_1",
  "candles.day": "day",
  "candles.week": "week",
  "candles.month": "month",
  "trades.getTradesTicks": "get_trades_ticks",
  "tickers.getTicker": "get_ticker",
  "orderbook.getOrderbook": "get_orderbook",
  "service.getNotices": "get_notices",
  "service.getFeeInfo": "get_fee_info",
  "service.getStatusWallet": "get_status_wallet",
  "service.api": "api",
  "accounts.getAccounts": "get_accounts",
  "orders.getOrdersChance": "get_orders_chance",
  "orders.placeOrder": "post_orders",
  "orders.placeBatchOrders": "post_orders_batch",
  "orders.getOrder": "get_order",
  "orders.cancelOrder": "delete_order",
  "orders.cancelOrders": "post_orders_cancel",
  "orders.getOrders": "get_orders",
  "orders.getTwapOrders": "gettwaporders",
  "orders.cancelTwapOrder": "canceltwaporder",
  "orders.createTwapOrder": "createtwaporder",
  "withdrawals.getWithdraws": "get_withdraws",
  "withdrawals.getWithdrawsKrw": "get_withdraws_krw",
  "withdrawals.getWithdraw": "get_withdraw",
  "withdrawals.getWithdrawsChance": "get_withdraws_chance",
  "withdrawals.getWithdrawsCoinAddresses": "get_withdraws_coin_addresses",
  "withdrawals.withdrawCoin": "post_withdraws_coin",
  "withdrawals.withdrawKrw": "post_withdraws_krw",
  "deposits.getDeposits": "get_deposits",
  "deposits.getDepositsKrw": "get_deposits_krw",
  "deposits.getDeposit": "get_deposit",
  "deposits.getDepositsCoinAddresses": "get_deposits_coin_addresses",
  "deposits.getDepositsCoinAddress": "get_deposits_coin_address",
  "deposits.depositKrw": "post_deposits_krw",
  "deposits.generateCoinAddress": "post_deposits_generate_coin_address",
} as const satisfies SpecOperationIdMap;

const COINONE_SPEC_OPERATION_IDS = {
  "market.rangeUnit": "range_unit",
  "market.markets": "markets",
  "market.market": "market",
  "market.orderbook": "orderbook",
  "market.recentCompletedOrders": "recent_completed_orders",
  "market.tickers": "tickers",
  "market.ticker": "ticker",
  "market.utcTickers": "utc_tickers",
  "market.utcTicker": "utc_ticker",
  "market.currencies": "currencies",
  "market.currency": "currency",
  "market.chart": "chart",
  "market.orderbookDeprecated": "orderbook_deprecated",
  "market.tickerDeprecated": "ticker_1",
  "market.tickerUtcDeprecated": "ticker_utc_deprecated",
  "market.recentCompletedOrdersDeprecated": "recent_complete_orders_deprecated",
  "account.findBalance": "find_balance",
  "account.findBalanceByCurrencies": "find_balance_by_currencies",
  "account.findAllTradeFees": "find_all_trade_fees",
  "account.findTradeFeeByPair": "find_trade_fee_by_pair",
  "orders.findActiveOrders": "find_active_orders",
  "orders.placeOrder": "place_order",
  "orders.placeLimitOrder": "order_place_limit_order",
  "orders.cancelOrders": "cancel_orders",
  "orders.cancelOrder": "cancel_order",
  "orders.orderDetail": "order_detail",
  "orders.findAllCompletedOrders": "find_all_completed_orders",
  "orders.findCompletedOrders": "find_completed_orders",
  "orders.findAllOpenOrders": "find_all_open_orders",
  "orders.findOpenOrders": "find_open_orders",
  "orders.findOrderInfo": "find_order_info",
  "transactions.krwTransactionHistory": "krw_transaction_history",
  "transactions.coinTransactionHistory": "coin_transaction_history",
  "transactions.singleCoinTransactionHistory": "single_coin_transaction_history",
  "transactions.coinWithdrawalLimit": "coin_withdrawal_limit",
  "transactions.coinWithdrawalAddressBook": "coin_withdrawal_address_book",
  "transactions.coinWithdrawal": "coin_withdrawal",
  "rewards.orderRewardPrograms": "order_reward_programs",
  "rewards.orderRewardHistory": "order_reward_history",
} as const satisfies SpecOperationIdMap;

const GOPAX_SPEC_OPERATION_IDS = {
  "market.assets": "getassets",
  "market.tradingPairs": "gettradingpairs",
  "market.priceTickSize": "gettradingpairstradingpairpriceticksize",
  "market.ticker": "gettradingpairstradingpairticker",
  "market.orderbook": "gettradingpairstradingpairbook",
  "market.trades": "gettradingpairstradingpairtrades",
  "market.stats": "gettradingpairstradingpairstats",
  "market.allStats": "gettradingpairsstats",
  "market.candles": "gettradingpairstradingpaircandles",
  "market.cautions": "gettradingpairscautions",
  "market.tickers": "gettickers",
  "market.time": "gettime",
  "market.notices": "getnotices",
  "account.getBalances": "getbalances",
  "account.getBalance": "getbalancesassetname",
  "orders.getOrders": "getorders",
  "orders.placeOrder": "postorders",
  "orders.getOrder": "getordersorderid",
  "orders.cancelOrder": "deleteordersorderid",
  "orders.getOrderByClientOrderId": "getordersclientorderid",
  "orders.cancelOrderByClientOrderId": "deleteordersclientorderid",
  "trades.getTrades": "gettrades",
  "wallet.getDepositWithdrawalStatus": "getdepositwithdrawalstatus",
  "wallet.getCryptoDepositAddresses": "getcryptodepositaddresses",
  "wallet.getCryptoWithdrawalAddresses": "getcryptowithdrawaladdresses",
  "wallet.withdraw": "postwithdrawals",
} as const satisfies SpecOperationIdMap;

const KORBIT_SPEC_OPERATION_IDS = {
  "market.tickers": "getv2tickers",
  "market.orderbook": "getv2orderbook",
  "market.trades": "getv2trades",
  "market.candles": "getv2candles",
  "market.currencyPairs": "getv2currencypairs",
  "market.tickSizePolicy": "getv2ticksizepolicy",
  "market.currencies": "getv2currencies",
  "market.time": "getv2time",
  "orders.placeOrder": "postv2orders",
  "orders.cancelOrder": "deletev2orders",
  "orders.getOrder": "getv2orders",
  "orders.getOpenOrders": "getv2openorders",
  "orders.getAllOrders": "getv2allorders",
  "orders.getMyTrades": "getv2mytrades",
  "assets.getBalance": "getv2balance",
  "cryptoDeposits.getDepositAddresses": "getv2coindepositaddresses",
  "cryptoDeposits.createDepositAddress": "postv2coindepositaddress",
  "cryptoDeposits.getDepositAddress": "getv2coindepositaddress",
  "cryptoDeposits.getRecentDeposits": "getv2coinrecentdeposits",
  "cryptoDeposits.getDeposit": "getv2coindeposit",
  "cryptoWithdrawals.getWithdrawableAddresses": "getv2coinwithdrawableaddresses",
  "cryptoWithdrawals.getWithdrawableAmount": "getv2coinwithdrawableamount",
  "cryptoWithdrawals.withdraw": "postv2coinwithdrawal",
  "cryptoWithdrawals.cancelWithdrawal": "deletev2coinwithdrawal",
  "cryptoWithdrawals.getRecentWithdrawals": "getv2coinrecentwithdrawals",
  "cryptoWithdrawals.getWithdrawal": "getv2coinwithdrawal",
  "krw.sendDepositPush": "postv2krwsendkrwdepositpush",
  "krw.sendWithdrawalPush": "postv2krwsendkrwwithdrawalpush",
  "krw.getRecentDeposits": "getv2krwrecentdeposits",
  "krw.getRecentWithdrawals": "getv2krwrecentwithdrawals",
  "service.getTradingFeePolicy": "getv2tradingfeepolicy",
  "service.getCurrentKeyInfo": "getv2currentkeyinfo",
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
        ? `${candidate.category}.${candidate.method}`
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
        tool("candles", "listCandlesSeconds", "public", [
          upbitQuotationQuery("ListCandlesSeconds", true),
        ]),
        tool("candles", "listCandlesMinutes", "public", [
          numberArg("unit", "분 캔들 단위", true),
          upbitQuotationQuery("ListCandlesMinutes", true),
        ]),
        tool("candles", "listCandlesDays", "public", [
          upbitQuotationQuery("ListCandlesDays", true),
        ]),
        tool("candles", "listCandlesWeeks", "public", [
          upbitQuotationQuery("ListCandlesWeeks", true),
        ]),
        tool("candles", "listCandlesMonths", "public", [
          upbitQuotationQuery("ListCandlesMonths", true),
        ]),
        tool("candles", "listCandlesYears", "public", [
          upbitQuotationQuery("ListCandlesYears", true),
        ]),
        tool("trades", "recentTradesHistory", "public", [
          upbitQuotationQuery("RecentTradesHistory", true),
        ]),
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
        tool("orders", "getOrdersChance", "private", [
          bithumbPrivateQuery("GetOrdersChance", true),
        ]),
        tool("orders", "placeOrder", "private", [bithumbPrivateBody("PostOrders")]),
        tool("orders", "placeBatchOrders", "private", [bithumbPrivateBody("PostOrdersBatch")]),
        tool("orders", "getOrder", "private", [bithumbPrivateQuery("GetOrder")]),
        tool("orders", "cancelOrder", "private", [bithumbPrivateQuery("DeleteOrder")]),
        tool("orders", "cancelOrders", "private", [bithumbPrivateBody("PostOrdersCancel")]),
        tool("orders", "getOrders", "private", [bithumbPrivateQuery("GetOrders")]),
        tool("orders", "getTwapOrders", "private", [bithumbPrivateQuery("Gettwaporders")]),
        tool("orders", "cancelTwapOrder", "private", [
          bithumbPrivateQuery("Canceltwaporder", true),
        ]),
        tool("orders", "createTwapOrder", "private", [
          bithumbPrivateQuery("Createtwaporder", true),
        ]),
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
        tool("market", "orderbookDeprecated", "public", [
          coinonePublicQuery("OrderbookDeprecated"),
        ]),
        tool("market", "tickerDeprecated", "public", [coinonePublicQuery("Ticker1")]),
        tool("market", "tickerUtcDeprecated", "public", [
          coinonePublicQuery("TickerUtcDeprecated"),
        ]),
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
        tool("orders", "findActiveOrders", "private", [
          coinonePrivateBody("FindActiveOrders", false),
        ]),
        tool("orders", "placeOrder", "private", [coinonePrivateBody("PlaceOrder")]),
        tool("orders", "placeLimitOrder", "private", [coinonePrivateBody("OrderPlaceLimitOrder")]),
        tool("orders", "cancelOrders", "private", [coinonePrivateBody("CancelOrders")]),
        tool("orders", "cancelOrder", "private", [coinonePrivateBody("CancelOrder")]),
        tool("orders", "orderDetail", "private", [coinonePrivateBody("OrderDetail")]),
        tool("orders", "findAllCompletedOrders", "private", [
          coinonePrivateBody("FindAllCompletedOrders"),
        ]),
        tool("orders", "findCompletedOrders", "private", [
          coinonePrivateBody("FindCompletedOrders"),
        ]),
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
        tool("market", "tickers", "public", [korbitPublicQuery("Getv2tickers")]),
        tool("market", "orderbook", "public", [korbitPublicQuery("Getv2orderbook", true)]),
        tool("market", "trades", "public", [korbitPublicQuery("Getv2trades", true)]),
        tool("market", "candles", "public", [korbitPublicQuery("Getv2candles", true)]),
        tool("market", "currencyPairs", "public"),
        tool("market", "tickSizePolicy", "public", [
          korbitPublicQuery("Getv2ticksizepolicy", true),
        ]),
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
        tool("cryptoDeposits", "getDeposit", "private", [
          korbitPrivateQuery("Getv2coindeposit", true),
        ]),
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

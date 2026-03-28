// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.

import { createBithumbClient } from "@exhub/bithumb";
import { createCoinoneClient } from "@exhub/coinone";
import { createGopaxClient } from "@exhub/gopax";
import { createKorbitClient } from "@exhub/korbit";
import { createUpbitClient } from "@exhub/upbit";
import type { ZodTypeAny } from "zod";

import type { ExchangeKey, ExchangeRuntimeDefinition, ToolArgumentDefinition, ToolMetadata } from "../types";

// ─── 헬퍼 함수 ───

type RuntimeOptions = { baseURL?: string; timeout?: number };
type ValidatorNamespace = Record<string, unknown>;

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
        requireNamedValidator(requireLoadedNamespace(getNamespace(), label), `${prefix}QueryParams`),
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
  const baseURL = process.env[`${prefix}_BASE_URL`];
  const timeoutValue = process.env[`${prefix}_TIMEOUT_MS`];
  if (!timeoutValue) {
    return baseURL ? { baseURL } : {};
  }
  const timeout = Number(timeoutValue);
  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error(`${prefix}_TIMEOUT_MS 값이 올바르지 않습니다: ${timeoutValue}`);
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

// ─── Zod 변수 및 로딩 ───

let bithumbPublicZod: ValidatorNamespace | undefined;
let bithumbPrivateZod: ValidatorNamespace | undefined;
let coinonePublicZod: ValidatorNamespace | undefined;
let coinonePrivateZod: ValidatorNamespace | undefined;
let gopaxPublicZod: ValidatorNamespace | undefined;
let gopaxPrivateZod: ValidatorNamespace | undefined;
let korbitPublicZod: ValidatorNamespace | undefined;
let korbitPrivateZod: ValidatorNamespace | undefined;
let upbitQuotationZod: ValidatorNamespace | undefined;
let upbitExchangeZod: ValidatorNamespace | undefined;

async function ensureBithumbZodLoaded() {
  if (!bithumbPublicZod || !bithumbPrivateZod) {
    [bithumbPublicZod, bithumbPrivateZod] = await Promise.all([
      bithumbPublicZod ?? import("@exhub/bithumb/zod/public"),
      bithumbPrivateZod ?? import("@exhub/bithumb/zod/private")
    ]);
  }
}

async function ensureCoinoneZodLoaded() {
  if (!coinonePublicZod || !coinonePrivateZod) {
    [coinonePublicZod, coinonePrivateZod] = await Promise.all([
      coinonePublicZod ?? import("@exhub/coinone/zod/public"),
      coinonePrivateZod ?? import("@exhub/coinone/zod/private")
    ]);
  }
}

async function ensureGopaxZodLoaded() {
  if (!gopaxPublicZod || !gopaxPrivateZod) {
    [gopaxPublicZod, gopaxPrivateZod] = await Promise.all([
      gopaxPublicZod ?? import("@exhub/gopax/zod/public"),
      gopaxPrivateZod ?? import("@exhub/gopax/zod/private")
    ]);
  }
}

async function ensureKorbitZodLoaded() {
  if (!korbitPublicZod || !korbitPrivateZod) {
    [korbitPublicZod, korbitPrivateZod] = await Promise.all([
      korbitPublicZod ?? import("@exhub/korbit/zod/public"),
      korbitPrivateZod ?? import("@exhub/korbit/zod/private")
    ]);
  }
}

async function ensureUpbitZodLoaded() {
  if (!upbitQuotationZod || !upbitExchangeZod) {
    [upbitQuotationZod, upbitExchangeZod] = await Promise.all([
      upbitQuotationZod ?? import("@exhub/upbit/zod/quotation"),
      upbitExchangeZod ?? import("@exhub/upbit/zod/exchange")
    ]);
  }
}

// ─── Validator arg factories ───

const bithumbPublicArgs = createValidatorArgFactory(() => bithumbPublicZod, "bithumb public");
const bithumbPrivateArgs = createValidatorArgFactory(() => bithumbPrivateZod, "bithumb private");
const coinonePublicArgs = createValidatorArgFactory(() => coinonePublicZod, "coinone public");
const coinonePrivateArgs = createValidatorArgFactory(() => coinonePrivateZod, "coinone private");
const gopaxPublicArgs = createValidatorArgFactory(() => gopaxPublicZod, "gopax public");
const gopaxPrivateArgs = createValidatorArgFactory(() => gopaxPrivateZod, "gopax private");
const korbitPublicArgs = createValidatorArgFactory(() => korbitPublicZod, "korbit public");
const korbitPrivateArgs = createValidatorArgFactory(() => korbitPrivateZod, "korbit private");
const upbitQuotationArgs = createValidatorArgFactory(() => upbitQuotationZod, "upbit quotation");
const upbitExchangeArgs = createValidatorArgFactory(() => upbitExchangeZod, "upbit exchange");

let bithumbToolsCache: readonly ToolMetadata[] | undefined;
let coinoneToolsCache: readonly ToolMetadata[] | undefined;
let gopaxToolsCache: readonly ToolMetadata[] | undefined;
let korbitToolsCache: readonly ToolMetadata[] | undefined;
let upbitToolsCache: readonly ToolMetadata[] | undefined;

// ─── SPEC_OPERATION_IDS ───

export type SpecOperationIdMap = Record<string, string>;

const BITHUMB_SPEC_OPERATION_IDS = {
  "markets.getMarkets": "get_markets",
  "candles.getMinuteCandles": "get_minute_candles",
  "candles.getDayCandles": "get_day_candles",
  "candles.getWeekCandles": "get_week_candles",
  "candles.getMonthCandles": "get_month_candles",
  "trades.listTradesTicks": "list_trades_ticks",
  "tickers.getTicker": "get_ticker",
  "orderbook.getOrderbook": "get_orderbook",
  "service.getMarketVirtualAssetWarning": "get_market_virtual_asset_warning",
  "service.listNotices": "list_notices",
  "service.getFeeInfo": "get_fee_info",
  "service.getWalletStatus": "get_wallet_status",
  "service.listApiKeys": "list_api_keys",
  "accounts.listAccounts": "list_accounts",
  "orders.getOrderChance": "get_order_chance",
  "orders.getOrder": "get_order",
  "orders.cancelOrder": "cancel_order",
  "orders.listOrders": "list_orders",
  "orders.createOrder": "create_order",
  "orders.createOrdersBatch": "create_orders_batch",
  "orders.cancelOrders": "cancel_orders",
  "orders.listTwapOrders": "list_twap_orders",
  "orders.cancelTwapOrder": "cancel_twap_order",
  "orders.createTwapOrder": "create_twap_order",
  "withdrawals.listWithdraws": "list_withdraws",
  "withdrawals.listWithdrawsKrw": "list_withdraws_krw",
  "withdrawals.createWithdrawsKrw": "create_withdraws_krw",
  "withdrawals.getWithdraw": "get_withdraw",
  "withdrawals.getWithdrawChance": "get_withdraw_chance",
  "withdrawals.createWithdrawsCoin": "create_withdraws_coin",
  "withdrawals.listWithdrawsCoinAddresses": "list_withdraws_coin_addresses",
  "deposits.listDeposits": "list_deposits",
  "deposits.listDepositsKrw": "list_deposits_krw",
  "deposits.createDepositsKrw": "create_deposits_krw",
  "deposits.getDeposit": "get_deposit",
  "deposits.createDepositAddress": "create_deposit_address",
  "deposits.listDepositsCoinAddresses": "list_deposits_coin_addresses",
  "deposits.getDepositsCoinAddress": "get_deposits_coin_address",
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
  "orders.getOrderDetail": "get_order_detail",
  "orders.listCompletedOrdersAll": "list_completed_orders_all",
  "orders.listCompletedOrders": "list_completed_orders",
  "orders.createOrder": "create_order",
  "orders.cancelOrders": "cancel_orders",
  "orders.cancelOrder": "cancel_order",
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
  "market.listAssets": "list_assets",
  "market.listTradingPairs": "list_trading_pairs",
  "market.getTradingPairPriceTickSize": "get_trading_pair_price_tick_size",
  "market.getTradingPairTicker": "get_trading_pair_ticker",
  "market.getTradingPairBook": "get_trading_pair_book",
  "market.listTradingPairTrades": "list_trading_pair_trades",
  "market.getTradingPairStats": "get_trading_pair_stats",
  "market.listTradingPairsStats": "list_trading_pairs_stats",
  "market.getTradingPairCandles": "get_trading_pair_candles",
  "market.listTradingPairsCautions": "list_trading_pairs_cautions",
  "market.listTickers": "list_tickers",
  "market.getTime": "get_time",
  "market.listNotices": "list_notices",
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
  "wallet.createWithdrawal": "create_withdrawal",
} as const satisfies SpecOperationIdMap;

const KORBIT_SPEC_OPERATION_IDS = {
  "market.listTickers": "list_tickers",
  "market.getOrderbook": "get_orderbook",
  "market.listTrades": "list_trades",
  "market.getCandles": "get_candles",
  "market.listCurrencyPairs": "list_currency_pairs",
  "market.getTickSizePolicy": "get_tick_size_policy",
  "service.listCurrencies": "list_currencies",
  "service.getTime": "get_time",
  "service.getTradingFeePolicy": "get_trading_fee_policy",
  "service.getCurrentKeyInfo": "get_current_key_info",
  "orders.getOrder": "get_order",
  "orders.createOrder": "create_order",
  "orders.cancelOrder": "cancel_order",
  "orders.listOpenOrders": "list_open_orders",
  "orders.listAllOrders": "list_all_orders",
  "orders.listMyTrades": "list_my_trades",
  "assets.listBalance": "list_balance",
  "cryptoDeposits.listCoinDepositAddresses": "list_coin_deposit_addresses",
  "cryptoDeposits.getCoinDepositAddress": "get_coin_deposit_address",
  "cryptoDeposits.createCoinDepositAddress": "create_coin_deposit_address",
  "cryptoDeposits.listCoinRecentDeposits": "list_coin_recent_deposits",
  "cryptoDeposits.getCoinDeposit": "get_coin_deposit",
  "cryptoWithdrawals.listCoinWithdrawableAddresses": "list_coin_withdrawable_addresses",
  "cryptoWithdrawals.getCoinWithdrawableAmount": "get_coin_withdrawable_amount",
  "cryptoWithdrawals.createCoinWithdrawal": "create_coin_withdrawal",
  "cryptoWithdrawals.cancelCoinWithdrawal": "cancel_coin_withdrawal",
  "cryptoWithdrawals.getCoinWithdrawal": "get_coin_withdrawal",
  "cryptoWithdrawals.listCoinRecentWithdrawals": "list_coin_recent_withdrawals",
  "krw.requestKrwDeposit": "request_krw_deposit",
  "krw.requestKrwWithdrawal": "request_krw_withdrawal",
  "krw.listKrwRecentDeposits": "list_krw_recent_deposits",
  "krw.listKrwRecentWithdrawals": "list_krw_recent_withdrawals",
} as const satisfies SpecOperationIdMap;

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
  "withdrawals.createWithdrawal": "create_withdrawal",
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

// ─── getTools 함수 ───

function getBithumbTools() {
  if (bithumbToolsCache) return bithumbToolsCache;

  bithumbToolsCache = [
    tool("markets", "getMarkets", "public", [bithumbPublicArgs.query("GetMarkets", false)]),
    tool("candles", "getMinuteCandles", "public", [numberArg("unit", "분 단위. 가능한 값 : 1, 3, 5, 10, 15, 30, 60, 240", false), bithumbPublicArgs.query("GetMinuteCandles", true)]),
    tool("candles", "getDayCandles", "public", [bithumbPublicArgs.query("GetDayCandles", true)]),
    tool("candles", "getWeekCandles", "public", [bithumbPublicArgs.query("GetWeekCandles", true)]),
    tool("candles", "getMonthCandles", "public", [bithumbPublicArgs.query("GetMonthCandles", true)]),
    tool("trades", "listTradesTicks", "public", [bithumbPublicArgs.query("ListTradesTicks", true)]),
    tool("tickers", "getTicker", "public", [bithumbPublicArgs.query("GetTicker", true)]),
    tool("orderbook", "getOrderbook", "public", [bithumbPublicArgs.query("GetOrderbook", true)]),
    tool("service", "getMarketVirtualAssetWarning", "public"),
    tool("service", "listNotices", "public"),
    tool("service", "getFeeInfo", "public", [stringArg("currency", "currency", true)]),
    tool("service", "getWalletStatus", "private"),
    tool("service", "listApiKeys", "private"),
    tool("accounts", "listAccounts", "private"),
    tool("orders", "getOrderChance", "private", [bithumbPrivateArgs.query("GetOrderChance", true)]),
    tool("orders", "getOrder", "private", [bithumbPrivateArgs.query("GetOrder", false)]),
    tool("orders", "cancelOrder", "private", [bithumbPrivateArgs.query("CancelOrder", false)]),
    tool("orders", "listOrders", "private", [bithumbPrivateArgs.query("ListOrders", false)]),
    tool("orders", "createOrder", "private", [bithumbPrivateArgs.body("CreateOrder", true)]),
    tool("orders", "createOrdersBatch", "private", [bithumbPrivateArgs.body("CreateOrdersBatch", true)]),
    tool("orders", "cancelOrders", "private", [bithumbPrivateArgs.body("CancelOrders", false)]),
    tool("orders", "listTwapOrders", "private", [bithumbPrivateArgs.query("ListTwapOrders", false)]),
    tool("orders", "cancelTwapOrder", "private", [bithumbPrivateArgs.query("CancelTwapOrder", true)]),
    tool("orders", "createTwapOrder", "private", [bithumbPrivateArgs.query("CreateTwapOrder", true)]),
    tool("withdrawals", "listWithdraws", "private", [bithumbPrivateArgs.query("ListWithdraws", false)]),
    tool("withdrawals", "listWithdrawsKrw", "private", [bithumbPrivateArgs.query("ListWithdrawsKrw", false)]),
    tool("withdrawals", "createWithdrawsKrw", "private", [bithumbPrivateArgs.body("CreateWithdrawsKrw", true)]),
    tool("withdrawals", "getWithdraw", "private", [bithumbPrivateArgs.query("GetWithdraw", true)]),
    tool("withdrawals", "getWithdrawChance", "private", [bithumbPrivateArgs.query("GetWithdrawChance", true)]),
    tool("withdrawals", "createWithdrawsCoin", "private", [bithumbPrivateArgs.body("CreateWithdrawsCoin", true)]),
    tool("withdrawals", "listWithdrawsCoinAddresses", "private"),
    tool("deposits", "listDeposits", "private", [bithumbPrivateArgs.query("ListDeposits", false)]),
    tool("deposits", "listDepositsKrw", "private", [bithumbPrivateArgs.query("ListDepositsKrw", false)]),
    tool("deposits", "createDepositsKrw", "private", [bithumbPrivateArgs.body("CreateDepositsKrw", true)]),
    tool("deposits", "getDeposit", "private", [bithumbPrivateArgs.query("GetDeposit", true)]),
    tool("deposits", "createDepositAddress", "private", [bithumbPrivateArgs.body("CreateDepositAddress", true)]),
    tool("deposits", "listDepositsCoinAddresses", "private"),
    tool("deposits", "getDepositsCoinAddress", "private", [bithumbPrivateArgs.query("GetDepositsCoinAddress", true)]),
  ];

  return bithumbToolsCache;
}

function getCoinoneTools() {
  if (coinoneToolsCache) return coinoneToolsCache;

  coinoneToolsCache = [
    tool("market", "getRangeUnit", "public", [stringArg("quoteCurrency", "마켓 기준 통화 (예: KRW)", false), stringArg("targetCurrency", "조회하려는 종목의 심볼 (예: BTC)", false)]),
    tool("market", "listMarkets", "public", [stringArg("quoteCurrency", "마켓 기준 통화", false)]),
    tool("market", "getMarket", "public", [stringArg("quoteCurrency", "마켓 기준 통화", false), stringArg("targetCurrency", "조회하려는 종목의 심볼", false)]),
    tool("market", "getOrderbook", "public", [stringArg("quoteCurrency", "마켓 기준 통화", false), stringArg("targetCurrency", "조회하려는 종목의 심볼", false), coinonePublicArgs.query("GetOrderbook", false)]),
    tool("market", "listTrades", "public", [stringArg("quoteCurrency", "마켓 기준 통화", false), stringArg("targetCurrency", "조회하려는 종목의 심볼", false), coinonePublicArgs.query("ListTrades", false)]),
    tool("market", "listTickers", "public", [stringArg("quoteCurrency", "조회하려는 마켓의 기준 통화", false), coinonePublicArgs.query("ListTickers", false)]),
    tool("market", "getTicker", "public", [stringArg("quoteCurrency", "마켓의 기준 통화", false), stringArg("targetCurrency", "조회하려는 종목의 심볼", false), coinonePublicArgs.query("GetTicker", false)]),
    tool("market", "listTickerUtc", "public", [stringArg("quoteCurrency", "조회하려는 마켓의 기준 통화", false), coinonePublicArgs.query("ListTickerUtc", false)]),
    tool("market", "getTickerUtc", "public", [stringArg("quoteCurrency", "마켓의 기준 통화", false), stringArg("targetCurrency", "조회하려는 종목의 심볼", false), coinonePublicArgs.query("GetTickerUtc", false)]),
    tool("market", "listCurrencies", "public"),
    tool("market", "getCurrency", "public", [stringArg("currency", "조회하려는 종목의 심볼", false)]),
    tool("market", "getChart", "public", [stringArg("quoteCurrency", "마켓 기준 통화", false), stringArg("targetCurrency", "조회하려는 종목의 심볼", false), coinonePublicArgs.query("GetChart", true)]),
    tool("account", "listBalance", "private", [coinonePrivateArgs.body("ListBalance", false)]),
    tool("account", "listBalanceByCurrencies", "private", [coinonePrivateArgs.body("ListBalanceByCurrencies", true)]),
    tool("account", "listTradeFees", "private", [coinonePrivateArgs.body("ListTradeFees", false)]),
    tool("account", "getTradeFeeByPair", "private", [stringArg("quoteCurrency", "마켓 기준 통화", false), stringArg("targetCurrency", "조회하려는 종목의 심볼", false), coinonePrivateArgs.body("GetTradeFeeByPair", false)]),
    tool("orders", "listActiveOrders", "private", [coinonePrivateArgs.body("ListActiveOrders", false)]),
    tool("orders", "getOrderDetail", "private", [coinonePrivateArgs.body("GetOrderDetail", true)]),
    tool("orders", "listCompletedOrdersAll", "private", [coinonePrivateArgs.body("ListCompletedOrdersAll", true)]),
    tool("orders", "listCompletedOrders", "private", [coinonePrivateArgs.body("ListCompletedOrders", true)]),
    tool("orders", "createOrder", "private", [coinonePrivateArgs.body("CreateOrder", true)]),
    tool("orders", "cancelOrders", "private", [coinonePrivateArgs.body("CancelOrders", true)]),
    tool("orders", "cancelOrder", "private", [coinonePrivateArgs.body("CancelOrder", true)]),
    tool("transactions", "listKrwTransactionHistory", "private", [coinonePrivateArgs.body("ListKrwTransactionHistory", false)]),
    tool("transactions", "listCoinTransactionHistory", "private", [coinonePrivateArgs.body("ListCoinTransactionHistory", false)]),
    tool("transactions", "getCoinTransactionHistoryDetail", "private", [coinonePrivateArgs.body("GetCoinTransactionHistoryDetail", true)]),
    tool("transactions", "getCoinWithdrawalLimit", "private", [coinonePrivateArgs.body("GetCoinWithdrawalLimit", true)]),
    tool("transactions", "listCoinWithdrawalAddressBook", "private", [coinonePrivateArgs.body("ListCoinWithdrawalAddressBook", false)]),
    tool("transactions", "createCoinWithdrawal", "private", [coinonePrivateArgs.body("CreateCoinWithdrawal", true)]),
    tool("rewards", "listOrderRewardPrograms", "private", [coinonePrivateArgs.body("ListOrderRewardPrograms", false)]),
    tool("rewards", "listOrderRewardHistory", "private", [coinonePrivateArgs.body("ListOrderRewardHistory", false)]),
  ];

  return coinoneToolsCache;
}

function getGopaxTools() {
  if (gopaxToolsCache) return gopaxToolsCache;

  gopaxToolsCache = [
    tool("market", "listAssets", "public"),
    tool("market", "listTradingPairs", "public"),
    tool("market", "getTradingPairPriceTickSize", "public", [stringArg("tradingPair", "거래쌍 (예: BTC-KRW)", true)]),
    tool("market", "getTradingPairTicker", "public", [stringArg("tradingPair", "거래쌍 (예: BTC-KRW)", true)]),
    tool("market", "getTradingPairBook", "public", [stringArg("tradingPair", "거래쌍 (예: BTC-KRW)", true), gopaxPublicArgs.query("GetTradingPairBook", false)]),
    tool("market", "listTradingPairTrades", "public", [stringArg("tradingPair", "거래쌍 (예: BTC-KRW)", true), gopaxPublicArgs.query("ListTradingPairTrades", false)]),
    tool("market", "getTradingPairStats", "public", [stringArg("tradingPair", "거래쌍 (예: BTC-KRW)", true)]),
    tool("market", "listTradingPairsStats", "public"),
    tool("market", "getTradingPairCandles", "public", [stringArg("tradingPair", "거래쌍 (예: BTC-KRW)", true), gopaxPublicArgs.query("GetTradingPairCandles", true)]),
    tool("market", "listTradingPairsCautions", "public", [gopaxPublicArgs.query("ListTradingPairsCautions", false)]),
    tool("market", "listTickers", "public"),
    tool("market", "getTime", "public"),
    tool("market", "listNotices", "public", [gopaxPublicArgs.query("ListNotices", false)]),
    tool("account", "listBalances", "private"),
    tool("account", "getBalance", "private", [stringArg("assetName", "자산 이름 (예: BTC)", true)]),
    tool("orders", "listOrders", "private", [gopaxPrivateArgs.query("ListOrders", false)]),
    tool("orders", "createOrder", "private", [gopaxPrivateArgs.body("CreateOrder", true)]),
    tool("orders", "getOrder", "private", [stringArg("orderId", "주문 ID", true)]),
    tool("orders", "cancelOrder", "private", [stringArg("orderId", "주문 ID", true)]),
    tool("orders", "getOrderByClientOrderId", "private", [stringArg("clientOrderID", "클라이언트 오더 ID", true)]),
    tool("orders", "cancelOrderByClientOrderId", "private", [stringArg("clientOrderID", "클라이언트 오더 ID", true)]),
    tool("trades", "listTrades", "private", [gopaxPrivateArgs.query("ListTrades", false)]),
    tool("wallet", "listDepositWithdrawalStatus", "private", [gopaxPrivateArgs.query("ListDepositWithdrawalStatus", false)]),
    tool("wallet", "listCryptoDepositAddresses", "private"),
    tool("wallet", "listCryptoWithdrawalAddresses", "private"),
    tool("wallet", "createWithdrawal", "private", [gopaxPrivateArgs.body("CreateWithdrawal", true)]),
  ];

  return gopaxToolsCache;
}

function getKorbitTools() {
  if (korbitToolsCache) return korbitToolsCache;

  korbitToolsCache = [
    tool("market", "listTickers", "public", [korbitPublicArgs.query("ListTickers", false)]),
    tool("market", "getOrderbook", "public", [korbitPublicArgs.query("GetOrderbook", true)]),
    tool("market", "listTrades", "public", [korbitPublicArgs.query("ListTrades", true)]),
    tool("market", "getCandles", "public", [korbitPublicArgs.query("GetCandles", true)]),
    tool("market", "listCurrencyPairs", "public"),
    tool("market", "getTickSizePolicy", "public", [korbitPublicArgs.query("GetTickSizePolicy", true)]),
    tool("service", "listCurrencies", "public"),
    tool("service", "getTime", "public"),
    tool("service", "getTradingFeePolicy", "private", [korbitPrivateArgs.query("GetTradingFeePolicy", false)]),
    tool("service", "getCurrentKeyInfo", "private", [korbitPrivateArgs.query("GetCurrentKeyInfo", false)]),
    tool("orders", "getOrder", "private", [korbitPrivateArgs.query("GetOrder", true)]),
    tool("orders", "createOrder", "private"),
    tool("orders", "cancelOrder", "private", [korbitPrivateArgs.query("CancelOrder", true)]),
    tool("orders", "listOpenOrders", "private", [korbitPrivateArgs.query("ListOpenOrders", true)]),
    tool("orders", "listAllOrders", "private", [korbitPrivateArgs.query("ListAllOrders", true)]),
    tool("orders", "listMyTrades", "private", [korbitPrivateArgs.query("ListMyTrades", true)]),
    tool("assets", "listBalance", "private", [korbitPrivateArgs.query("ListBalance", false)]),
    tool("cryptoDeposits", "listCoinDepositAddresses", "private", [korbitPrivateArgs.query("ListCoinDepositAddresses", false)]),
    tool("cryptoDeposits", "getCoinDepositAddress", "private", [korbitPrivateArgs.query("GetCoinDepositAddress", true)]),
    tool("cryptoDeposits", "createCoinDepositAddress", "private"),
    tool("cryptoDeposits", "listCoinRecentDeposits", "private", [korbitPrivateArgs.query("ListCoinRecentDeposits", true)]),
    tool("cryptoDeposits", "getCoinDeposit", "private", [korbitPrivateArgs.query("GetCoinDeposit", true)]),
    tool("cryptoWithdrawals", "listCoinWithdrawableAddresses", "private", [korbitPrivateArgs.query("ListCoinWithdrawableAddresses", false)]),
    tool("cryptoWithdrawals", "getCoinWithdrawableAmount", "private", [korbitPrivateArgs.query("GetCoinWithdrawableAmount", false)]),
    tool("cryptoWithdrawals", "createCoinWithdrawal", "private"),
    tool("cryptoWithdrawals", "cancelCoinWithdrawal", "private", [korbitPrivateArgs.query("CancelCoinWithdrawal", true)]),
    tool("cryptoWithdrawals", "getCoinWithdrawal", "private", [korbitPrivateArgs.query("GetCoinWithdrawal", true)]),
    tool("cryptoWithdrawals", "listCoinRecentWithdrawals", "private", [korbitPrivateArgs.query("ListCoinRecentWithdrawals", true)]),
    tool("krw", "requestKrwDeposit", "private"),
    tool("krw", "requestKrwWithdrawal", "private"),
    tool("krw", "listKrwRecentDeposits", "private", [korbitPrivateArgs.query("ListKrwRecentDeposits", true)]),
    tool("krw", "listKrwRecentWithdrawals", "private", [korbitPrivateArgs.query("ListKrwRecentWithdrawals", true)]),
  ];

  return korbitToolsCache;
}

function getUpbitTools() {
  if (upbitToolsCache) return upbitToolsCache;

  upbitToolsCache = [
    tool("tradingPairs", "listTradingPairs", "public", [upbitQuotationArgs.query("ListTradingPairs", false)]),
    tool("candles", "getSecondCandles", "public", [upbitQuotationArgs.query("GetSecondCandles", true)]),
    tool("candles", "getMinuteCandles", "public", [numberArg("unit", "unit", true), upbitQuotationArgs.query("GetMinuteCandles", true)]),
    tool("candles", "getDayCandles", "public", [upbitQuotationArgs.query("GetDayCandles", true)]),
    tool("candles", "getWeekCandles", "public", [upbitQuotationArgs.query("GetWeekCandles", true)]),
    tool("candles", "getMonthCandles", "public", [upbitQuotationArgs.query("GetMonthCandles", true)]),
    tool("candles", "getYearCandles", "public", [upbitQuotationArgs.query("GetYearCandles", true)]),
    tool("trades", "listTradesTicks", "public", [upbitQuotationArgs.query("ListTradesTicks", true)]),
    tool("tickers", "listTickers", "public", [upbitQuotationArgs.query("ListTickers", true)]),
    tool("tickers", "listQuoteTickers", "public", [upbitQuotationArgs.query("ListQuoteTickers", true)]),
    tool("orderbook", "listOrderbooks", "public", [upbitQuotationArgs.query("ListOrderbooks", true)]),
    tool("orderbook", "listOrderbookInstruments", "public", [upbitQuotationArgs.query("ListOrderbookInstruments", true)]),
    tool("assets", "listBalance", "private"),
    tool("orders", "getOrderChance", "private", [upbitExchangeArgs.query("GetOrderChance", true)]),
    tool("orders", "createOrder", "private", [upbitExchangeArgs.body("CreateOrder", true)]),
    tool("orders", "createTestOrder", "private", [upbitExchangeArgs.body("CreateTestOrder", true)]),
    tool("orders", "getOrder", "private", [upbitExchangeArgs.query("GetOrder", false)]),
    tool("orders", "cancelOrder", "private", [upbitExchangeArgs.query("CancelOrder", false)]),
    tool("orders", "listOrdersByIds", "private", [upbitExchangeArgs.query("ListOrdersByIds", false)]),
    tool("orders", "cancelOrdersByIds", "private", [upbitExchangeArgs.query("CancelOrdersByIds", false)]),
    tool("orders", "listOpenOrders", "private", [upbitExchangeArgs.query("ListOpenOrders", false)]),
    tool("orders", "cancelOpenOrders", "private", [upbitExchangeArgs.query("CancelOpenOrders", false)]),
    tool("orders", "listClosedOrders", "private", [upbitExchangeArgs.query("ListClosedOrders", false)]),
    tool("orders", "cancelAndCreateOrder", "private", [upbitExchangeArgs.body("CancelAndCreateOrder", true)]),
    tool("withdrawals", "getWithdrawChance", "private", [upbitExchangeArgs.query("GetWithdrawChance", true)]),
    tool("withdrawals", "listWithdrawalAddresses", "private"),
    tool("withdrawals", "createWithdrawal", "private", [upbitExchangeArgs.body("CreateWithdrawal", true)]),
    tool("withdrawals", "cancelWithdrawal", "private", [upbitExchangeArgs.query("CancelWithdrawal", true)]),
    tool("withdrawals", "createWithdrawKrw", "private", [upbitExchangeArgs.body("CreateWithdrawKrw", true)]),
    tool("withdrawals", "getWithdrawal", "private", [upbitExchangeArgs.query("GetWithdrawal", false)]),
    tool("withdrawals", "listWithdrawals", "private", [upbitExchangeArgs.query("ListWithdrawals", false)]),
    tool("deposits", "getDepositChance", "private", [upbitExchangeArgs.query("GetDepositChance", true)]),
    tool("deposits", "createDepositAddress", "private", [upbitExchangeArgs.body("CreateDepositAddress", true)]),
    tool("deposits", "getDepositAddress", "private", [upbitExchangeArgs.query("GetDepositAddress", true)]),
    tool("deposits", "listDepositAddresses", "private"),
    tool("deposits", "createDepositKrw", "private", [upbitExchangeArgs.body("CreateDepositKrw", true)]),
    tool("deposits", "getDeposit", "private", [upbitExchangeArgs.query("GetDeposit", false)]),
    tool("deposits", "listDeposits", "private", [upbitExchangeArgs.query("ListDeposits", false)]),
    tool("travelRule", "listTravelRuleVasps", "private"),
    tool("travelRule", "verifyTravelRuleByUuid", "private", [upbitExchangeArgs.body("VerifyTravelRuleByUuid", true)]),
    tool("travelRule", "verifyTravelRuleByTxid", "private", [upbitExchangeArgs.body("VerifyTravelRuleByTxid", true)]),
    tool("service", "getServiceStatus", "private"),
    tool("service", "listApiKeys", "private"),
  ];

  return upbitToolsCache;
}

// ─── EXCHANGE_RUNTIME_BASE ───

const EXCHANGE_RUNTIME_BASE: Record<ExchangeKey, Omit<ExchangeRuntimeDefinition, "tools">> = {
  bithumb: {
    key: "bithumb",
    displayName: "빗썸",
    createClient: () => {
      const credentialState = resolveCredentialState(["EXHUB_BITHUMB_API_KEY", "EXHUB_BITHUMB_SECRET_KEY"]);
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
    displayName: "코인원",
    createClient: () => {
      const credentialState = resolveCredentialState(["EXHUB_COINONE_ACCESS_TOKEN", "EXHUB_COINONE_SECRET_KEY"]);
      const options = resolveOptions("EXHUB_COINONE");
      return createCoinoneClient({
        ...options,
        ...(credentialState.hasCredentials
          ? {
              credentials: {
                accessToken: getRequiredEnvValue(credentialState.values, "EXHUB_COINONE_ACCESS_TOKEN"),
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
      const credentialState = resolveCredentialState(["EXHUB_GOPAX_API_KEY", "EXHUB_GOPAX_SECRET_KEY"]);
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
    displayName: "코빗",
    createClient: () => {
      const credentialState = resolveCredentialState(["EXHUB_KORBIT_API_KEY", "EXHUB_KORBIT_SECRET_KEY"]);
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
  upbit: {
    key: "upbit",
    displayName: "업비트",
    createClient: () => {
      const credentialState = resolveCredentialState(["EXHUB_UPBIT_ACCESS_KEY", "EXHUB_UPBIT_SECRET_KEY"]);
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
};

// ─── exports ───

export { EXCHANGE_RUNTIME_BASE };

export async function loadExchangeZod(exchange: ExchangeKey): Promise<void> {
  switch (exchange) {
    case "bithumb":
      await ensureBithumbZodLoaded();
      break;
    case "coinone":
      await ensureCoinoneZodLoaded();
      break;
    case "gopax":
      await ensureGopaxZodLoaded();
      break;
    case "korbit":
      await ensureKorbitZodLoaded();
      break;
    case "upbit":
      await ensureUpbitZodLoaded();
      break;
  }
}

export function getExchangeTools(exchange: ExchangeKey): readonly ToolMetadata[] {
  switch (exchange) {
    case "bithumb":
      return getBithumbTools();
    case "coinone":
      return getCoinoneTools();
    case "gopax":
      return getGopaxTools();
    case "korbit":
      return getKorbitTools();
    case "upbit":
      return getUpbitTools();
  }
}

export function getExchangeSpecOperationIds(exchange: ExchangeKey): SpecOperationIdMap {
  switch (exchange) {
    case "bithumb":
      return BITHUMB_SPEC_OPERATION_IDS;
    case "coinone":
      return COINONE_SPEC_OPERATION_IDS;
    case "gopax":
      return GOPAX_SPEC_OPERATION_IDS;
    case "korbit":
      return KORBIT_SPEC_OPERATION_IDS;
    case "upbit":
      return UPBIT_SPEC_OPERATION_IDS;
  }
}

// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import type { ExHubWsClientOptions } from "@exhub/core";

import type { UpbitCredentials } from "./types";

export type UpbitWsClientOptions = ExHubWsClientOptions<UpbitCredentials>;

export interface TickerSubscribeOptions {
  type: "ticker";
  codes: string[];
  is_only_snapshot?: boolean;
  is_only_realtime?: boolean;
}

export interface TickerData {
  type?: string;
  code?: string;
  opening_price?: number;
  high_price?: number;
  low_price?: number;
  trade_price?: number;
  prev_closing_price?: number;
  change?: "RISE" | "EVEN" | "FALL";
  change_price?: number;
  signed_change_price?: number;
  change_rate?: number;
  signed_change_rate?: number;
  trade_volume?: number;
  acc_trade_volume?: number;
  acc_trade_volume_24h?: number;
  acc_trade_price?: number;
  acc_trade_price_24h?: number;
  trade_date?: string;
  trade_time?: string;
  trade_timestamp?: number;
  ask_bid?: "ASK" | "BID";
  acc_ask_volume?: number;
  acc_bid_volume?: number;
  highest_52_week_price?: number;
  highest_52_week_date?: string;
  lowest_52_week_price?: number;
  lowest_52_week_date?: string;
  market_state?: "PREVIEW" | "ACTIVE" | "DELISTED";
  is_trading_suspended?: boolean;
  delisting_date?: string;
  market_warning?: "NONE" | "CAUTION";
  timestamp?: number;
  stream_type?: "SNAPSHOT" | "REALTIME";
}

export interface TradeSubscribeOptions {
  type: "trade";
  codes: string[];
  is_only_snapshot?: boolean;
  is_only_realtime?: boolean;
}

export interface TradeData {
  type?: string;
  code?: string;
  trade_price?: number;
  trade_volume?: number;
  ask_bid?: "ASK" | "BID";
  prev_closing_price?: number;
  change?: "RISE" | "EVEN" | "FALL";
  change_price?: number;
  trade_date?: string;
  trade_time?: string;
  trade_timestamp?: number;
  timestamp?: number;
  sequential_id?: number;
  best_ask_price?: number;
  best_ask_size?: number;
  best_bid_price?: number;
  best_bid_size?: number;
  stream_type?: "SNAPSHOT" | "REALTIME";
}

export interface OrderbookSubscribeOptions {
  type: "orderbook";
  codes: string[];
  level?: number;
  is_only_snapshot?: boolean;
  is_only_realtime?: boolean;
}

export interface OrderbookData {
  type?: string;
  code?: string;
  timestamp?: number;
  total_ask_size?: number;
  total_bid_size?: number;
  orderbook_units?: {
    ask_price?: number;
    bid_price?: number;
    ask_size?: number;
    bid_size?: number;
  }[];
  level?: number;
  stream_type?: "SNAPSHOT" | "REALTIME";
}

export interface CandleSubscribeOptions {
  type:
    | "candle.1s"
    | "candle.1m"
    | "candle.3m"
    | "candle.5m"
    | "candle.10m"
    | "candle.15m"
    | "candle.30m"
    | "candle.60m"
    | "candle.240m";
  codes: string[];
  is_only_snapshot?: boolean;
  is_only_realtime?: boolean;
}

export interface CandleData {
  type?: string;
  code?: string;
  candle_date_time_utc?: string;
  candle_date_time_kst?: string;
  opening_price?: number;
  high_price?: number;
  low_price?: number;
  trade_price?: number;
  candle_acc_trade_volume?: number;
  candle_acc_trade_price?: number;
  timestamp?: number;
  stream_type?: "SNAPSHOT" | "REALTIME";
}

export interface MyOrderSubscribeOptions {
  type: "myOrder";
  codes?: string[];
}

export interface MyOrderData {
  type?: string;
  code?: string;
  uuid?: string;
  ask_bid?: "BID" | "ASK";
  order_type?: "limit" | "price" | "market" | "best";
  state?: "wait" | "watch" | "trade" | "done" | "cancel" | "prevented";
  trade_uuid?: string;
  price?: number;
  avg_price?: number;
  volume?: number;
  remaining_volume?: number;
  executed_volume?: number;
  trades_count?: number;
  reserved_fee?: number;
  remaining_fee?: number;
  paid_fee?: number;
  locked?: number;
  executed_funds?: number;
  time_in_force?: "ioc" | "fok" | "post_only";
  trade_fee?: number;
  is_maker?: boolean;
  identifier?: string;
  trade_timestamp?: number;
  order_timestamp?: number;
  smp_type?: "reduce" | "cancel_maker" | "cancel_taker";
  prevented_volume?: number;
  prevented_locked?: number;
  timestamp?: number;
  stream_type?: "REALTIME" | "SNAPSHOT";
}

export interface MyAssetSubscribeOptions {
  type: "myAsset";
}

export interface MyAssetData {
  type?: string;
  asset_uuid?: string;
  assets?: {
    currency?: string;
    balance?: number;
    locked?: number;
  }[];
  asset_timestamp?: number;
  timestamp?: number;
  stream_type?: "REALTIME";
}

export interface ListSubscriptionsSubscribeOptions {
  method: "LIST_SUBSCRIPTIONS";
}

export interface ListSubscriptionsData {
  method?: "LIST_SUBSCRIPTIONS";
  result?: {
    type?: string;
    codes?: string[];
    level?: number;
  }[];
  ticket?: string;
}

export interface UpbitWsClient {
  subscribeTicker: (
    options: TickerSubscribeOptions,
    onMessage: (data: TickerData) => void,
  ) => () => void;
  subscribeTrade: (
    options: TradeSubscribeOptions,
    onMessage: (data: TradeData) => void,
  ) => () => void;
  subscribeOrderbook: (
    options: OrderbookSubscribeOptions,
    onMessage: (data: OrderbookData) => void,
  ) => () => void;
  subscribeCandle: (
    options: CandleSubscribeOptions,
    onMessage: (data: CandleData) => void,
  ) => () => void;
  subscribeMyOrder: (
    options: MyOrderSubscribeOptions,
    onMessage: (data: MyOrderData) => void,
  ) => () => void;
  subscribeMyAsset: (
    options: MyAssetSubscribeOptions,
    onMessage: (data: MyAssetData) => void,
  ) => () => void;
  subscribeListSubscriptions: (
    options: ListSubscriptionsSubscribeOptions,
    onMessage: (data: ListSubscriptionsData) => void,
  ) => () => void;
  onError: (handler: (error: Error) => void) => void;
  close: () => void;
}

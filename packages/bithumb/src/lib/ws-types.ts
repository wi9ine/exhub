// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import type { ExHubWsClientOptions } from "@exhub/core";

import type { BithumbCredentials } from "./types";

export type BithumbWsClientOptions = ExHubWsClientOptions<BithumbCredentials>;

export interface TickerSubscribeOptions {
  type: "ticker";
  codes: string[];
  isOnlySnapshot?: boolean;
  isOnlyRealtime?: boolean;
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
  market_state?: string;
  is_trading_suspended?: boolean;
  delisting_date?: string;
  market_warning?: string;
  timestamp?: number;
  stream_type?: "SNAPSHOT" | "REALTIME";
}

export interface TradeSubscribeOptions {
  type: "trade";
  codes: string[];
  isOnlySnapshot?: boolean;
  isOnlyRealtime?: boolean;
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
  stream_type?: "SNAPSHOT" | "REALTIME";
}

export interface OrderbookSubscribeOptions {
  type: "orderbook";
  codes: string[];
  level?: number;
  isOnlySnapshot?: boolean;
  isOnlyRealtime?: boolean;
}

export interface OrderbookData {
  type?: string;
  code?: string;
  total_ask_size?: number;
  total_bid_size?: number;
  orderbook_units?: {
    ask_price?: number;
    bid_price?: number;
    ask_size?: number;
    bid_size?: number;
  }[];
  timestamp?: number;
  level?: number;
}

export interface MyOrderSubscribeOptions {
  type: "myOrder";
  codes?: string[];
}

export interface MyOrderData {
  type?: string;
  code?: string;
  client_order_id?: string;
  uuid?: string;
  ask_bid?: "ASK" | "BID";
  order_type?: "limit" | "price" | "market";
  state?: "wait" | "trade" | "done" | "cancel";
  trade_uuid?: string;
  price?: number;
  volume?: number;
  remaining_volume?: number;
  executed_volume?: number;
  trades_count?: number;
  reserved_fee?: number;
  remaining_fee?: number;
  paid_fee?: number;
  executed_funds?: number;
  trade_timestamp?: number;
  order_timestamp?: number;
  timestamp?: number;
  stream_type?: "REALTIME";
}

export interface MyAssetSubscribeOptions {
  type: "myAsset";
}

export interface MyAssetData {
  type?: string;
  assets?: {
    currency?: string;
    balance?: string;
    locked?: string;
  }[];
  asset_timestamp?: number;
  timestamp?: number;
  stream_type?: "REALTIME";
}

export interface BithumbWsClient {
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
  subscribeMyOrder: (
    options: MyOrderSubscribeOptions,
    onMessage: (data: MyOrderData) => void,
  ) => () => void;
  subscribeMyAsset: (
    options: MyAssetSubscribeOptions,
    onMessage: (data: MyAssetData) => void,
  ) => () => void;
  onError: (handler: (error: Error) => void) => void;
  close: () => void;
}

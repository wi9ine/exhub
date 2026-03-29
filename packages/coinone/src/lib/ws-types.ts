// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import type { ExHubWsClientOptions } from "@exhub/core";

import type { CoinoneCredentials } from "./types";

export type CoinoneWsClientOptions = ExHubWsClientOptions<CoinoneCredentials>;

export type PublicOrderbookSubscribeOptions = {
  request_type: "SUBSCRIBE" | "UNSUBSCRIBE" | "PING";
  channel?: string;
  topic?: Record<string, unknown>;
  format?: "DEFAULT" | "SHORT";
} & {
  channel: "ORDERBOOK";
  topic: {
    quote_currency: string;
    target_currency: string;
  };
};

export interface PublicOrderbookData {
  response_type: "DATA";
  channel: "ORDERBOOK";
  data: {
    quote_currency: string;
    target_currency: string;
    timestamp: number;
    id: string;
    asks: {
      price: string;
      qty: string;
    }[];
    bids: {
      price: string;
      qty: string;
    }[];
  };
}

export type PublicTickerSubscribeOptions = {
  request_type: "SUBSCRIBE" | "UNSUBSCRIBE" | "PING";
  channel?: string;
  topic?: Record<string, unknown>;
  format?: "DEFAULT" | "SHORT";
} & {
  channel: "TICKER";
  topic: {
    quote_currency: string;
    target_currency: string;
  };
};

export interface PublicTickerData {
  response_type: "DATA";
  channel: "TICKER";
  data: {
    quote_currency?: string;
    target_currency?: string;
    timestamp?: number;
    quote_volume?: string;
    target_volume?: string;
    high?: string;
    low?: string;
    first?: string;
    last?: string;
    change?: string;
    yesterday_high?: string;
    yesterday_low?: string;
    yesterday_first?: string;
    yesterday_last?: string;
    yesterday_quote_volume?: string;
    yesterday_target_volume?: string;
  };
}

export type PublicTradeSubscribeOptions = {
  request_type: "SUBSCRIBE" | "UNSUBSCRIBE" | "PING";
  channel?: string;
  topic?: Record<string, unknown>;
  format?: "DEFAULT" | "SHORT";
} & {
  channel: "TRADE";
  topic: {
    quote_currency: string;
    target_currency: string;
  };
};

export interface PublicTradeData {
  response_type: "DATA";
  channel: "TRADE";
  data: {
    quote_currency?: string;
    target_currency?: string;
    id?: string;
    timestamp?: number;
    price?: string;
    qty?: string;
    is_seller_maker?: boolean;
  };
}

export type PublicChartSubscribeOptions = {
  request_type: "SUBSCRIBE" | "UNSUBSCRIBE" | "PING";
  channel?: string;
  topic?: Record<string, unknown>;
  format?: "DEFAULT" | "SHORT";
} & {
  channel: "CHART";
  topic: {
    quote_currency: string;
    target_currency: string;
    interval: string;
  };
};

export interface PublicChartData {
  response_type: "DATA";
  channel: "CHART";
  data: {
    quote_currency?: string;
    target_currency?: string;
    interval?: string;
    timestamp?: number;
    id?: string;
    candle_timestamp?: number;
    high?: string;
    low?: string;
    first?: string;
    last?: string;
    quote_volume?: string;
    target_volume?: string;
  };
}

export type PrivateMyOrderSubscribeOptions = {
  request_type: "SUBSCRIBE" | "UNSUBSCRIBE" | "PING";
  channel?: string;
  topic?: {
    quote_currency: string;
    target_currency: string;
  }[];
  format?: "DEFAULT" | "SHORT";
} & {
  channel: "MYORDER";
};

export interface PrivateMyOrderData {
  response_type: "DATA";
  channel: "MYORDER";
  data: {
    quote_currency?: string;
    target_currency?: string;
    order_id?: string;
    type?: "LIMIT" | "MARKET";
    status?:
      | "wait"
      | "watch"
      | "not_triggered"
      | "trade"
      | "trade_done"
      | "cancel"
      | "cancel_post_only";
    side?: "BID" | "ASK";
    order_price?: unknown;
    order_qty?: unknown;
    order_amount?: unknown;
    trade_id?: unknown;
    is_maker?: unknown;
    executed_price?: unknown;
    executed_qty?: unknown;
    executed_fee?: unknown;
    remain_qty?: unknown;
    remain_amount?: unknown;
    user_order_id?: unknown;
    prevented_qty?: unknown;
    executed_timestamp?: unknown;
    order_timestamp?: unknown;
    timestamp?: number;
  };
}

export type PrivateMyAssetSubscribeOptions = {
  request_type: "SUBSCRIBE" | "UNSUBSCRIBE" | "PING";
  channel?: string;
  topic?: {
    quote_currency: string;
    target_currency: string;
  }[];
  format?: "DEFAULT" | "SHORT";
} & {
  channel: "MYASSET";
};

export interface PrivateMyAssetData {
  response_type: "DATA";
  channel: "MYASSET";
  data: {
    order_id?: unknown;
    user_order_id?: unknown;
    trade_id?: unknown;
    assets: {
      currency: string;
      available: string;
      limit: string;
      type?:
        | "deposit"
        | "withdrawal"
        | "cancel_withdrawal"
        | "order"
        | "trade"
        | "cancel"
        | "cancel_post_only";
      timestamp?: number;
    }[];
    type:
      | "deposit"
      | "withdrawal"
      | "cancel_withdrawal"
      | "order"
      | "trade"
      | "cancel"
      | "cancel_post_only";
    timestamp: number;
  };
}

export interface CoinoneWsClient {
  subscribePublicOrderbook: (
    options: PublicOrderbookSubscribeOptions,
    onMessage: (data: PublicOrderbookData) => void,
  ) => () => void;
  subscribePublicTicker: (
    options: PublicTickerSubscribeOptions,
    onMessage: (data: PublicTickerData) => void,
  ) => () => void;
  subscribePublicTrade: (
    options: PublicTradeSubscribeOptions,
    onMessage: (data: PublicTradeData) => void,
  ) => () => void;
  subscribePublicChart: (
    options: PublicChartSubscribeOptions,
    onMessage: (data: PublicChartData) => void,
  ) => () => void;
  subscribePrivateMyOrder: (
    options: PrivateMyOrderSubscribeOptions,
    onMessage: (data: PrivateMyOrderData) => void,
  ) => () => void;
  subscribePrivateMyAsset: (
    options: PrivateMyAssetSubscribeOptions,
    onMessage: (data: PrivateMyAssetData) => void,
  ) => () => void;
  onError: (handler: (error: Error) => void) => void;
  close: () => void;
}

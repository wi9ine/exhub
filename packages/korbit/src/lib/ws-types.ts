// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import type { ExHubWsClientOptions } from "@exhub/core";

import type { KorbitCredentials } from "./types";

export type KorbitWsClientOptions = ExHubWsClientOptions<KorbitCredentials>;

export interface TickerSubscribeOptions {
  requestId?: number;
  method: string;
  type: string;
  symbols: string[];
}

export interface TickerData {
  type: string;
  timestamp: number;
  symbol: string;
  snapshot: boolean;
  data: {
    open: string;
    high: string;
    low: string;
    close: string;
    prevClose: string;
    priceChange: string;
    priceChangePercent: string;
    volume: string;
    quoteVolume: string;
    bestAskPrice: string;
    bestBidPrice: string;
    lastTradedAt: number;
  };
}

export interface OrderbookSubscribeOptions {
  requestId?: number;
  method: string;
  type: string;
  symbols: string[];
  level?: string;
}

export interface OrderbookData {
  type: string;
  timestamp: number;
  symbol: string;
  snapshot: boolean;
  data: {
    timestamp: number;
    asks: {
      price: string;
      qty: string;
      amt?: string;
    }[];
    bids: {
      price: string;
      qty: string;
      amt?: string;
    }[];
  };
}

export interface TradeSubscribeOptions {
  requestId?: number;
  method: string;
  type: string;
  symbols: string[];
}

export interface TradeData {
  symbol: string;
  timestamp: number;
  type: string;
  snapshot: boolean;
  data: {
    timestamp: number;
    price: string;
    qty: string;
    isBuyerTaker: boolean;
    tradeId: number;
  }[];
}

export interface MyOrderSubscribeOptions {
  requestId?: number;
  method: string;
  type: string;
  symbols: string[];
}

export interface MyOrderData {
  symbol: string;
  timestamp: number;
  channelType: string;
  order: {
    orders: {
      orderId: number;
      status:
        | "pending"
        | "unfilled"
        | "filled"
        | "canceled"
        | "partiallyFilled"
        | "partiallyFilledCanceled"
        | "expired";
      side: "buy" | "sell";
      orderType: "limit" | "market" | "best";
      timeInForce: "gtc" | "ioc" | "fok" | "po";
      price: string;
      qty: string;
      filledQty: string;
      amt: string;
      filledAmt: string;
      avgPrice: string;
      createdAt: number;
      lastFilledAt: number;
      clientOrderId: string;
    }[];
  };
}

export interface MyTradeSubscribeOptions {
  requestId?: number;
  method: string;
  type: string;
  symbols: string[];
}

export interface MyTradeData {
  symbol: string;
  timestamp: number;
  channelType: string;
  trade: {
    trades: {
      tradeId: number;
      orderId: number;
      side: "buy" | "sell";
      price: string;
      qty: string;
      fee: string;
      feeCurrency: string;
      filledAt: number;
      isTaker: boolean;
    }[];
  };
}

export interface MyAssetSubscribeOptions {
  requestId?: number;
  method: string;
  type: string;
}

export interface MyAssetData {
  timestamp: number;
  channelType: string;
  asset: {
    assets: {
      currency: string;
      balance: string;
      available: string;
      tradeInUse: string;
      withdrawalInUse: string;
      avgPrice: string;
      updatedAt: number;
    }[];
  };
}

export interface KorbitWsClient {
  subscribeTicker: (
    options: TickerSubscribeOptions,
    onMessage: (data: TickerData) => void,
  ) => () => void;
  subscribeOrderbook: (
    options: OrderbookSubscribeOptions,
    onMessage: (data: OrderbookData) => void,
  ) => () => void;
  subscribeTrade: (
    options: TradeSubscribeOptions,
    onMessage: (data: TradeData) => void,
  ) => () => void;
  subscribeMyOrder: (
    options: MyOrderSubscribeOptions,
    onMessage: (data: MyOrderData) => void,
  ) => () => void;
  subscribeMyTrade: (
    options: MyTradeSubscribeOptions,
    onMessage: (data: MyTradeData) => void,
  ) => () => void;
  subscribeMyAsset: (
    options: MyAssetSubscribeOptions,
    onMessage: (data: MyAssetData) => void,
  ) => () => void;
  onError: (handler: (error: Error) => void) => void;
  close: () => void;
}

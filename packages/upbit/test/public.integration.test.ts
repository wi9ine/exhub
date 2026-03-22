import { beforeAll, describe, expect, it } from "vitest";

import { createUpbitClient } from "../src";

const client = createUpbitClient();

let market = "KRW-BTC";
let quoteCurrency = "KRW";

describe("@exhub/upbit public integration", () => {
  beforeAll(async () => {
    const pairs = await client.tradingPairs.listTradingPairs({ is_details: true });
    expect(Array.isArray(pairs)).toBe(true);
    expect(pairs.length).toBeGreaterThan(0);

    market = pairs.find((pair) => pair.market === "KRW-BTC")?.market ?? pairs[0]?.market ?? market;
    quoteCurrency = market.split("-")[0] ?? "KRW";
  });

  it("페어 목록 조회", async () => {
    const pairs = await client.tradingPairs.listTradingPairs({ is_details: true });
    expect(Array.isArray(pairs)).toBe(true);
    expect(pairs.length).toBeGreaterThan(0);
  });

  it("초 캔들 조회", async () => {
    const candles = await client.candles.listCandlesSeconds({ market, count: 1 });
    expect(Array.isArray(candles)).toBe(true);
  });

  it("분 캔들 조회", async () => {
    const candles = await client.candles.listCandlesMinutes(1, { market, count: 1 });
    expect(Array.isArray(candles)).toBe(true);
  });

  it("일 캔들 조회", async () => {
    const candles = await client.candles.listCandlesDays({ market, count: 1 });
    expect(Array.isArray(candles)).toBe(true);
  });

  it("주 캔들 조회", async () => {
    const candles = await client.candles.listCandlesWeeks({ market, count: 1 });
    expect(Array.isArray(candles)).toBe(true);
  });

  it("월 캔들 조회", async () => {
    const candles = await client.candles.listCandlesMonths({ market, count: 1 });
    expect(Array.isArray(candles)).toBe(true);
  });

  it("연 캔들 조회", async () => {
    const candles = await client.candles.listCandlesYears({ market, count: 1 });
    expect(Array.isArray(candles)).toBe(true);
  });

  it("최근 체결 내역 조회", async () => {
    const trades = await client.trades.recentTradesHistory({ market, count: 1 });
    expect(Array.isArray(trades)).toBe(true);
  });

  it("페어 단위 현재가 조회", async () => {
    const tickers = await client.tickers.listTickers({ markets: market });
    expect(Array.isArray(tickers)).toBe(true);
    expect(tickers.length).toBeGreaterThan(0);
  });

  it("마켓 단위 현재가 조회", async () => {
    const tickers = await client.tickers.listQuoteTickers({ quote_currencies: quoteCurrency });
    expect(Array.isArray(tickers)).toBe(true);
  });

  it("호가 조회", async () => {
    const books = await client.orderbook.listOrderbooks({ markets: market, count: 1 });
    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);
  });

  it("호가 정책 조회", async () => {
    const instruments = await client.orderbook.listOrderbookInstruments({ markets: market });
    expect(Array.isArray(instruments)).toBe(true);
  });

  it("호가 모아보기 단위 조회", async () => {
    const levels = await client.orderbook.listOrderbookLevels({ markets: market });
    expect(Array.isArray(levels)).toBe(true);
  });
});

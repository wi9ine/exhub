import { beforeAll, describe, expect, it } from "vitest";

import { createBithumbClient } from "../src";

const client = createBithumbClient();

let market = "KRW-BTC";

describe("@exhub/bithumb public integration", () => {
  beforeAll(async () => {
    const markets = await client.markets.getMarketAll({ isDetails: true });
    expect(Array.isArray(markets)).toBe(true);
    expect(markets.length).toBeGreaterThan(0);
    market =
      markets.find((item) => item.market === "KRW-BTC")?.market ?? markets[0]?.market ?? market;
  });

  it("마켓 코드 조회", async () => {
    const result = await client.markets.getMarketAll({ isDetails: true });
    expect(Array.isArray(result)).toBe(true);
  });

  it("분 캔들 조회", async () => {
    const result = await client.candles.minute1({ market, count: 1 }, 1);
    expect(Array.isArray(result)).toBe(true);
  });

  it("일 캔들 조회", async () => {
    const result = await client.candles.day({ market, count: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("주 캔들 조회", async () => {
    const result = await client.candles.week({ market, count: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("월 캔들 조회", async () => {
    const result = await client.candles.month({ market, count: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("최근 체결 내역 조회", async () => {
    const result = await client.trades.getTradesTicks({ market, count: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("현재가 정보 조회", async () => {
    const result = await client.tickers.getTicker({ markets: market });
    expect(Array.isArray(result)).toBe(true);
  });

  it("호가 정보 조회", async () => {
    const result = await client.orderbook.getOrderbook({ markets: [market] });
    expect(result).toBeTruthy();
  });

  it("경보제 조회", async () => {
    const result = await client.markets.getMarketVirtualAssetWarning();
    expect(Array.isArray(result)).toBe(true);
  });

  it("공지사항 조회", async () => {
    const result = await client.service.getNotices();
    expect(Array.isArray(result)).toBe(true);
  });

  it("입출금 수수료 조회", async (context) => {
    try {
      const result = await client.service.getFeeInfo("BTC");
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "status" in error.response &&
        error.response.status === 404
      ) {
        return context.skip();
      }
      throw error;
    }
  });
});

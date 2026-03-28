import { beforeAll, describe, expect, it } from "vitest";

import { createGopaxClient } from "../src";

const client = createGopaxClient();

let tradingPair = "BTC-KRW";

describe("@exhub/gopax public integration", () => {
  beforeAll(async () => {
    const pairs = await client.market.listTradingPairs();
    tradingPair = pairs[0]?.name ?? tradingPair;
  });

  it("자산 목록 조회", async () => {
    const result = await client.market.listAssets();
    expect(Array.isArray(result)).toBe(true);
  });

  it("거래쌍 목록 조회", async () => {
    const result = await client.market.listTradingPairs();
    expect(Array.isArray(result)).toBe(true);
  });

  it("가격 틱 사이즈 조회", async () => {
    const result = await client.market.getTradingPairPriceTickSize(tradingPair);
    expect(Array.isArray(result)).toBe(true);
  });

  it("티커 조회", async () => {
    const result = await client.market.getTradingPairTicker(tradingPair);
    expect(result).toBeTruthy();
  });

  it("오더북 조회", async () => {
    const result = await client.market.getTradingPairBook(tradingPair, { level: 1 });
    expect(result).toBeTruthy();
  });

  it("체결 기록 조회", async () => {
    const result = await client.market.listTradingPairTrades(tradingPair, { limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("최근 24시간 통계 조회", async () => {
    const result = await client.market.getTradingPairStats(tradingPair);
    expect(result).toBeTruthy();
  });

  it("최근 24시간 통계 조회 (모든 거래쌍)", async () => {
    const result = await client.market.listTradingPairsStats();
    expect(Array.isArray(result)).toBe(true);
  });

  it("차트 데이터 조회", async () => {
    const now = Date.now();
    const result = await client.market.getTradingPairCandles(tradingPair, {
      start: now - 60 * 60 * 1000,
      end: now,
      interval: 1,
      limit: 10,
    });
    expect(Array.isArray(result)).toBe(true);
  });

  it("투자유의 정보 조회", async (context) => {
    try {
      const result = await client.market.listTradingPairsCautions({ showActive: false });
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "status" in error.response &&
        error.response.status === 500
      ) {
        return context.skip();
      }
      throw error;
    }
  });

  it("전체 티커 조회", async () => {
    const result = await client.market.listTickers();
    expect(Array.isArray(result)).toBe(true);
  });

  it("서버 시간 조회", async () => {
    const result = await client.market.getTime();
    expect(result).toBeTruthy();
  });

  it("공지사항 조회", async () => {
    const result = await client.market.listNotices({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });
});

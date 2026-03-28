import { beforeAll, describe, expect, it } from "vitest";

import { createKorbitClient } from "../src";

const client = createKorbitClient();

let symbol = "btc_krw";

describe("@exhub/korbit public integration", () => {
  beforeAll(async () => {
    const pairs = await client.market.listCurrencyPairs();
    symbol = pairs.data[0]?.symbol ?? symbol;
  });

  it("현재가 조회", async () => {
    const result = await client.market.listTickers({ symbol });
    expect(result.success).toBe(true);
  });

  it("호가 조회", async () => {
    const result = await client.market.getOrderbook({ symbol });
    expect(result.success).toBe(true);
  });

  it("최근 체결 내역 조회", async () => {
    const result = await client.market.listTrades({ symbol, limit: 10 });
    expect(result.success).toBe(true);
  });

  it("캔들스틱 조회", async () => {
    const result = await client.market.getCandles({
      symbol,
      interval: "60",
      limit: 10,
    });
    expect(result.success).toBe(true);
  });

  it("거래지원 목록 조회", async () => {
    const result = await client.market.listCurrencyPairs();
    expect(result.success).toBe(true);
  });

  it("호가 정책 조회", async () => {
    const result = await client.market.getTickSizePolicy({ symbol });
    expect(result.success).toBe(true);
  });

  it("가상자산 정보 조회", async () => {
    const result = await client.service.listCurrencies();
    expect(result.success).toBe(true);
  });

  it("서버 시각 조회", async () => {
    const result = await client.service.getTime();
    expect(result.success).toBe(true);
  });
});

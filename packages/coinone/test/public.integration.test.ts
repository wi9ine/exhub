import { beforeAll, describe, expect, it } from "vitest";

import { createCoinoneClient } from "../src";

const client = createCoinoneClient();

let quoteCurrency = "KRW";
let targetCurrency = "BTC";

describe("@exhub/coinone public integration", () => {
  beforeAll(async () => {
    const market = await client.market.market("KRW", "BTC");
    quoteCurrency = market.markets?.[0]?.quote_currency ?? quoteCurrency;
    targetCurrency = market.markets?.[0]?.target_currency ?? targetCurrency;
  });

  it("개별 호가 단위 조회", async () => {
    const result = await client.market.rangeUnit(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("전체 종목 정보 조회", async () => {
    const result = await client.market.markets(quoteCurrency);
    expect(result).toBeTruthy();
  });

  it("개별 종목 정보 조회", async () => {
    const result = await client.market.market(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("오더북 조회", async () => {
    const result = await client.market.orderbook(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("최근 체결 주문 조회", async () => {
    const result = await client.market.recentCompletedOrders(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("전체 티커 정보 조회", async () => {
    const result = await client.market.tickers(quoteCurrency);
    expect(result).toBeTruthy();
  });

  it("개별 티커 정보 조회", async () => {
    const result = await client.market.ticker(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("전체 티커 정보 조회 UTC", async () => {
    const result = await client.market.utcTickers(quoteCurrency);
    expect(result).toBeTruthy();
  });

  it("개별 티커 정보 조회 UTC", async () => {
    const result = await client.market.utcTicker(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("전체 가상자산 정보 조회", async () => {
    const result = await client.market.currencies();
    expect(result).toBeTruthy();
  });

  it("개별 가상자산 정보 조회", async () => {
    const result = await client.market.currency(targetCurrency);
    expect(result).toBeTruthy();
  });

  it("캔들 차트 조회", async () => {
    const result = await client.market.chart(quoteCurrency, targetCurrency, { interval: "1h" });
    expect(result).toBeTruthy();
  });

  it("deprecated 오더북 조회", async () => {
    const result = await client.market.orderbookDeprecated();
    expect(result).toBeTruthy();
  });

  it("deprecated 티커 조회", async () => {
    const result = await client.market.tickerDeprecated();
    expect(result).toBeTruthy();
  });

  it("deprecated 티커 UTC 조회", async () => {
    const result = await client.market.tickerUtcDeprecated();
    expect(result).toBeTruthy();
  });

  it("deprecated 최근 체결 주문 조회", async () => {
    const result = await client.market.recentCompletedOrdersDeprecated();
    expect(result).toBeTruthy();
  });
});

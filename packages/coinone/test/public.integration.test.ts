import { beforeAll, describe, expect, it } from "vitest";

import { createCoinoneClient } from "../src";

const client = createCoinoneClient();

let quoteCurrency = "KRW";
let targetCurrency = "BTC";

describe("@exhub/coinone public integration", () => {
  beforeAll(async () => {
    const market = await client.market.getMarket("KRW", "BTC");
    quoteCurrency = market.markets?.[0]?.quote_currency ?? quoteCurrency;
    targetCurrency = market.markets?.[0]?.target_currency ?? targetCurrency;
  });

  it("개별 호가 단위 조회", async () => {
    const result = await client.market.getRangeUnit(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("전체 종목 정보 조회", async () => {
    const result = await client.market.listMarkets(quoteCurrency);
    expect(result).toBeTruthy();
  });

  it("개별 종목 정보 조회", async () => {
    const result = await client.market.getMarket(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("오더북 조회", async () => {
    const result = await client.market.getOrderbook(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("최근 체결 주문 조회", async () => {
    const result = await client.market.listTrades(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("전체 티커 정보 조회", async () => {
    const result = await client.market.listTickers(quoteCurrency);
    expect(result).toBeTruthy();
  });

  it("개별 티커 정보 조회", async () => {
    const result = await client.market.getTicker(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("전체 티커 정보 조회 UTC", async () => {
    const result = await client.market.listTickerUtc(quoteCurrency);
    expect(result).toBeTruthy();
  });

  it("개별 티커 정보 조회 UTC", async () => {
    const result = await client.market.getTickerUtc(quoteCurrency, targetCurrency);
    expect(result).toBeTruthy();
  });

  it("전체 가상자산 정보 조회", async () => {
    const result = await client.market.listCurrencies();
    expect(result).toBeTruthy();
  });

  it("개별 가상자산 정보 조회", async () => {
    const result = await client.market.getCurrency(targetCurrency);
    expect(result).toBeTruthy();
  });

  it("캔들 차트 조회", async () => {
    const result = await client.market.getChart(quoteCurrency, targetCurrency, { interval: "1h" });
    expect(result).toBeTruthy();
  });

  it("deprecated 오더북 조회", async () => {
    const result = await client.market.getOrderbookDeprecated();
    expect(result).toBeTruthy();
  });

  it("deprecated 티커 조회", async () => {
    const result = await client.market.getTickerDeprecated();
    expect(result).toBeTruthy();
  });

  it("deprecated 티커 UTC 조회", async () => {
    const result = await client.market.getTickerUtcDeprecated();
    expect(result).toBeTruthy();
  });

  it("deprecated 최근 체결 주문 조회", async () => {
    const result = await client.market.listTradesDeprecated();
    expect(result).toBeTruthy();
  });
});

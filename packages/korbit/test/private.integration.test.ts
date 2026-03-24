import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import { beforeAll, describe, expect, it } from "vitest";

import { createKorbitClient } from "../src";

const envPath = resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../.env.local");

loadEnv({
  path: envPath,
  quiet: true,
});

const apiKey = process.env.KORBIT_API_KEY;
const secretKey = process.env.KORBIT_SECRET_KEY;
const testIf = apiKey && secretKey ? it : it.skip;

describe("korbit private integration", () => {
  let client: ReturnType<typeof createKorbitClient>;
  let symbol = "btc_krw";
  let orderId: number | undefined;
  let coinCurrency = "btc";
  let coinDepositId: number | undefined;
  let coinWithdrawalId: number | undefined;

  beforeAll(async () => {
    if (!apiKey || !secretKey) return;

    client = createKorbitClient({
      credentials: { apiKey, secretKey },
    });

    const pairs = await client.market.currencyPairs();
    symbol = pairs.data[0]?.symbol ?? symbol;

    const openOrders = await client.orders.listOpenOrders({ symbol, limit: 10 });
    orderId = openOrders.data[0]?.orderId;

    const depositAddresses = await client.cryptoDeposits.listDepositAddresses();
    coinCurrency = depositAddresses.data[0]?.currency ?? coinCurrency;

    const recentDeposits = await client.cryptoDeposits.listRecentDeposits({
      currency: coinCurrency,
      limit: 10,
    });
    coinDepositId = recentDeposits.data[0]?.id;

    const recentWithdrawals = await client.cryptoWithdrawals.listRecentWithdrawals({
      currency: coinCurrency,
      limit: 10,
    });
    coinWithdrawalId = recentWithdrawals.data[0]?.id;
  });

  testIf("개별 주문 조회", async (context) => {
    if (!orderId) return context.skip();
    const result = await client.orders.getOrder({ symbol, orderId });
    expect(result.success).toBe(true);
  });

  testIf("미체결 주문 조회", async () => {
    const result = await client.orders.listOpenOrders({ symbol, limit: 10 });
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  testIf("최근 주문 내역 조회", async () => {
    const result = await client.orders.listAllOrders({ symbol, limit: 10 });
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  testIf("최근 체결 내역 조회", async () => {
    const result = await client.orders.listMyTrades({ symbol, limit: 10 });
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  testIf("자산 현황", async () => {
    const result = await client.assets.listBalance();
    expect(result.success).toBe(true);
  });

  testIf("입금 주소 전체 조회", async () => {
    const result = await client.cryptoDeposits.listDepositAddresses();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  testIf("입금 주소 조회", async (context) => {
    try {
      const result = await client.cryptoDeposits.getDepositAddress({ currency: coinCurrency });
      expect(result).toBeTruthy();
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

  testIf("최근 입금내역 조회", async () => {
    const result = await client.cryptoDeposits.listRecentDeposits({
      currency: coinCurrency,
      limit: 10,
    });
    expect(result.success).toBe(true);
  });

  testIf("입금 진행상황 조회", async (context) => {
    if (!coinDepositId) return context.skip();
    const result = await client.cryptoDeposits.getDeposit({
      currency: coinCurrency,
      coinDepositId,
    });
    expect(result.success).toBe(true);
  });

  testIf("출금 가능 주소 목록 조회", async () => {
    const result = await client.cryptoWithdrawals.listWithdrawableAddresses();
    expect(result.success).toBe(true);
  });

  testIf("출금 가능 수량 조회", async () => {
    const result = await client.cryptoWithdrawals.getWithdrawableAmount({ currency: coinCurrency });
    expect(result.success).toBe(true);
  });

  testIf("최근 출금내역 조회", async () => {
    const result = await client.cryptoWithdrawals.listRecentWithdrawals({
      currency: coinCurrency,
      limit: 10,
    });
    expect(result.success).toBe(true);
  });

  testIf("출금 진행상황 조회", async (context) => {
    if (!coinWithdrawalId) return context.skip();
    const result = await client.cryptoWithdrawals.getWithdrawal({
      currency: coinCurrency,
      coinWithdrawalId,
    });
    expect(result.success).toBe(true);
  });

  testIf("원화 최근 입금내역 조회", async () => {
    const result = await client.krw.listRecentDeposits({ limit: 10 });
    expect(result.success).toBe(true);
  });

  testIf("원화 최근 출금내역 조회", async () => {
    const result = await client.krw.listRecentWithdrawals({ limit: 10 });
    expect(result.success).toBe(true);
  });

  testIf("거래수수료율 조회", async (context) => {
    try {
      const result = await client.service.getTradingFeePolicy({ symbol });
      expect(result.success).toBe(true);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "status" in error.response &&
        error.response.status === 400
      ) {
        return context.skip();
      }
      throw error;
    }
  });

  testIf("API 키 정보 조회", async () => {
    const result = await client.service.getCurrentKeyInfo();
    expect(result.success).toBe(true);
  });
});

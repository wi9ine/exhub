import { config as loadEnv } from "dotenv";
import { beforeAll, describe, expect, it, type TestContext } from "vitest";

import { createCoinoneClient } from "../src";

loadEnv({
  path: "/Users/nukeguys/Projects/exhub/.env.local",
  quiet: true,
});

const accessToken = process.env.COINONE_ACCESS_TOKEN;
const secretKey = process.env.COINONE_SECRET_KEY;
const testIf = accessToken && secretKey ? it : it.skip;

function expectCoinoneSuccess(
  context: TestContext,
  result: { result?: string; error_code?: string; status?: string; error_msg?: string },
) {
  if (result.error_code === "405" && result.status === "maintenance") {
    return context.skip();
  }
  expect(result.result).toBe("success");
  expect(result.error_code).toBe("0");
}

describe("coinone private integration", () => {
  let client: ReturnType<typeof createCoinoneClient>;
  let quoteCurrency = "KRW";
  let targetCurrency = "BTC";
  let orderId: string | undefined;
  let transactionId: string | undefined;

  beforeAll(async () => {
    if (!accessToken || !secretKey) return;

    client = createCoinoneClient({
      credentials: { accessToken, secretKey },
    });

    const activeOrders = await client.orders.findActiveOrders();
    orderId = activeOrders.active_orders?.[0]?.order_id;

    const coinHistory = await client.transactions.coinTransactionHistory();
    transactionId = coinHistory.transactions?.[0]?.id;

    const feeRates = await client.account.findAllTradeFees();
    quoteCurrency = feeRates.fee_rates?.[0]?.quote_currency ?? quoteCurrency;
    targetCurrency = feeRates.fee_rates?.[0]?.target_currency ?? targetCurrency;
  });

  testIf("전체 잔고 조회", async (context) => {
    const result = await client.account.findBalance();
    expectCoinoneSuccess(context, result);
    expect(Array.isArray(result.balances)).toBe(true);
  });

  testIf("특정 자산 잔고 조회", async (context) => {
    const result = await client.account.findBalanceByCurrencies({
      currencies: [quoteCurrency, targetCurrency],
    });
    expectCoinoneSuccess(context, result);
    expect(Array.isArray(result.balances)).toBe(true);
  });

  testIf("전체 수수료 조회", async (context) => {
    const result = await client.account.findAllTradeFees();
    expectCoinoneSuccess(context, result);
    expect(Array.isArray(result.fee_rates)).toBe(true);
  });

  testIf("개별 종목 수수료 조회", async (context) => {
    const result = await client.account.findTradeFeeByPair(quoteCurrency, targetCurrency);
    expectCoinoneSuccess(context, result);
    expect(Array.isArray(result.fee_rates)).toBe(true);
  });

  testIf("미체결 주문 조회", async (context) => {
    const result = await client.orders.findActiveOrders();
    expectCoinoneSuccess(context, result);
    expect(Array.isArray(result.active_orders)).toBe(true);
  });

  testIf("주문 정보 조회", async (context) => {
    if (!orderId) {
      context.skip();
      return;
    }
    const result = await client.orders.orderDetail({
      order_id: orderId,
      quote_currency: quoteCurrency,
      target_currency: targetCurrency,
    });
    expectCoinoneSuccess(context, result);
    expect(JSON.stringify(result)).toContain(orderId);
  });

  testIf("전체 체결 주문 조회", async (context) => {
    const result = await client.orders.findAllCompletedOrders({
      size: 10,
      from_ts: Date.now() - 7 * 24 * 60 * 60 * 1000,
      to_ts: Date.now(),
    });
    expectCoinoneSuccess(context, result);
  });

  testIf("종목 별 체결 주문 조회", async (context) => {
    const result = await client.orders.findCompletedOrders({
      quote_currency: quoteCurrency,
      target_currency: targetCurrency,
      size: 10,
      from_ts: Date.now() - 7 * 24 * 60 * 60 * 1000,
      to_ts: Date.now(),
    });
    expectCoinoneSuccess(context, result);
  });

  testIf("deprecated 전체 미체결 주문 조회", async (context) => {
    const result = await client.orders.findAllOpenOrders();
    expectCoinoneSuccess(context, result);
  });

  testIf("deprecated 종목 별 미체결 주문 조회", async (context) => {
    const result = await client.orders.findOpenOrders({
      quote_currency: quoteCurrency,
      target_currency: targetCurrency,
    });
    expectCoinoneSuccess(context, result);
  });

  testIf("deprecated 특정 주문 정보 조회", async (context) => {
    if (!orderId) {
      context.skip();
      return;
    }
    const result = await client.orders.findOrderInfo({
      order_id: orderId,
      quote_currency: quoteCurrency,
      target_currency: targetCurrency,
    });
    expectCoinoneSuccess(context, result);
  });

  testIf("원화 입출금 내역 조회", async (context) => {
    const result = await client.transactions.krwTransactionHistory({ size: 10 });
    expectCoinoneSuccess(context, result);
    expect(Array.isArray(result.transactions)).toBe(true);
  });

  testIf("가상자산 입출금 내역 조회", async (context) => {
    const result = await client.transactions.coinTransactionHistory({ size: 10 });
    expectCoinoneSuccess(context, result);
    expect(Array.isArray(result.transactions)).toBe(true);
  });

  testIf("가상자산 입출금 내역 단건 조회", async (context) => {
    if (!transactionId) {
      context.skip();
      return;
    }
    const result = await client.transactions.singleCoinTransactionHistory({ id: transactionId });
    expectCoinoneSuccess(context, result);
    expect(Array.isArray(result.transactions)).toBe(true);
  });

  testIf("가상자산 출금 한도 조회", async (context) => {
    const result = await client.transactions.coinWithdrawalLimit({ currency: targetCurrency });
    expectCoinoneSuccess(context, result);
  });

  testIf("가상자산 출금 주소록 조회", async (context) => {
    const result = await client.transactions.coinWithdrawalAddressBook({
      currency: targetCurrency,
    });
    expectCoinoneSuccess(context, result);
  });

  testIf("주문 리워드 프로그램 조회", async (context) => {
    const result = await client.rewards.orderRewardPrograms();
    expectCoinoneSuccess(context, result);
    expect(Array.isArray(result.programs)).toBe(true);
  });

  testIf("주문 리워드 내역 조회", async (context) => {
    const result = await client.rewards.orderRewardHistory();
    expectCoinoneSuccess(context, result);
  });
});

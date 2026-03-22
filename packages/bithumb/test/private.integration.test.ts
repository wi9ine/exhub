import { config as loadEnv } from "dotenv";
import { beforeAll, describe, expect, it } from "vitest";

import { createBithumbClient } from "../src";

loadEnv({
  path: "/Users/nukeguys/Projects/exhub/.env.local",
  quiet: true,
});

const apiKey = process.env.BITHUMB_API_KEY;
const secretKey = process.env.BITHUMB_SECRET_KEY;
const testIf = apiKey && secretKey ? it : it.skip;

describe("bithumb private integration", () => {
  let client: ReturnType<typeof createBithumbClient>;
  const market = "KRW-BTC";
  let orderId: string | undefined;
  let currency = "BTC";
  let netType = "BTC";

  beforeAll(async () => {
    if (!apiKey || !secretKey) return;

    client = createBithumbClient({
      credentials: { apiKey, secretKey },
    });

    const orders = await client.orders.getOrders({ market: "KRW-BTC", limit: 1 });
    orderId = orders[0]?.uuid;

    const withdrawals = await client.withdrawals.getWithdraws({ limit: 1 });
    currency = withdrawals[0]?.currency ?? currency;
    if (typeof withdrawals[0]?.net_type === "string") {
      netType = withdrawals[0].net_type;
    }
  });

  testIf("전체 계좌 조회", async () => {
    const result = await client.accounts.getAccounts();
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("주문 가능 정보 조회", async () => {
    const result = await client.orders.getOrdersChance({ market });
    expect(result).toBeTruthy();
  });

  testIf("개별 주문 조회", async (context) => {
    if (!orderId) {
      context.skip();
      return;
    }
    const result = await client.orders.getOrder({ uuid: orderId });
    expect(result).toBeTruthy();
  });

  testIf("주문 리스트 조회", async () => {
    const result = await client.orders.getOrders({ market, limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("TWAP 주문 내역 조회", async () => {
    const result = await client.orders.getOrders1({ market, limit: 10 });
    expect(result).toBeTruthy();
  });

  testIf("코인 출금 리스트 조회", async () => {
    const result = await client.withdrawals.getWithdraws({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("원화 출금 리스트 조회", async () => {
    const result = await client.withdrawals.getWithdrawsKrw({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("개별 출금 조회", async (context) => {
    const withdrawals = await client.withdrawals.getWithdraws({ currency, limit: 1 });
    const latest = withdrawals[0];
    if (!latest?.uuid && !latest?.txid) {
      context.skip();
      return;
    }
    const result = await client.withdrawals.getWithdraw({
      currency,
      ...(latest.uuid ? { uuid: latest.uuid } : {}),
      ...(latest.txid ? { txid: latest.txid } : {}),
    });
    expect(result).toBeTruthy();
  });

  testIf("출금 가능 정보 조회", async () => {
    const result = await client.withdrawals.getWithdrawsChance({ currency, net_type: netType });
    expect(result).toBeTruthy();
  });

  testIf("출금 허용 주소 리스트 조회", async () => {
    const result = await client.withdrawals.getWithdrawsCoinAddresses();
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("코인 입금 리스트 조회", async () => {
    const result = await client.deposits.getDeposits({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("원화 입금 리스트 조회", async () => {
    const result = await client.deposits.getDepositsKrw({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("개별 입금 조회", async (context) => {
    const deposits = await client.deposits.getDeposits({ currency, limit: 1 });
    const latest = deposits[0];
    if (!latest?.uuid && !latest?.txid) {
      context.skip();
      return;
    }
    const result = await client.deposits.getDeposit({
      currency,
      ...(latest.uuid ? { uuid: latest.uuid } : {}),
      ...(latest.txid ? { txid: latest.txid } : {}),
    });
    expect(result).toBeTruthy();
  });

  testIf("코인 입금 주소 목록 조회", async () => {
    const result = await client.deposits.getDepositsCoinAddresses();
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("코인 입금 주소 조회", async (context) => {
    const addresses = await client.deposits.getDepositsCoinAddresses();
    const latest = addresses.find((item) => item.currency && item.net_type);
    if (!latest?.currency || !latest?.net_type) {
      context.skip();
      return;
    }
    const result = await client.deposits.getDepositsCoinAddress({
      currency: latest.currency,
      net_type: latest.net_type,
    });
    expect(result).toBeTruthy();
  });

  testIf("입출금 서비스 상태 조회", async () => {
    const result = await client.service.getStatusWallet();
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("API 키 조회", async () => {
    const result = await client.service.api();
    expect(Array.isArray(result)).toBe(true);
  });
});

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import { beforeAll, describe, expect, it } from "vitest";

import { createGopaxClient } from "../src";

const envPath = resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../.env.local");

loadEnv({
  path: envPath,
  quiet: true,
});

const apiKey = process.env.GOPAX_API_KEY;
const secretKey = process.env.GOPAX_SECRET_KEY;
const testIf = apiKey && secretKey ? it : it.skip;

describe("gopax private integration", () => {
  let client: ReturnType<typeof createGopaxClient>;
  let asset = "BTC";
  let orderId: string | undefined;

  beforeAll(async () => {
    if (!apiKey || !secretKey) return;

    client = createGopaxClient({
      credentials: { apiKey, secretKey },
    });

    const balances = await client.account.listBalances();
    asset = balances[0]?.asset ?? asset;

    const orders = await client.orders.listOrders({ includePast: true, limit: 10 });
    orderId = orders[0]?.id;
  });

  testIf("잔고 조회", async () => {
    const result = await client.account.listBalances();
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("특정 자산 잔고 조회", async () => {
    const result = await client.account.getBalance(asset);
    expect(result).toBeTruthy();
  });

  testIf("주문 조회", async () => {
    const result = await client.orders.listOrders({ includePast: true, limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("특정 주문 조회", async (context) => {
    if (!orderId) return context.skip();
    const result = await client.orders.getOrder(orderId);
    expect(result).toBeTruthy();
  });

  testIf("체결 기록 조회", async () => {
    const result = await client.trades.listTrades({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("입출금 기록 조회", async () => {
    const result = await client.wallet.listDepositWithdrawalStatus({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("가상자산 입금 주소 조회", async () => {
    const result = await client.wallet.listCryptoDepositAddresses();
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("가상자산 출금 주소 조회", async () => {
    const result = await client.wallet.listCryptoWithdrawalAddresses();
    expect(Array.isArray(result)).toBe(true);
  });
});

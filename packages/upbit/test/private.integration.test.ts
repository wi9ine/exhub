import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import axios from "axios";
import { config as loadEnv } from "dotenv";
import { beforeAll, describe, expect, it } from "vitest";

import { createUpbitClient } from "../src";
import type { ListDeposits200Item } from "../src/generated/exchange/model/listDeposits200Item";
import type { ListTravelRuleVasps200Item } from "../src/generated/exchange/model/listTravelRuleVasps200Item";
import type { ListWithdrawals200Item } from "../src/generated/exchange/model/listWithdrawals200Item";

const envPath = resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../.env.local");

loadEnv({
  path: envPath,
  quiet: true,
});

const accessKey = process.env.UPBIT_ACCESS_KEY;
const secretKey = process.env.UPBIT_SECRET_KEY;

const testIf = accessKey && secretKey ? it : it.skip;

describe("upbit private integration", () => {
  let client: ReturnType<typeof createUpbitClient>;
  let market = "KRW-BTC";
  let depositContext: ListDeposits200Item | undefined;
  let withdrawalContext: ListWithdrawals200Item | undefined;
  let orderContext: { uuid?: string } | undefined;
  let travelRuleVasp: ListTravelRuleVasps200Item | undefined;
  let travelRuleVaspUuid: string | undefined;

  beforeAll(async () => {
    if (!accessKey || !secretKey) {
      return;
    }

    client = createUpbitClient({
      credentials: {
        accessKey,
        secretKey,
      },
    });

    const pairs = await client.tradingPairs.listTradingPairs();
    market = pairs.find((pair) => pair.market === "KRW-BTC")?.market ?? pairs[0]?.market ?? market;

    const openOrders = await client.orders.listOpenOrders();
    const closedOrders = await client.orders.listClosedOrders();
    orderContext = openOrders[0] ?? closedOrders[0];

    const deposits = await client.deposits.listDeposits();
    depositContext = deposits[0];

    const withdrawals = await client.withdrawals.listWithdrawals();
    withdrawalContext = withdrawals[0];

    const vasps = await client.travelRule.listTravelRuleVasps();
    travelRuleVasp = vasps[0];
    travelRuleVaspUuid = travelRuleVasp?.vasp_uuid;
  });

  testIf("계정 잔고 조회", async () => {
    const balances = await client.assets.listBalance();
    expect(Array.isArray(balances)).toBe(true);
  });

  testIf("페어별 주문 가능 정보 조회", async () => {
    const result = await client.orders.getOrderChance({ market });
    expect(result).toBeTruthy();
    expect("market" in result).toBe(true);
  });

  testIf("개별 주문 조회", async (context) => {
    if (!orderContext?.uuid) {
      context.skip();
      return;
    }
    const order = await client.orders.getOrder({ uuid: orderContext.uuid });
    expect(order.uuid).toBe(orderContext.uuid);
  });

  testIf("id로 주문 목록 조회", async (context) => {
    if (!orderContext?.uuid) {
      context.skip();
      return;
    }
    const orders = await client.orders.listOrdersByIds({
      "uuids[]": [orderContext.uuid],
    });
    expect(Array.isArray(orders)).toBe(true);
  });

  testIf("체결 대기 주문 목록 조회", async () => {
    const orders = await client.orders.listOpenOrders();
    expect(Array.isArray(orders)).toBe(true);
  });

  testIf("종료 주문 목록 조회", async () => {
    const orders = await client.orders.listClosedOrders();
    expect(Array.isArray(orders)).toBe(true);
  });

  testIf("출금 가능 정보 조회", async (context) => {
    if (!withdrawalContext?.currency) {
      context.skip();
      return;
    }
    const result = await client.withdrawals.getWithdrawChance({
      currency: withdrawalContext.currency,
      ...(withdrawalContext.net_type ? { net_type: withdrawalContext.net_type } : {}),
    });
    expect(result.currency?.code ?? result.account?.currency).toBeTruthy();
  });

  testIf("출금 주소 목록 조회", async () => {
    const addresses = await client.withdrawals.listWithdrawalAddresses();
    expect(Array.isArray(addresses)).toBe(true);
  });

  testIf("출금 정보 조회", async () => {
    const latest = await client.withdrawals.getWithdrawal();
    expect(latest).toBeTruthy();
  });

  testIf("출금 목록 조회", async () => {
    const withdrawals = await client.withdrawals.listWithdrawals();
    expect(Array.isArray(withdrawals)).toBe(true);
  });

  testIf("입금 가능 정보 조회", async (context) => {
    if (!depositContext?.currency || !depositContext?.net_type) {
      context.skip();
      return;
    }
    const result = await client.deposits.getDepositChance({
      currency: depositContext.currency,
      net_type: depositContext.net_type,
    });
    expect(result.currency).toBeTruthy();
  });

  testIf("입금 주소 조회", async (context) => {
    if (!depositContext?.currency || !depositContext?.net_type) {
      context.skip();
      return;
    }
    const address = await client.deposits.getDepositAddress({
      currency: depositContext.currency,
      net_type: depositContext.net_type,
    });
    expect(address).toBeTruthy();
  });

  testIf("입금 주소 목록 조회", async () => {
    const addresses = await client.deposits.listDepositAddresses();
    expect(Array.isArray(addresses)).toBe(true);
  });

  testIf("입금 정보 조회", async () => {
    const latest = await client.deposits.getDeposit();
    expect(latest).toBeTruthy();
  });

  testIf("입금 목록 조회", async () => {
    const deposits = await client.deposits.listDeposits();
    expect(Array.isArray(deposits)).toBe(true);
  });

  testIf("트래블룰 지원 거래소 목록 조회", async () => {
    const vasps = await client.travelRule.listTravelRuleVasps();
    expect(Array.isArray(vasps)).toBe(true);
  });

  testIf("UUID 기반 트래블룰 검증", async (context) => {
    if (!depositContext?.uuid || !travelRuleVaspUuid) {
      context.skip();
      return;
    }
    try {
      const result = await client.travelRule.verifyTravelRuleByUuid({
        deposit_uuid: depositContext.uuid,
        vasp_uuid: travelRuleVaspUuid,
      });
      expect(result).toBeTruthy();
    } catch (error) {
      if (axios.isAxiosError(error) && [400, 404, 500].includes(error.response?.status ?? 0)) {
        context.skip();
        return;
      }
      throw error;
    }
  });

  testIf("TXID 기반 트래블룰 검증", async (context) => {
    if (!depositContext?.txid || !travelRuleVaspUuid) {
      context.skip();
      return;
    }
    try {
      const result = await client.travelRule.verifyTravelRuleByTxid({
        txid: depositContext.txid,
        currency: depositContext.currency ?? "BTC",
        net_type: depositContext.net_type ?? "BTC",
        vasp_uuid: travelRuleVaspUuid,
      });
      expect(result).toBeTruthy();
    } catch (error) {
      if (axios.isAxiosError(error) && [400, 404, 500].includes(error.response?.status ?? 0)) {
        context.skip();
        return;
      }
      throw error;
    }
  });

  testIf("입출금 서비스 상태 조회", async () => {
    const result = await client.service.getServiceStatus();
    expect(Array.isArray(result)).toBe(true);
  });

  testIf("API 키 목록 조회", async () => {
    const result = await client.service.listApiKeys();
    expect(Array.isArray(result)).toBe(true);
  });
});

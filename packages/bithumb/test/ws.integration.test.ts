import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BithumbWsClient } from "../src";
import { createBithumbWsClient } from "../src";

let ws: BithumbWsClient;

describe("@exhub/bithumb ws integration", () => {
  beforeAll(() => {
    ws = createBithumbWsClient({ reconnect: false });
  });

  afterAll(() => {
    ws.close();
  });

  it("ticker 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribeTicker({ type: "ticker", codes: ["KRW-BTC"] }, (data) => {
      messages.push(data);
    });

    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (messages.length >= 1) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        resolve();
      }, 10_000);
    });

    unsubscribe();

    expect(messages.length).toBeGreaterThanOrEqual(1);
    const first = messages[0] as Record<string, unknown>;
    expect(first.type).toBe("ticker");
    expect(first.code).toBe("KRW-BTC");
    expect(first.trade_price).toBeTypeOf("number");
  }, 15_000);

  it("trade 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribeTrade({ type: "trade", codes: ["KRW-BTC"] }, (data) => {
      messages.push(data);
    });

    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (messages.length >= 1) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        resolve();
      }, 10_000);
    });

    unsubscribe();

    expect(messages.length).toBeGreaterThanOrEqual(1);
    const first = messages[0] as Record<string, unknown>;
    expect(first.type).toBe("trade");
    expect(first.code).toBe("KRW-BTC");
    expect(first.trade_price).toBeTypeOf("number");
  }, 15_000);
});

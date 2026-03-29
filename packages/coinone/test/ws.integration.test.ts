import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CoinoneWsClient } from "../src";
import { createCoinoneWsClient } from "../src";

let ws: CoinoneWsClient;

describe("@exhub/coinone ws integration", () => {
  beforeAll(() => {
    ws = createCoinoneWsClient({ reconnect: false });
  });

  afterAll(() => {
    ws.close();
  });

  it("publicTicker 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribePublicTicker(
      {
        request_type: "SUBSCRIBE",
        channel: "TICKER",
        topic: { quote_currency: "KRW", target_currency: "BTC" },
      },
      (data) => {
        messages.push(data);
      },
    );

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
    expect(first.response_type).toBe("DATA");
    expect(first.channel).toBe("TICKER");
    expect(first.data).toBeTypeOf("object");
  }, 15_000);

  it("publicOrderbook 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribePublicOrderbook(
      {
        request_type: "SUBSCRIBE",
        channel: "ORDERBOOK",
        topic: { quote_currency: "KRW", target_currency: "BTC" },
      },
      (data) => {
        messages.push(data);
      },
    );

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
    expect(first.response_type).toBe("DATA");
    expect(first.channel).toBe("ORDERBOOK");
    expect(first.data).toBeTypeOf("object");
  }, 15_000);
});

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getExchangeRuntime, listSupportedExchanges } from "../src/runtime";
import { buildOrderedArguments } from "../src/server";

const upbitListTickersMock = vi.fn(async () => ({ market: "KRW-BTC", price: "100" }));
const upbitListBalanceMock = vi.fn(async () => [{ currency: "BTC", balance: "1.0" }]);
vi.mock("@exhub/upbit", () => ({
  createUpbitClient: () => ({
    tradingPairs: {
      listTradingPairs: vi.fn(),
    },
    candles: {
      getSecondCandles: vi.fn(),
      getMinuteCandles: vi.fn(),
      getDayCandles: vi.fn(),
      getWeekCandles: vi.fn(),
      getMonthCandles: vi.fn(),
      getYearCandles: vi.fn(),
    },
    trades: {
      listTradesTicks: vi.fn(),
    },
    tickers: {
      listTickers: upbitListTickersMock,
      listQuoteTickers: vi.fn(),
    },
    orderbook: {
      listOrderbooks: vi.fn(),
      listOrderbookInstruments: vi.fn(),
      listOrderbookSupportedLevels: vi.fn(),
    },
    assets: {
      listBalance: upbitListBalanceMock,
    },
    orders: {
      getOrderChance: vi.fn(),
      createOrder: vi.fn(),
      createTestOrder: vi.fn(),
      getOrder: vi.fn(),
      cancelOrder: vi.fn(),
      listOrdersByIds: vi.fn(),
      cancelOrdersByIds: vi.fn(),
      listOpenOrders: vi.fn(),
      cancelOpenOrders: vi.fn(),
      listClosedOrders: vi.fn(),
      cancelAndCreateOrder: vi.fn(),
    },
    withdrawals: {
      getWithdrawChance: vi.fn(),
      listWithdrawalAddresses: vi.fn(),
      withdraw: vi.fn(),
      cancelWithdrawal: vi.fn(),
      createWithdrawKrw: vi.fn(),
      getWithdrawal: vi.fn(),
      listWithdrawals: vi.fn(),
    },
    deposits: {
      getDepositChance: vi.fn(),
      createDepositAddress: vi.fn(),
      getDepositAddress: vi.fn(),
      listDepositAddresses: vi.fn(),
      createDepositKrw: vi.fn(),
      getDeposit: vi.fn(),
      listDeposits: vi.fn(),
    },
    travelRule: {
      listTravelRuleVasps: vi.fn(),
      verifyTravelRuleByUuid: vi.fn(),
      verifyTravelRuleByTxid: vi.fn(),
    },
    service: {
      getServiceStatus: vi.fn(),
      listApiKeys: vi.fn(),
    },
  }),
}));

describe("exchange server", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    delete process.env.EXHUB_UPBIT_ACCESS_KEY;
    delete process.env.EXHUB_UPBIT_SECRET_KEY;
  });

  it("선택한 거래소 도구만 노출한다", async () => {
    const { createExchangeServer } = await import("../src/server");
    const server = await createExchangeServer("upbit");
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const result = await client.listTools();
    const toolNames = result.tools.map((tool) => tool.name);

    expect(toolNames).toContain("listTickers");
    expect(toolNames).not.toContain("getMarketAll");
  });

  it("tool description에 스펙 summary를 사용한다", async () => {
    const { createExchangeServer } = await import("../src/server");
    const server = await createExchangeServer("upbit");
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const result = await client.listTools();
    const listTickersTool = result.tools.find((tool) => tool.name === "listTickers");

    expect(listTickersTool?.description).toBe(
      "지정한 페어의 현재가를 조회합니다. 요청 시점 기준으로 해당 페어의 티커 스냅샷이 반환됩니다.",
    );
    expect(listTickersTool?.description).not.toContain("호출");
  });

  it("private 도구는 필수 환경 변수가 없으면 명확한 오류를 반환한다", async () => {
    const { createExchangeServer } = await import("../src/server");
    const server = await createExchangeServer("upbit");
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const result = await client.callTool({
      name: "listBalance",
      arguments: {},
    });
    const typedResult = result as {
      content?: Array<{ type: string; text?: string }>;
      isError?: boolean;
    };
    const firstContent = typedResult.content?.[0];

    expect(typedResult.isError).toBe(true);
    expect(firstContent?.type).toBe("text");
    if (firstContent?.type === "text") {
      expect(firstContent.text).toContain("EXHUB_UPBIT_ACCESS_KEY");
      expect(firstContent.text).toContain("EXHUB_UPBIT_SECRET_KEY");
    }
    expect(upbitListBalanceMock).not.toHaveBeenCalled();
  });

  it("no-arg 도구는 arguments 없이도 호출할 수 있다", async () => {
    process.env.EXHUB_UPBIT_ACCESS_KEY = "test-access-key";
    process.env.EXHUB_UPBIT_SECRET_KEY = "test-secret-key";

    const { createExchangeServer } = await import("../src/server");
    const server = await createExchangeServer("upbit");
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const result = await client.callTool({
      name: "listBalance",
    });

    expect(result.isError).toBeFalsy();
    expect(upbitListBalanceMock).toHaveBeenCalledWith();
  });

  it("public 도구 호출이 선택한 거래소 클라이언트 메서드로 라우팅된다", async () => {
    const { createExchangeServer } = await import("../src/server");
    const server = await createExchangeServer("upbit");
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const result = await client.callTool({
      name: "listTickers",
      arguments: {
        params: {
          markets: "KRW-BTC",
        },
      },
    });

    expect(result.isError).toBeFalsy();
    expect(upbitListTickersMock).toHaveBeenCalledWith({
      markets: "KRW-BTC",
    });
    expect(result.structuredContent).toEqual({
      market: "KRW-BTC",
      price: "100",
    });
  });

  it("generated-zod로 params 내부 필드도 검증한다", async () => {
    const { createExchangeServer } = await import("../src/server");
    const server = await createExchangeServer("upbit");
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const result = await client.callTool({
      name: "listTickers",
      arguments: {
        params: {},
      },
    });
    const typedResult = result as {
      content?: Array<{ type: string; text?: string }>;
      isError?: boolean;
    };
    const firstContent = typedResult.content?.[0];

    expect(typedResult.isError).toBe(true);
    expect(upbitListTickersMock).not.toHaveBeenCalled();
    if (firstContent?.type === "text") {
      expect(firstContent.text).toContain("markets");
    }
  });

  it("optional trailing undefined 인자를 제거한다", () => {
    const args = buildOrderedArguments(
      {
        currency: "BTC",
      },
      [
        {
          name: "currency",
          required: true,
          schema: { type: "string" },
        },
        {
          name: "unit",
          required: false,
          schema: { type: "number" },
        },
      ],
    );

    expect(args).toEqual(["BTC"]);
  });

  it("listTools 도구 수가 런타임 정의와 일치한다", async () => {
    const { createExchangeServer } = await import("../src/server");
    const runtime = await getExchangeRuntime("upbit");
    const server = await createExchangeServer("upbit");
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const result = await client.listTools();

    expect(result.tools).toHaveLength(runtime.tools.length);
  });
});

describe("거래소별 도구명 유일성", () => {
  it.each(
    listSupportedExchanges().map((key) => [key]),
  )("%s 거래소의 도구명이 모두 고유하다", async (exchange) => {
    const runtime = await getExchangeRuntime(exchange);
    const names = runtime.tools.map((tool) => tool.name);
    const unique = new Set(names);

    expect(unique.size).toBe(names.length);
  });

  it.each(
    listSupportedExchanges().map((key) => [key]),
  )("%s 거래소의 도구명이 Claude Code 제약을 만족한다", async (exchange) => {
    const runtime = await getExchangeRuntime(exchange);
    const validNamePattern = /^[a-zA-Z0-9_-]{1,64}$/;

    expect(runtime.tools.every((tool) => validNamePattern.test(tool.name))).toBe(true);
  });
});

describe("deprecated 도구 비노출", () => {
  it("coinone deprecated 공개 도구를 노출하지 않는다", async () => {
    const runtime = await getExchangeRuntime("coinone");
    const names = runtime.tools.map((tool) => tool.name);

    expect(names).not.toContain("getOrderbookDeprecated");
    expect(names).not.toContain("getTickerDeprecated");
    expect(names).not.toContain("getTickerUtcDeprecated");
    expect(names).not.toContain("listTradesDeprecated");
  });
});

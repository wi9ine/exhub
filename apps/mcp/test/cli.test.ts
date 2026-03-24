import { describe, expect, it } from "vitest";

import { formatUsage, parseCliArgs } from "../src/cli";

describe("parseCliArgs", () => {
  it("정상적인 --exchange 인자를 파싱한다", () => {
    expect(parseCliArgs(["--exchange", "upbit"])).toEqual({
      ok: true,
      exchange: "upbit",
    });
  });

  it("exchange 값이 없으면 사용법을 반환한다", () => {
    const result = parseCliArgs([]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe(formatUsage());
    }
  });

  it("지원하지 않는 거래소면 오류를 반환한다", () => {
    const result = parseCliArgs(["--exchange", "binance"]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("지원하지 않는 거래소입니다");
      expect(result.message).toContain("binance");
    }
  });
});

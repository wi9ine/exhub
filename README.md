# ExHub

가상자산 거래소 API를 위한 통합 TypeScript SDK와 MCP 서버입니다.

각 거래소의 OPEN API를 타입 안전한 SDK로 래핑하고, 동일한 패턴으로 통일된 인터페이스를 제공합니다.

## 지원 거래소

| 거래소  | SDK 패키지       | 상태 |
| ------- | ---------------- | ---- |
| Upbit   | `@exhub/upbit`   | ✅   |
| Bithumb | `@exhub/bithumb` | ✅   |
| Coinone | `@exhub/coinone` | ✅   |
| Gopax   | `@exhub/gopax`   | ✅   |
| Korbit  | `@exhub/korbit`  | ✅   |

## 주요 기능

- **타입 안전한 API** — OpenAPI 스펙에서 자동 생성된 TypeScript 타입과 Zod 검증 스키마
- **통일된 인터페이스** — 거래소마다 다른 API를 동일한 패턴(`create{Exchange}Client`)으로 사용
- **자동 인증 처리** — API 키만 설정하면 서명, JWT, 헤더 등을 자동으로 처리
- **MCP 서버 지원** — Claude, Cursor 등 AI 도구에서 거래소 API를 바로 사용

## 빠른 시작

### 요구사항

- Node.js 18 이상
- npm, yarn, 또는 pnpm

### SDK 사용

```bash
npm install @exhub/gopax
```

```typescript
import { createGopaxClient } from "@exhub/gopax";

// Public API (인증 불필요)
const client = createGopaxClient();

const ticker = await client.market.ticker("BTC-KRW");
console.log(ticker);
```

```typescript
// Private API (인증 필요)
const client = createGopaxClient({
  credentials: {
    apiKey: process.env.GOPAX_API_KEY!,
    secretKey: process.env.GOPAX_SECRET_KEY!,
  },
});

const balances = await client.account.listBalances();
console.log(balances);
```

### MCP 서버 사용

`npx`로 설치 없이 바로 실행할 수 있습니다:

```bash
npx @exhub/mcp --exchange gopax
```

AI 클라이언트 설정 예시 (Claude Desktop):

```json
{
  "mcpServers": {
    "exhub-gopax": {
      "command": "npx",
      "args": ["@exhub/mcp", "--exchange", "gopax"],
      "env": {
        "EXHUB_GOPAX_API_KEY": "your-api-key",
        "EXHUB_GOPAX_SECRET_KEY": "your-secret-key"
      }
    }
  }
}
```

지원하는 AI 클라이언트: Claude Desktop, Claude Code, Cursor, VS Code (Copilot), Windsurf, Zed

## 프로젝트 구조

```
exhub/
├── packages/
│   ├── core/          # 공통 코어 (@exhub/core)
│   ├── upbit/         # Upbit SDK (@exhub/upbit)
│   ├── bithumb/       # Bithumb SDK (@exhub/bithumb)
│   ├── coinone/       # Coinone SDK (@exhub/coinone)
│   ├── gopax/         # Gopax SDK (@exhub/gopax)
│   └── korbit/        # Korbit SDK (@exhub/korbit)
├── apps/
│   ├── mcp/           # MCP 서버 (@exhub/mcp)
│   └── docs/          # 문서 사이트
├── specs/             # OpenAPI/AsyncAPI 스펙 (SSOT)
└── scripts/           # 코드 생성 스크립트
```

## SDK vs MCP

|               | SDK                                       | MCP                                        |
| ------------- | ----------------------------------------- | ------------------------------------------ |
| **대상**      | 직접 코드를 작성하는 개발자               | AI 도구(Claude, Cursor 등) 사용자          |
| **사용 방식** | TypeScript/JavaScript에서 import하여 사용 | AI 클라이언트에 MCP 서버를 등록하여 사용   |
| **장점**      | 타입 안전성, 완전한 제어                  | 코드 작성 없이 자연어로 거래소 데이터 조회 |

## 개발

```bash
# 의존성 설치
pnpm install

# 스펙에서 코드 생성
pnpm generate

# 빌드
pnpm build

# 린트
pnpm lint

# 포맷 체크
pnpm format:check

# 타입 체크
pnpm typecheck

# 테스트
pnpm test
```

## 라이선스

MIT

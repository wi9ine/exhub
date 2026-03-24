# @exhub/mcp

`@exhub/mcp`는 exhub 거래소 SDK를 MCP 서버로 노출하는 패키지입니다.

## 설치

```bash
pnpm add @exhub/mcp
```

## 실행

```bash
exhub-mcp --exchange upbit
```

지원 거래소:

- `upbit`
- `bithumb`
- `coinone`
- `gopax`
- `korbit`

## 환경 변수

공통 옵션:

- `EXHUB_<EXCHANGE>_BASE_URL`
- `EXHUB_<EXCHANGE>_TIMEOUT_MS`

거래소별 private API 인증:

- Upbit: `EXHUB_UPBIT_ACCESS_KEY`, `EXHUB_UPBIT_SECRET_KEY`
- Bithumb: `EXHUB_BITHUMB_API_KEY`, `EXHUB_BITHUMB_SECRET_KEY`
- Coinone: `EXHUB_COINONE_ACCESS_TOKEN`, `EXHUB_COINONE_SECRET_KEY`
- GOPAX: `EXHUB_GOPAX_API_KEY`, `EXHUB_GOPAX_SECRET_KEY`, 선택 `EXHUB_GOPAX_RECEIVE_WINDOW`
- Korbit: `EXHUB_KORBIT_API_KEY`, `EXHUB_KORBIT_SECRET_KEY`, 선택 `EXHUB_KORBIT_RECV_WINDOW`

public API는 인증 없이 사용할 수 있습니다.

## MCP 등록 예시

Claude Desktop 예시:

```json
{
  "mcpServers": {
    "upbit": {
      "command": "exhub-mcp",
      "args": ["--exchange", "upbit"]
    },
    "bithumb": {
      "command": "exhub-mcp",
      "args": ["--exchange", "bithumb"]
    }
  }
}
```

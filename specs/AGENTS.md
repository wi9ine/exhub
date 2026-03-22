# AGENTS.md

- 각 거래소별 API 스펙은 추측이나 가정 없이 공식 문서의 최신 버전을 기준으로 분류와 순서, 내용을 동일하게 유지한다. (open api 스펙이 있는 경우에도 공식 문서를 더 신뢰한다.)
- specs의 각 스펙 파일(\*.json)이 변경되면 validate 커맨드를 사용하여 유효성을 검증하고, 문제가 있다면 수정한다.
- AsyncAPI의 `messageId`는 공식 문서값이 없을 경우 `exchange.ws.channel.kind` 규칙의 소문자 kebab-case 식별자(예: `gopax.ws.orderbook.delta`)를 사용한다.
- AsyncAPI 최상위 `id`는 공식 문서값이 없을 경우 `urn:exhub:asyncapi:{exchange}:ws` 규칙의 프로젝트 식별자를 사용한다.

```bash
# specs 폴더 전체 검사
pnpm validate

# 특정 폴더만 검사
pnpm validate upbit

# 특정 파일만 검사
pnpm validate upbit/rest/websocket-api.json
```

## 지원 거래소 및 API Docs

- Upbit: [https://docs.upbit.com/](https://docs.upbit.com/)
- Bithumb: [https://apidocs.bithumb.com/](https://apidocs.bithumb.com/)
- Coinone: [https://docs.coinone.co.kr/](https://docs.coinone.co.kr/)
- Korbit: [https://docs.korbit.co.kr/](https://docs.korbit.co.kr/)
- Gopax: [https://gopax.github.io/API](https://gopax.github.io/API), [https://gopax.github.io/wsapi](https://gopax.github.io/wsapi)

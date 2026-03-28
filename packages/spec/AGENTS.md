# AGENTS.md

- 각 거래소별 API 스펙은 추측이나 가정 없이 공식 문서의 최신 버전을 기준으로 분류와 순서, 내용을 동일하게 유지한다. (open api 스펙이 있는 경우에도 공식 문서를 더 신뢰한다.)
- specs의 각 스펙 파일(\*.json)이 변경되면 validate 커맨드를 사용하여 유효성을 검증하고, 문제가 있다면 수정한다.
- AsyncAPI의 `messageId`는 공식 문서값이 없을 경우 `exchange.ws.channel.kind` 규칙의 소문자 kebab-case 식별자(예: `gopax.ws.orderbook.delta`)를 사용한다.
- AsyncAPI 최상위 `id`는 공식 문서값이 없을 경우 `urn:exhub:asyncapi:{exchange}:ws` 규칙의 프로젝트 식별자를 사용한다.

## OpenAPI operationId 규칙

`operationId`는 단순한 문서용 메타데이터가 아니라, 생성되는 SDK 함수명, 모델명, zod validator명, MCP 내부 식별자에 모두 전파되는 공용 식별자다. 따라서 공식 문서 제목을 그대로 복사하지 말고, 아래 규칙을 만족하는 프로젝트 표준 식별자로 직접 작성한다.

### 목적

- 사람이 읽었을 때 역할이 즉시 드러나야 한다.
- codegen 결과 함수명으로 변환되어도 자연스러워야 한다.
- 공식 문서의 path와 빠르게 대응되어야 한다.
- 거래소가 달라도 같은 의미의 동작은 가능한 한 같은 동사 패턴을 사용해야 한다.
- 경로 버전, 예시값, 문서 표현 방식 같은 비본질 정보에 영향을 받지 않아야 한다.

### 필수 형식

- `operationId`는 반드시 ASCII 소문자 `kebab-case`로 작성한다.
- 허용 문자는 영문 소문자(`a-z`), 숫자(`0-9`), 하이픈(`-`)만 사용한다.
- 공백, 한글, 밑줄(`_`), camelCase, PascalCase는 금지한다.
- 예시
  - 허용: `get-orderbook`, `list-orders`, `create-deposit-address`
  - 금지: `GetOrderbook`, `get_orderbook`, `주문-조회`, `Recent Trades History`

### 기본 구조

- 기본 패턴은 `동사-명사`다.
- 메서드명(`get`, `post`, `delete`)은 그대로 반영하지 않고, 아래 표준 동사로 정규화한다.
- 가능한 한 아래 동사를 우선 사용한다.
  - `get`: 단건 조회 또는 단일 리소스 성격의 응답
  - `list`: 목록 조회 또는 배열 응답
  - `create`: 생성, 등록, 주문 생성, 출금 요청처럼 새 리소스/요청을 만드는 동작
  - `cancel`: 취소
  - `update`: 수정
  - `verify`: 검증
  - `request`: `create`보다 “처리 요청” 의미가 더 적절할 때만 제한적으로 사용
- WebSocket/AsyncAPI operation의 경우 아래를 사용한다.
  - 클라이언트에서 구독 요청을 보내는 publish: `subscribe-*` 또는 `request-*`
  - 서버에서 수신하는 subscribe: `receive-*`

### path 해석 규칙

- `operationId`의 명사는 공식 문서 path의 핵심 segment를 최대한 유지한다.
- path를 해석할 때는 먼저 아래 요소를 제거한다.
  - 버전 segment: `v1`, `v2`
  - path parameter: `{orderId}`, `{TradingPair}`
- snake_case path segment는 의미를 바꾸지 않고 kebab-case로만 변환한다.
  - `coin_addresses` -> `coin-addresses`
  - `travel_rule` -> `travel-rule`
- path의 핵심 segment가 변경안에도 남아 있어야 한다.
- path에 없는 새로운 도메인 용어를 임의로 추가하지 않는다.
- 단, 아래는 허용한다.
  - 단건/목록 의미를 드러내기 위한 단수/복수 조정
  - 의미가 유지되는 범위의 어순 변경
  - 문서 보조어 제거: `all`, `info`, `detail` 등

### 명사 규칙

- 명사는 공식 문서 제목이 아니라 path의 리소스 중심으로 정한다.
- 컬렉션은 복수형, 단건은 단수형을 사용한다.
- path의 핵심 명사가 유지되는 범위에서만 정리한다.
- path의 핵심 명사가 변경안에서 사라지면 그 변경은 채택하지 않는다.
- 예시
  - `/orders` -> `list-orders`
  - `/order` -> `get-order`
  - `/orders/chance` -> `get-order-chance`
  - `/status/wallet` -> `get-wallet-status`
  - `/coin_addresses` -> `list-coin-addresses`

### path 대응성 판정 규칙

- 아래 순서로 판단한다.
  1. path에서 버전과 path parameter를 제거한다.
  2. 남은 핵심 segment를 명사 후보로 본다.
  3. 변경안에 그 핵심 명사가 유지되는지 확인한다.
  4. 동사만 표준화된 수준이면 허용한다.
  5. path에 없는 새 명사가 추가되면 보수적으로 본다.
- 아래 3단계로 판정한다.
  - 안전: path 핵심 명사가 모두 유지됨
  - 주의: path 핵심 명사가 일부만 유지됨
  - 비추천: path 핵심 명사가 대부분 사라짐

### 허용 예시

- `get-orders` -> `list-orders`
- `post-orders` -> `create-order`
- `delete-order` -> `cancel-order`
- `get-orders-chance` -> `get-order-chance`
- `get-deposits-coin-addresses` -> `list-deposits-coin-addresses`
- `get-status-wallet` -> `get-wallet-status`

### 금지 규칙

- 경로 버전(`v1`, `v2`)은 `operationId`에 넣지 않는다.
  - 버전은 경로와 문서 버전에서만 표현한다.
  - 단, 동일 스펙에서 서로 다른 버전 API를 동시에 유지해야 하는 특별한 경우가 아니라면 예외를 두지 않는다.
- 예시값, 기본값, 문서 슬러그에서 유래한 숫자 접미사(`-1`, `_1`)를 넣지 않는다.
  - 예: `minute-1`, `ticker-1` 금지
- 문서 제목의 공백/대문자/혼합 언어를 그대로 옮기지 않는다.
  - 예: `Recent Trades History`, `분minute-캔들-1` 금지
- camelCase, PascalCase, 한글, `post-*`, `delete-*` 형태는 금지한다.
- path의 핵심 명사를 버리고 의미를 재해석한 이름은 금지한다.
  - 예: `/trades/ticks` -> `list-recent-trades`
  - 예: `/withdraws/chance` -> `get-transfer-availability`

### 캔들 규칙

- 캔들 조회는 리소스 의미가 드러나도록 `...-candles`를 사용한다.
- 단위별 엔드포인트가 분리돼 있으면 아래처럼 작성한다.
  - `get-second-candles`
  - `get-minute-candles`
  - `get-day-candles`
  - `get-week-candles`
  - `get-month-candles`
- 단위를 파라미터로 전달하는 단일 엔드포인트면 `get-candles`를 사용한다.

### deprecated 규칙

- deprecated 엔드포인트도 동일한 규칙으로 이름을 짓는다.
- deprecated 여부는 `operationId`의 본문이 아니라 suffix `-deprecated`로만 표현한다.
- 예시
  - `get-ticker-deprecated`
  - `list-recent-trades-deprecated`

### 일관성 규칙

- 같은 의미의 기능은 거래소가 달라도 최대한 같은 동사 패턴을 사용한다.
- 단, 명사는 path의 핵심 리소스를 우선 보존한다.
- 예시
  - 주문 단건 조회: `get-order`
  - 주문 목록 조회: `list-orders`
  - 주문 생성: `create-order`
  - 주문 취소: `cancel-order`
  - 호가 조회: `get-orderbook`
  - 현재가 조회: `get-ticker` 또는 `list-tickers` (응답 형태에 따라 선택)

### 판단 기준

새 `operationId`를 추가하거나 수정할 때는 아래 질문에 모두 “예”라고 답할 수 있어야 한다.

1. 생성된 함수명으로 써도 자연스러운가?
2. 표준 동사(`get`, `list`, `create`, `cancel`, `verify`, `request`, `subscribe`, `receive`) 중 하나로 표현되는가?
3. 공식 문서 path의 핵심 명사가 이름에 유지되는가?
4. path에 없는 새로운 해석 명사를 임의로 추가하지 않았는가?
5. 단건/목록, 생성/취소/조회 의미가 이름만으로 드러나는가?

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

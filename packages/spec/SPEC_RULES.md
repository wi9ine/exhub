# 스펙 규칙 정의

이 문서는 exhub 프로젝트의 스펙 관련 규칙을 정의한다.
스펙은 두 종류의 SSOT로 구성된다.

| SSOT                            | 형식               | 역할                                                         |
| ------------------------------- | ------------------ | ------------------------------------------------------------ |
| **거래소 설정** (`config.yaml`) | YAML               | 인증, 크리덴셜, 카테고리 매핑 등 거래소 전체에 적용되는 정보 |
| **API 스펙** (`*.json`)         | OpenAPI / AsyncAPI | 엔드포인트, 파라미터, 응답 타입 등 API 계약                  |

이 두 소스에서 아래 산출물이 자동 생성된다.

```
config.yaml + OpenAPI/AsyncAPI 스펙
  → Axios 클라이언트 (packages/{exchange}/src/generated/)
  → TypeScript 타입 (packages/{exchange}/src/generated/model/)
  → Zod 검증 스키마 (packages/{exchange}/src/generated-zod/)
  → 클라이언트 래퍼 (packages/{exchange}/src/lib/)
  → MCP 도구 정의 (apps/mcp/src/generated/)
```

---

## 1. 디렉터리 구조

```
packages/spec/
├── SPEC_RULES.md              # 이 문서
├── {exchange}/
│   ├── config.yaml            # 거래소 설정 (SSOT)
│   ├── rest/
│   │   ├── public-api.json    # OpenAPI 3.0.1 (public)
│   │   ├── private-api.json   # OpenAPI 3.0.1 (private)
│   │   └── ...                # 거래소에 따라 파일 분리 가능
│   └── ws/
│       └── websocket-api.json # AsyncAPI 2.6.0
└── ...
```

- 거래소 디렉터리명은 영문 소문자 (`upbit`, `bithumb`, `coinone`, `korbit`, `gopax`)
- REST 스펙 파일명은 `{access}-api.json` 형태를 기본으로 하되, Upbit처럼 공식 문서 구분이 다르면 `quotation-api.json`, `exchange-api.json` 등 허용

---

## 2. config.yaml 스키마

### 2.1 전체 구조

```yaml
name: string # 필수. 패키지명/식별자 (영문 소문자)
displayName: string # 필수. UI/로깅용 표시명

auth: # 필수. 인증 설정
  type: string # 필수. 인증 방식
  hashAlgorithm: string # 필수. 해시 알고리즘
  credentialFields: # 필수. 인증 필드 정의
    { fieldName }: string
  envVars: # 필수. 환경변수 매핑
    { fieldName }: string
  autoInjectedParams: string[] # 선택. SDK 자동 주입 파라미터
  optionalParams: # 선택. 선택적 전역 설정
    { paramName }:
      type: string
      envVar: string

specs: # 필수. API 스펙 매핑
  rest:
    - id: string
      path: string
      access: string
  ws:
    - id: string
      path: string

categories: # 필수. 카테고리 매핑
  { categoryName }:
    tags: string[] # tags 또는 operationIds 중 하나 필수
    operationIds: string[]
```

### 2.2 필드 상세

#### `name`

- 패키지 디렉터리명과 동일하게 유지 (예: `upbit`)
- `packages/{name}`으로 패키지 생성, 코드 내 식별자로 사용

#### `displayName`

- 한글 또는 영문 표시명 (예: `업비트`, `Upbit`)

#### `auth`

| 필드                 | 타입     | 필수 | 설명                                                    |
| -------------------- | -------- | :--: | ------------------------------------------------------- |
| `type`               | enum     |  O   | 인증 방식: `jwt-hs256`, `hmac-sha256`, `custom-header`  |
| `hashAlgorithm`      | enum     |  O   | 해시 알고리즘: `sha256`, `sha512`                       |
| `credentialFields`   | map      |  O   | 인증에 필요한 필드. 키: 필드명, 값: 타입 (`string`)     |
| `envVars`            | map      |  O   | `credentialFields`와 1:1 대응하는 환경변수명            |
| `autoInjectedParams` | string[] |  -   | SDK가 자동 주입하는 파라미터명. 생성 타입에서 Omit 처리 |
| `optionalParams`     | map      |  -   | 선택적 전역 설정 (예: `recvWindow`)                     |

**규칙:**

- `credentialFields`와 `envVars`의 키는 반드시 1:1 대응
- `autoInjectedParams`는 해당 거래소의 **모든** private 엔드포인트에 공통 적용
- `envVars`의 값은 `EXHUB_{EXCHANGE}_{FIELD}` 네이밍 컨벤션 권장

#### `specs`

| 필드            | 타입   | 필수 | 설명                                               |
| --------------- | ------ | :--: | -------------------------------------------------- |
| `rest[].id`     | string |  O   | 스펙 식별자 (예: `quotation`, `public`, `private`) |
| `rest[].path`   | string |  O   | config.yaml 기준 상대 경로                         |
| `rest[].access` | enum   |  O   | `public` 또는 `private`                            |
| `ws[].id`       | string |  O   | 스펙 식별자 (예: `websocket`)                      |
| `ws[].path`     | string |  O   | config.yaml 기준 상대 경로                         |

**규칙:**

- `access`는 해당 스펙 파일 내 모든 엔드포인트의 기본 접근 수준
- OpenAPI `security` 필드와 일치해야 함 (public 스펙에는 security 없음/빈 배열, private 스펙에는 securitySchemes 정의)

#### `categories`

| 필드             | 타입        |  필수  | 설명                                     |
| ---------------- | ----------- | :----: | ---------------------------------------- |
| `{categoryName}` | string (키) |   O    | camelCase 영문. 클라이언트 메서드 그룹명 |
| `tags`           | string[]    | 조건부 | OpenAPI tags 값 목록                     |
| `operationIds`   | string[]    | 조건부 | operationId 목록                         |

**규칙:**

- `tags` 또는 `operationIds` 중 하나는 반드시 존재
- `tags` 우선 사용. tags가 카테고리 구분에 부적합한 경우에만 `operationIds` 사용
- 카테고리 키는 생성 코드에서 그대로 사용됨:
  - 클라이언트 타입: `{Exchange}Client.{categoryName}.{methodName}()`
  - 클라이언트 구현: `{ {categoryName}: { {methodName}: ... } }`
  - MCP 도구명: `{exchange}_{categoryName}_{methodName}`
- 하나의 operation은 반드시 하나의 카테고리에만 속함
- 모든 operation이 어떤 카테고리에든 매핑되어야 함 (누락 시 생성 에러)

**카테고리 매핑 흐름:**

```
OpenAPI 스펙의 operation
  → tags 필드 확인
  → config.yaml categories에서 해당 tag를 가진 카테고리 조회
  → 매핑된 categoryName으로 코드 생성
```

tags 기반 매핑 예시:

```yaml
# OpenAPI: "tags": ["주문(Order)"]  →  카테고리: orders
categories:
  orders:
    tags: ["주문(Order)"]
```

operationIds 기반 매핑 예시 (tags가 부적합한 경우):

```yaml
# Coinone처럼 tags가 "PUBLIC API V2"인 경우
categories:
  market:
    operationIds:
      - get-range-unit
      - list-markets
      - get-orderbook
```

---

## 3. OpenAPI 스펙 필드 규칙

### 3.1 표준 필드 사용 규칙

| 필드              | 규칙                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `openapi`         | `"3.0.1"` 고정                                                                            |
| `info.title`      | `"{Exchange} {API 구분} API"` (예: `"Upbit Quotation API"`)                               |
| `info.version`    | 공식 문서 버전과 동일하게 유지                                                            |
| `servers[].url`   | base URL. 경로에 버전 포함 가능 (예: `https://api.upbit.com/v1`)                          |
| `operationId`     | **필수.** 별도 규칙 문서(operationId 규칙) 참조                                           |
| `tags`            | **필수.** 각 operation에 반드시 1개 지정. config.yaml 카테고리 매핑의 키로 사용           |
| `summary`         | **필수.** 한국어 한 줄 설명. MCP 도구 설명으로 사용                                       |
| `parameters`      | 인증용 파라미터도 스펙에 포함 (SDK가 config.yaml `autoInjectedParams` 기반으로 Omit 처리) |
| `in: "path"`      | 경로 파라미터는 반드시 `in: "path"` 명시                                                  |
| `security`        | private 스펙: 루트 레벨에 선언. public 스펙: 생략 또는 `[]`                               |
| `securitySchemes` | private 스펙에만 정의. 거래소 인증 방식에 맞게 작성                                       |

### 3.2 확장 필드

확장 필드는 **최소한으로** 사용한다. 현재 허용되는 확장 필드:

#### `x-sdk-defaults` (operation 레벨)

SDK에서 적용할 파라미터 기본값. OpenAPI 스키마의 `default`와는 구분된다.

- OpenAPI `default`: API 서버 측 기본값 (공식 문서에 명시된 것)
- `x-sdk-defaults`: SDK 클라이언트 편의를 위한 기본값 (공식 문서에 없지만 SDK에서 제공)

```jsonc
{
  "operationId": "get-minute-candles",
  "x-sdk-defaults": {
    "unit": 1,
  },
}
```

| 속성             | 타입                  | 설명                               |
| ---------------- | --------------------- | ---------------------------------- |
| `x-sdk-defaults` | `Record<string, any>` | 파라미터명을 키로, 기본값을 값으로 |

**규칙:**

- API 서버의 기본값은 OpenAPI 스키마의 `default` 필드 사용
- `x-sdk-defaults`는 서버 기본값이 없지만 SDK 사용성을 위해 제공하는 경우에만 사용
- 대상 파라미터는 반드시 `parameters`에 정의되어 있어야 함

#### `x-readme` (operation 레벨, 기존 유지)

공식 문서의 코드 샘플. 기존에 사용 중이며 코드 생성에는 영향 없음.

```jsonc
{
  "x-readme": {
    "code-samples": [{ "language": "curl", "code": "..." }],
  },
}
```

#### `x-doc-url` (operation 레벨, 기존 유지)

공식 문서 URL. 참조용이며 코드 생성에는 영향 없음.

### 3.3 사용하지 않는 확장 필드

아래 정보는 **config.yaml에서 관리**하며 OpenAPI 스펙에 추가하지 않는다.

| 정보                             | 이유                                                             |
| -------------------------------- | ---------------------------------------------------------------- |
| 카테고리 (`x-category`)          | tags + config.yaml 매핑으로 충분                                 |
| 접근 수준 (`x-access`)           | `security` 필드 + config.yaml `specs[].access`로 결정            |
| 인증 Omit 대상 (`x-auth-params`) | 거래소 전체 공통이므로 config.yaml `autoInjectedParams`에서 관리 |
| 크리덴셜 정보 (`x-credentials`)  | API 계약이 아닌 구현 사항이므로 config.yaml `auth`에서 관리      |

---

## 4. AsyncAPI 스펙 필드 규칙

### 4.1 표준 필드 사용 규칙

| 필드                       | 규칙                                                              |
| -------------------------- | ----------------------------------------------------------------- |
| `asyncapi`                 | `"2.6.0"` 고정                                                    |
| `id`                       | `"urn:exhub:asyncapi:{exchange}:ws"`                              |
| `info.title`               | `"{Exchange} WebSocket API"`                                      |
| `servers`                  | `public`, `private`으로 명명하여 접근 수준 구분                   |
| `servers.{name}.url`       | WebSocket 접속 URL                                                |
| `servers.{name}.protocol`  | `"wss"`                                                           |
| `servers.{name}.security`  | private 서버에만 선언                                             |
| `channels.{name}`          | 채널명이 곧 구독 토픽. camelCase 사용                             |
| `publish` (operation)      | 클라이언트 → 서버 (구독 요청). operationId: `subscribe-{channel}` |
| `subscribe` (operation)    | 서버 → 클라이언트 (데이터 수신). operationId: `receive-{channel}` |
| `components.messages.{id}` | messageId: `{exchange}.ws.{channel}.{kind}` (kebab-case)          |

### 4.2 확장 필드

**없음.** AsyncAPI 표준 필드로 충분하다.

- public/private 구분: `servers` 분리 + `security`로 판별
- 카테고리: 채널명 자체가 카테고리 역할
- 연결 설정(reconnect, heartbeat 등): config.yaml에서 관리 (향후 필요 시 추가)

---

## 5. operationId 규칙

별도 문서로 관리하던 기존 규칙을 그대로 유지한다. 핵심만 요약:

- **형식**: ASCII 소문자 kebab-case (`get-orderbook`, `list-orders`)
- **패턴**: `동사-명사`
- **표준 동사**: `get`, `list`, `create`, `cancel`, `update`, `verify`, `request`
- **WebSocket**: `subscribe-*` (publish), `receive-*` (subscribe)
- **명사**: 공식 문서 path의 핵심 segment 유지
- **금지**: camelCase, PascalCase, 한글, 버전 접미사, path에 없는 임의 명사

상세 규칙은 기존 operationId 규칙 문서를 참조한다.

---

## 6. 검증 규칙

스펙 변경 시 아래 검증을 모두 통과해야 한다.

1. **스펙 유효성**: `pnpm validate` — OpenAPI/AsyncAPI 파서 검증
2. **config.yaml 무결성**:
   - `credentialFields`와 `envVars`의 키가 1:1 대응하는지
   - 모든 operation이 하나의 카테고리에 매핑되는지
   - `autoInjectedParams`의 파라미터가 실제 스펙에 존재하는지
3. **코드 생성**: `pnpm generate` — 생성 코드가 정상적으로 만들어지는지
4. **타입 검사**: `pnpm typecheck` — 생성된 코드의 타입이 올바른지

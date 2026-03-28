# 티커 응답 (TICKER)

금일과 전일의 시가,고가,종가,저가 정보에 대한 모니터링

특정 거래 종목의 티커 값이 변경될 때마다 해당 티커를 내려줍니다.

### Topic

| Fields           | Type   | Description |
| :--------------- | :----- | :---------- |
| quote\_currency  | string | 마켓 기준 통화    |
| target\_currency | string | 조회 요청할 종목   |

### Stream Fields

| Fields                      | Short field | Type   | Description                      |
| :-------------------------- | :---------- | :----- | :------------------------------- |
| response\_type              | r           | string | DATA로 고정                         |
| channel                     | c           | string | TICKER 고정                        |
| data                        | d           | object | 구독 data 정보                       |
| - quote\_currency           | qc          | string | 마켓 기준 통화 (예: KRW)                |
| -  target\_currency         | tc          | string | 조회한 종목의 심볼 (예: BTC)              |
| - timestamp                 | t           | long   | 타임스탬프 (millisecond)              |
| - quote\_volume             | qv          | string | 최근 24시간 기준 종목 체결 금액 (원화)         |
| - target\_volume            | tv          | string | 최근 24시간 기준 종목 체결량 (종목)           |
| - high                      | hi          | string | 고가 (UTC 기준)                      |
| - low                       | lo          | string | 저가 (UTC 기준)                      |
| - first                     | fi          | string | 시가 (UTC 기준)                      |
| - last                      | la          | string | 종가 (UTC 기준)                      |
| - volume\_power             | vp          | string | 24시간 체결 강도 (0% \~ 500%)          |
| - ask\_best\_price          | abp         | string | 매도 오더북상 제일 낮은 호가 , 존재하지 않으면 null |
| - ask\_best\_qty            | abq         | string | 매도 오더북상 제일 낮은 호가의 수량             |
| - bid\_best\_price          | bbp         | string | 매수 오더북상 제일 높은 호가 , 존재하지 않으면 null |
| - bid\_best\_qty            | bbq         | string | 매수 오더북상 제일 높은 호가의 수량             |
| - id                        | i           | string | 티커 별 ID 값으로 클수록 최신 티커 정보         |
| - yesterday\_high           | yhi         | string | 전일 고가 (UTC 기준)                   |
| - yesterday\_low            | ylo         | string | 전일 저가 (UTC 기준)                   |
| - yesterday\_first          | yfi         | string | 전일 시가 (UTC 기준)                   |
| - yesterday\_last           | yla         | string | 전일 종가 (UTC 기준)                   |
| - yesterday\_quote\_volume  | yqv         | string | 전일 24시간 기준 종목 체결 금액 (원화)         |
| - yesterday\_target\_volume | ytv         | string | 전일 24시간 기준 종목 체결량 (종목)           |

### 주문 응답 예시

#### DEFAULT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"TICKER",
  "topic":{
    "quote_currency":"KRW",
    "target_currency":"XRP"
  }
}
```

#### DEFAULT Format Response

```json
{
  "response_type":"SUBSCRIBED",
  "channel":"TICKER",
  "data":{
    "quote_currency":"KRW",
    "target_currency":"XRP"
  }
}
```

#### DEFAULT Format Stream

```json
{
  "response_type":"DATA",
  "channel":"TICKER",
  "data":{
    "quote_currency":"KRW",
    "target_currency":"XRP",
    "timestamp":1693560360010,
    "quote_volume":"55904975548.1528",
    "target_volume":"80021677.1681579",
    "high":"699.5",
    "low":"683.9",
    "first":"698.7",
    "last":"687.9",
    "volume_power":"100",
    "ask_best_price":"687.9",
    "ask_best_qty":"7594.1842",
    "bid_best_price":"687.8",
    "bid_best_qty":"13861.6179",
    "id":"1693560360010001",
    "yesterday_high":"717.5",
    "yesterday_low":"690.4",
    "yesterday_first":"716.9",
    "yesterday_last":"698.7",
    "yesterday_quote_volume":"41578655254.7044",
    "yesterday_target_volume":"58194911.41691376"
  }
}
```

#### SHORT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"TICKER",
  "topic":{
    "quote_currency":"KRW",
    "target_currency":"XRP"
  },
  "format":"SHORT"
}
```

#### SHORT Format Response

```json
{
  "response_type":"SUBSCRIBED",
  "channel":"TICKER",
  "data":{
    "quote_currency":"KRW",
    "target_currency":"XRP"
  }
}
```

#### SHORT Format Stream

```json
{
  "r":"DATA",
  "c":"TICKER",
  "d":{
    "qc":"KRW",
    "tc":"XRP",
    "t":1693560378928,
    "qv":"55827441390.8456",
    "tv":"79912892.7741579",
    "fi":"698.7",
    "lo":"683.9",
    "hi":"699.5",
    "la":"687.9",
    "vp":"100",
    "abp":"688.3",
    "abq":"84992.9448",
    "bbp":"687.8",
    "bbq":"13861.6179",
    "i":"1693560378928001",
    "yfi":"716.9",
    "ylo":"690.4",
    "yhi":"717.5",
    "yla":"698.7",
    "yqv":"41616318229.6505",
    "ytv":"58248252.35151376"
  }
}
```
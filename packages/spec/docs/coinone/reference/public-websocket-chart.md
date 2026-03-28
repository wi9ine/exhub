# 차트 응답 (CHART)

차트 변동 정보 모니터링

최신 차트 데이터가 변경될 경우 해당 데이터를 내려줍니다.

### Topic

| Fields           | Type   | Description                                                |
| :--------------- | :----- | :--------------------------------------------------------- |
| quote\_currency  | string | 마켓 기준 통화                                                   |
| target\_currency | string | 조회 요청할 종목                                                  |
| interval         | string | 분봉 : 1m, 3m, 5m, 15m, 30m 시간봉: 1h, 2h, 4h, 6h, 일봉 1d 주봉 1w |

### Stream Fields

| Fields              | Short field | Type   | Description              |
| :------------------ | :---------- | :----- | :----------------------- |
| response\_type      | r           | string | DATA로 고정                 |
| channel             | c           | string | CHART 로 고정               |
| data                | d           | object | 구독 data 정보               |
| - quote\_currency   | qc          | string | 마켓 기준 통화 (예: KRW)        |
| - target\_currency  | tc          | string | 조회한 종목의 심볼 (예: BTC)      |
| - interval          | iv          | string | 조회한 차트의 간격               |
| - timestamp         | t           | long   | 타임스탬프 (millisecond)      |
| - id                | i           | string | ID 값으로 클수록 최신 정보         |
| - candle\_timestamp | ct          | long   | 해당 캔들의 기준시각              |
| - high              | hi          | string | 고가 (UTC 기준)              |
| - low               | lo          | string | 저가 (UTC 기준)              |
| - first             | fi          | string | 시가 (UTC 기준)              |
| - last              | la          | string | 종가 (UTC 기준)              |
| - quote\_volume     | qv          | string | 최근 24시간 기준 종목 체결 금액 (원화) |
| - target\_volume    | tv          | string | 최근 24시간 기준 종목 체결량 (종목)   |

### 주문 응답 예시

#### DEFAULT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"CHART",
  "topic":{
    "quote_currency":"KRW",
    "target_currency":"XRP",
    "interval":"1m"
  }
}
```

#### DEFAULT Format Response

```json
{
  "response_type":"SUBSCRIBED",
  "channel":"CHART",
  "data":{
    "quote_currency":"KRW",
    "target_currency":"XRP",
    "interval":"1m"
  }
}
```

#### DEFAULT Format Stream

```json
{
  "response_type":"DATA",
  "channel":"CHART",
  "data":{
    "quote_currency":"KRW",
    "target_currency":"XRP",
    "interval":"1m",
    "timestamp": 1693560360010,
    "id":"1693560360010001",
    "candle_timestamp": 1693560360000,
    "high":"699.5",
    "low":"683.9",
    "first":"698.7",
    "last":"687.9",
    "quote_volume":"55904975548.1528",
    "target_volume":"80021677.1681579"
  }
}
```

#### SHORT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"CHART",
  "topic":{
    "quote_currency":"KRW",
    "target_currency":"XRP",
    "interval":"1m"
  },
  "format":"SHORT"
}
```

#### SHORT Format Response

```json
{
  "response_type":"SUBSCRIBED",
  "channel":"CHART",
  "data":{
    "quote_currency":"KRW",
    "target_currency":"XRP",
    "interval":"1m"
  }
}
```

#### SHORT Format Stream

```json
{
  "r":"DATA",
  "c":"CHART",
  "d":{
    "qc":"KRW",
    "tc":"XRP",
    "iv":"1m",
    "t": 1693560378928,
    "i":"1693560360010001",
    "ct": 1693560360000,
    "fi":"698.7",
    "lo":"683.9",
    "hi":"699.5",
    "la":"687.9",
    "qv":"55827441390.8456",
    "tv":"79912892.7741579"
  }
}
```
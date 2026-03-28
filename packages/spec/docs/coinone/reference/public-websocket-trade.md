# 체결정보 응답 (TRADE)

특정 종목의 체결 정보 모니터링

특정 거래 종목에 체결이 발생한 시점에 체결 정보를 내려줍니다.

### Topic

| Fields           | Type   | Description |
| :--------------- | :----- | :---------- |
| quote\_currency  | string | 마켓 기준 통화    |
| target\_currency | string | 조회 요청할 종목   |

### Stream Fields

| Fields              | Short field | Type    | Description              |
| :------------------ | :---------- | :------ | :----------------------- |
| response\_type      | r           | string  | DATA로 고정                 |
| channel             | c           | string  | TRADE로 고정                |
| data                | d           | object  | 구독 data 정보               |
| - quote\_currency   | qc          | string  | 마켓 기준 통화 (예: KRW)        |
| -  target\_currency | tc          | string  | 조회한 종목의 심볼 (예: BTC)      |
| - id                | i           | string  | 티커 별 ID 값으로 클수록 최신 티커 정보 |
| - timestamp         | t           | long    | 타임스탬프 (millisecond)      |
| - price             | p           | string  | 체결 가격                    |
| - qty               | q           | string  | 체결 수량                    |
| - is\_seller\_maker | sm          | boolean | 매도자가 maker인지 여부          |

### 주문 응답 예시

#### DEFAULT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"TRADE",
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
  "channel":"TRADE",
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
  "channel":"TRADE",
  "data":{
    "quote_currency":"KRW",
    "target_currency":"XRP",
    "id":"1693560450996001",
    "timestamp":1693560450996,
    "price":"688.3",
    "qty":"5000",
    "is_seller_maker":true
  }
}
```

#### SHORT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"TRADE",
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
  "channel":"TRADE",
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
  "c":"TRADE",
  "d":{
    "qc":"KRW",
    "tc":"XRP",
    "i":"1693560563084003",
    "t":1693560563084,
    "p":"688.3",
    "q":"290.745",
    "sm":false
  }
}
```
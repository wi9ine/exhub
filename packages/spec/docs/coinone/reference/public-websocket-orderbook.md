# 오더북 응답 (ORDERBOOK)

거래쌍의 오더북 모니터링

특정 마켓의 Orderbook에 변경이 있을 때마다 오더북 데이터를 내려줍니다.

최초 구독요청시 마지막 오더북을 1회 내려준 이후 이후 변경발생시 응답을 받게됩니다.

### Topic

| Fields           | Type   | Description |
| :--------------- | :----- | :---------- |
| quote\_currency  | string | 마켓 기준 통화    |
| target\_currency | string | 조회 요청할 종목   |

### Stream Fields

| Fields             | Short field | Type   | Description                                |
| :----------------- | :---------- | :----- | :----------------------------------------- |
| response\_type     | r           | string | DATA로 고정                                   |
| channel            | c           | string | ORDERBOOK 고정                               |
| data               | d           | object | 구독 data 정보                                 |
| - quote\_currency  | qc          | string | 마켓 기준 통화 (예: KRW)                          |
| - target\_currency | tc          | string | 조회한 종목의 심볼 (예: BTC)                        |
| - timestamp        | t           | long   | 타임스탬프 (millisecond)                        |
| - id               | i           | string | order book id 값, id 값이 클수록 최신 OrderBook 정보 |
| - asks             | a           | object | 매도 오더북 정보                                  |
| -- price           | p           | string | 매도 호가                                      |
| -- qty             | q           | string | 매도 수량                                      |
| - bids             | b           | object | 매수 오더북 정보                                  |
| -- price           | p           | string | 매수 호가                                      |
| -- qty             | q           | string | 매수 수량                                      |

### 주문 응답 예시

#### DEFAULT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"ORDERBOOK",
  "topic":{
    "quote_currency":"KRW","target_currency":"XRP"
  }
}
```

#### DEFAULT Format Response

```json
{
  "response_type":"SUBSCRIBED",
  "channel":"ORDERBOOK",
  "data":{
    "quote_currency":"KRW","target_currency":"XRP"
  }
}
```

#### DEFAULT Format Stream

```json
{
  "response_type":"DATA",
  "channel":"ORDERBOOK",
  "data":{
    "quote_currency":"KRW",
    "target_currency":"XRP",
    "timestamp":1693560155038,
    "id":"1693560155038001",
    "asks":[{
      "price":"695.5",
      "qty":"5000"
    },{
      "price":"692.1",
      "qty":"15000"
    },{
      "price":"690.9",
      "qty":"118063.7475"
    },{
      "price":"690.3",
      "qty":"148087.1739"
    },{
      "price":"689.6",
      "qty":"68224.2457"
    },{
      "price":"689.5",
      "qty":"186287.9931"
    },{
      "price":"689.4",
      "qty":"71662.5113"
    },{
      "price":"688.9",
      "qty":"76424.6626"
    },{
      "price":"688.7",
      "qty":"186287.9931"
    },{
      "price":"688.6",
      "qty":"52112.0062"
    },{
      "price":"688.3",
      "qty":"84992.9448"
    },{
      "price":"687.9",
      "qty":"8934.5617"
    },{
      "price":"687.8",
      "qty":"89196.0133"
    },{
      "price":"687.7",
      "qty":"40036.8193"
    },{
      "price":"687.6",
      "qty":"85887.7396"
    },{
      "price":"687.5",
      "qty":"47022.8803"
    }],
    "bids":[{
      "price":"687.4",
      "qty":"6704.0994"
    },{
      "price":"687.3",
      "qty":"4542.9611"
    },{
      "price":"687.2",
      "qty":"71156.78279601"
    },{
      "price":"687.1",
      "qty":"53780.7146"
    },{
      "price":"686.9",
      "qty":"70626.7082"
    },{
      "price":"686.7",
      "qty":"21916.4"
    },{
      "price":"686.2",
      "qty":"83681.5566"
    },{
      "price":"686.1",
      "qty":"68713.9938"
    },{
      "price":"686",
      "qty":"40924.2591"
    },{
      "price":"685.9",
      "qty":"50582.5608"
    },{
      "price":"685.8",
      "qty":"76424.6626"
    },{
      "price":"685.7",
      "qty":"15156.0563"
    },{
      "price":"685.5",
      "qty":"2217.4175"
    },{
      "price":"685.4",
      "qty":"53224.163"
    },{
      "price":"685.3",
      "qty":"71617.0263"
    },{
      "price":"685.2",
      "qty":"39610.424"
    }]
  }
}
```

#### SHORT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"ORDERBOOK",
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
  "channel":"ORDERBOOK",
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
  "c":"ORDERBOOK",
  "d":{
    "qc":"KRW",
    "tc":"XRP",
    "t":1693560323040,
    "i":"1693560323040001",
    "a":[
      {
        "p":"692.1",
        "q":"15000"
      },
      {
        "p":"692",
        "q":"33963.7467"
      },
      {
        "p":"690.9",
        "q":"118063.7475"
      },
      {
        "p":"690.3",
        "q":"148087.1739"
      },
      {
        "p":"690.1",
        "q":"76424.6626"
      },
      {
        "p":"690",
        "q":"186287.9931"
      },
      {
        "p":"689.6",
        "q":"186287.9931"
      },
      {
        "p":"689.5",
        "q":"186287.9931"
      },
      {
        "p":"689.4",
        "q":"152849.3252"
      },
      {
        "p":"689",
        "q":"23990.198"
      },{
        "p":"688.9",
        "q":"81424.6626"
      },{
        "p":"688.7",
        "q":"186287.9931"
      },{
        "p":"688.6",
        "q":"85010.5464"
      },{
        "p":"688.3",
        "q":"84992.9448"
      },{
        "p":"687.9",
        "q":"8046.2201"
      },{
        "p":"687.8",
        "q":"5541.7343"
      }],
    "b":[
      {
        "p":"687.7",
        "q":"26178.9839"
      },{
        "p":"687.6",
        "q":"17821.3816"
      },{
        "p":"687.5",
        "q":"53004.6312"
      },{
        "p":"687.4",
        "q":"15639.9728"
      },{
        "p":"687.3",
        "q":"62504.6275"
      },{
        "p":"687.2",
        "q":"71156.78279601"
      },{
        "p":"686.9",
        "q":"39772.0921"
      },{
        "p":"686.8",
        "q":"22095.4179"
      },{
        "p":"686.7",
        "q":"10100"
      },{
        "p":"686.2",
        "q":"88681.5566"
      },{
        "p":"686.1",
        "q":"68713.9938"
      },{
        "p":"686",
        "q":"40924.2591"
      },{
        "p":"685.9",
        "q":"50582.5608"
      },{
        "p":"685.8",
        "q":"16883.2591"
      },{
        "p":"685.7",
        "q":"15156.0563"
      },{
        "p":"685.5",
        "q":"2217.4175"
      }]
  }
}
```
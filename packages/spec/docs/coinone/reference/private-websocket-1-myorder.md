# 내 주문 변동 (MYORDER)

내 주문의 생성, 체결, 취소를 모니터링

전체 거래 종목 또는 특정 거래 종목에 대해 주문, 체결, 취소가 발생할 때 해당 내용이 실시간 스트림으로 전송됩니다.

### Topic

| Fields           | Type   | Description |
| :--------------- | :----- | :---------- |
| quote\_currency  | string | 마켓 기준 통화    |
| target\_currency | string | 조회 요청할 종목   |

### Stream Fields

| Fields                | Short field | Type           | Description                                          |
| :-------------------- | :---------- | :------------- | :--------------------------------------------------- |
| response\_type        | r           | string         | DATA로 고정                                             |
| channel               | c           | string         | MYORDER 고정                                           |
| data                  | d           | object         | 구독 data 정보                                           |
| - quote\_currency     | qc          | string         | 마켓 기준 통화 (예: KRW)                                    |
| - target\_currency    | tc          | string         | 주문 종목 심볼 (예: BTC)                                    |
| - order\_id           | oi          | string         | 주문 식별 ID (예: "0e30219d-1e4d-11e9-9ec7-00e04c3600d7") |
| - type                | t           | string         | 주문 방식 (Enum: "LIMIT", "MARKET")                      |
| - status              | st          | string         | 주문 진행 상태 (아래 status 표 참고)                            |
| - side                | s           | string         | 매수/매도 여부 (Enum: "BID", "ASK")                        |
| - order\_price        | op          | string \| null | 주문 가격                                                |
| - order\_qty          | oq          | string \| null | 주문 수량 (지정가, 시장가매도, 예약)                               |
| - order\_amount       | oa          | string \| null | 주문 금액 (시장가 매수)                                       |
| - trade\_id           | ti          | string \| null | 체결 식별 ID (예: "0e30219d-1e4d-11e9-9ec7-00e04c3600d7") |
| - is\_maker           | im          | string \| null | true: 메이커, false: 테이커                                |
| - executed\_price     | ep          | string \| null | 체결 가격                                                |
| - executed\_qty       | eq          | string \| null | 체결수량 또는 취소수량                                         |
| - executed\_fee       | ef          | string \| null | 체결시 발생한 수수료                                          |
| - remain\_qty         | rq          | string \| null | 체결/취소 후 잔량 (지정가, 시장가매도, 예약)                          |
| - remain\_amount      | ra          | string \| null | 체결/취소 후 잔량 금액 (시장가 매수)                               |
| - user\_order\_id     | ui          | string \| null | 사용자 정의 주문 id                                         |
| - executed\_timestamp | et          | long \| null   | 체결/취소 타임스탬프                                          |
| - order\_timestamp    | ot          | long \| null   | 주문 타임스탬프                                             |
| - timestamp           | ts          | long           | 타임스탬프                                                |

#### 주문 진행 상태

| Status                  | 설명                 |
| :---------------------- | :----------------- |
| wait                    | 체결 대기              |
| watch or not\_triggered | 예약 주문 대기           |
| trade                   | 체결                 |
| trade\_done             | 체결 완료              |
| cancel                  | 취소                 |
| cancel\_post\_only      | Post-only 주문 실패 취소 |

### MYORDER 데이터 예시

#### DEFAULT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"MYORDER",
  "topic":[{
    "quote_currency":"KRW","target_currency":"XRP"
  }]
}
```

#### DEFAULT Format Response

```json
{
  "response_type":"SUBSCRIBED",
  "channel":"MYORDER",
  "data":[{
    "quote_currency":"KRW","target_currency":"XRP"
  }]
}
```

#### DEFAULT Format Stream

```json 체결대기
{
  "response_type": "DATA",
  "channel": "MYORDER",
  "data": {
    "quote_currency": "KRW",
    "target_currency": "ETH",
    "order_id": "1b48b023-1e4d-11e9-9ec7-00e04c3600d7",
    "type": "LIMIT",
    "status": "wait",
    "side": "BID",
    "order_price": "6000000.0000",
    "order_qty": "1.00000000",
    "order_amount": null,
    "trade_id": null,
    "is_maker": null,
    "executed_price": null,
    "executed_qty": null,
    "executed_fee": null,
    "remain_qty": null,
    "remain_amount": null,
    "user_order_id": "74cd2974-b006-4773-a462-717b026f2778",
    "prevented_qty": null,
    "executed_timestamp": null,
    "order_timestamp": 1761017305,
    "timestamp": 1761017305
  }
}
```
```json 예약 주문 대기
{
  "response_type": "DATA",
  "channel": "MYORDER",
  "data": {
    "quote_currency": "KRW",
    "target_currency": "ETH",
    "order_id": "1b48b028-1e4d-11e9-9ec7-00e04c3600d7",
    "type": "LIMIT",
    "status": "watch",
    "side": "BID",
    "order_price": "6234000.0000",
    "order_qty": "1.00000000",
    "order_amount": null,
    "trade_id": null,
    "is_maker": null,
    "executed_price": null,
    "executed_qty": null,
    "executed_fee": null,
    "remain_qty": null,
    "remain_amount": null,
    "user_order_id": "80744d42-6c89-4ab4-ac7a-1f46e2c7a04b",
    "prevented_qty": null,
    "executed_timestamp": 1761022828,
    "order_timestamp": null,
    "timestamp": 1761022828
  }
}
```
```json 체결
{
  "response_type": "DATA",
  "channel": "MYORDER",
  "data": {
    "quote_currency": "KRW",
    "target_currency": "ETH",
    "order_id": "1b48b02b-1e4d-11e9-9ec7-00e04c3600d7",
    "type": "LIMIT",
    "status": "trade",
    "side": "BID",
    "order_price": null,
    "order_qty": null,
    "order_amount": null,
    "trade_id": "1e9c062e-1e4d-11e9-9ec7-00e04c3600d7",
    "is_maker": false,
    "executed_price": "6244000",
    "executed_qty": "0.01",
    "executed_fee": "0.00000000",
    "remain_qty": "0.00000000",
    "remain_amount": "0",
    "user_order_id": "80744d42-6c89-4ab4-ac7a-1f46e2c7a041",
    "prevented_qty": null,
    "executed_timestamp": 1761024895,
    "order_timestamp": 1761024895,
    "timestamp": 1761024907
  }
}
```
```json 체결 완료
{
  "response_type": "DATA",
  "channel": "MYORDER",
  "data": {
    "quote_currency": "KRW",
    "target_currency": "ETH",
    "order_id": "1b48b02b-1e4d-11e9-9ec7-00e04c3600d7",
    "type": "LIMIT",
    "status": "trade_done",
    "side": "BID",
    "order_price": null,
    "order_qty": null,
    "order_amount": null,
    "trade_id": "1e9c062e-1e4d-11e9-9ec7-00e04c3600d7",
    "is_maker": false,
    "executed_price": "6244000",
    "executed_qty": "0.01",
    "executed_fee": "0.00000000",
    "remain_qty": "0.00000000",
    "remain_amount": "0",
    "user_order_id": "80744d42-6c89-4ab4-ac7a-1f46e2c7a041",
    "prevented_qty": null,
    "executed_timestamp": 1761024895,
    "order_timestamp": 1761024895,
    "timestamp": 1761024907
  }
}
```
```json 취소
{
  "response_type": "DATA",
  "channel": "MYORDER",
  "data": {
    "quote_currency": "KRW",
    "target_currency": "ETH",
    "order_id": "1b48b029-1e4d-11e9-9ec7-00e04c3600d7",
    "type": "LIMIT",
    "status": "cancel",
    "side": "ASK",
    "order_price": null,
    "order_qty": null,
    "order_amount": null,
    "trade_id": null,
    "is_maker": null,
    "executed_price": null,
    "executed_qty": "0.07520000",
    "executed_fee": null,
    "remain_qty": "0.00000000",
    "remain_amount": null,
    "user_order_id": null,
    "prevented_qty": null,
    "executed_timestamp": 1761023061,
    "order_timestamp": null,
    "timestamp": 1761025545
  }
}
```
```json Post-only 주문 실패 취소
{
  "response_type": "DATA",
  "channel": "MYORDER",
  "data": {
    "quote_currency": "KRW",
    "target_currency": "ETH",
    "order_id": "1b48b02c-1e4d-11e9-9ec7-00e04c3600d7",
    "type": "LIMIT",
    "status": "cancel_post_only",
    "side": "BID",
    "order_price": null,
    "order_qty": null,
    "order_amount": null,
    "trade_id": null,
    "is_maker": null,
    "executed_price": null,
    "executed_qty": "0.01000000",
    "executed_fee": null,
    "remain_qty": null,
    "remain_amount": null,
    "user_order_id": "80744d42-6c89-4ab4-ac7a-1f46e2c7a042",
    "prevented_qty": null,
    "executed_timestamp": 0,
    "order_timestamp": null,
    "timestamp": 1761025685
  }
}
```

#### SHORT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"MYORDER",
  "topic":[{
    "quote_currency":"KRW",
    "target_currency":"XRP"
  }],
  "format":"SHORT"
}
```

#### SHORT Format Response

```json
{
  "response_type":"SUBSCRIBED",
  "channel":"MYORDER",
  "data":[{
    "quote_currency":"KRW",
    "target_currency":"XRP"
  }]
}
```

#### SHORT Format Stream

```json 체결대기
{
  "r": "DATA",
  "c": "MYORDER",
  "d": {
    "qc": "KRW",
    "tc": "ETH",
    "oi": "1b48b023-1e4d-11e9-9ec7-00e04c3600d7",
    "t": "LIMIT",
    "st": "wait",
    "s": "BID",
    "op": "6000000.0000",
    "oq": "1.00000000",
    "oa": null,
    "ti": null,
    "im": null,
    "ep": null,
    "eq": null,
    "ef": null,
    "rq": null,
    "ra": null,
    "ui": "74cd2974-b006-4773-a462-717b026f2778",
    "pq": null,
    "et": null,
    "ot": 1761017305,
    "ts": 1761017305
  }
}
```
```json 예약 주문 대기
{
  "r": "DATA",
  "c": "MYORDER",
  "d": {
    "qc": "KRW",
    "tc": "ETH",
    "oi": "1b48b028-1e4d-11e9-9ec7-00e04c3600d7",
    "t": "LIMIT",
    "st": "watch",
    "s": "BID",
    "op": "6234000.0000",
    "oq": "1.00000000",
    "oa": null,
    "ti": null,
    "im": null,
    "ep": null,
    "eq": null,
    "ef": null,
    "rq": null,
    "ra": null,
    "ui": "80744d42-6c89-4ab4-ac7a-1f46e2c7a04b",
    "pq": null,
    "et": 1761022828,
    "ot": null,
    "ts": 1761022828
  }
}
```
```json 체결
{
  "r": "DATA",
  "c": "MYORDER",
  "d": {
    "qc": "KRW",
    "tc": "ETH",
    "oi": "1b48b02b-1e4d-11e9-9ec7-00e04c3600d7",
    "t": "LIMIT",
    "st": "trade",
    "s": "BID",
    "op": null,
    "oq": null,
    "oa": null,
    "ti": "1e9c062e-1e4d-11e9-9ec7-00e04c3600d7",
    "im": false,
    "ep": "6244000",
    "eq": "0.01",
    "ef": "0.00000000",
    "rq": "0.00000000",
    "ra": "0",
    "ui": "80744d42-6c89-4ab4-ac7a-1f46e2c7a041",
    "pq": null,
    "et": 1761024895,
    "ot": 1761024895,
    "ts": 1761024907
  }
}
```
```json 체결 완료
{
  "r": "DATA",
  "c": "MYORDER",
  "d": {
    "qc": "KRW",
    "tc": "ETH",
    "oi": "1b48b02b-1e4d-11e9-9ec7-00e04c3600d7",
    "t": "LIMIT",
    "st": "trade_done",
    "s": "BID",
    "op": null,
    "oq": null,
    "oa": null,
    "ti": "1e9c062e-1e4d-11e9-9ec7-00e04c3600d7",
    "im": false,
    "ep": "6244000",
    "eq": "0.01",
    "ef": "0.00000000",
    "rq": "0.00000000",
    "ra": "0",
    "ui": "80744d42-6c89-4ab4-ac7a-1f46e2c7a041",
    "pq": null,
    "et": 1761024895,
    "ot": 1761024895,
    "ts": 1761024907
  }
}
```
```json 취소
{
  "r": "DATA",
  "c": "MYORDER",
  "d": {
    "qc": "KRW",
    "tc": "ETH",
    "oi": "1b48b029-1e4d-11e9-9ec7-00e04c3600d7",
    "t": "LIMIT",
    "st": "cancel",
    "s": "ASK",
    "op": null,
    "oq": null,
    "oa": null,
    "ti": null,
    "im": null,
    "ep": null,
    "eq": "0.07520000",
    "ef": null,
    "rq": "0.00000000",
    "ra": null,
    "ui": null,
    "pq": null,
    "et": 1761023061,
    "ot": null,
    "ts": 1761025545
  }
}
```
```json Post-only 주문 실패 취소
{
  "r": "DATA",
  "c": "MYORDER",
  "d": {
    "qc": "KRW",
    "tc": "ETH",
    "oi": "1b48b02c-1e4d-11e9-9ec7-00e04c3600d7",
    "t": "LIMIT",
    "st": "cancel_post_only",
    "s": "BID",
    "op": null,
    "oq": null,
    "oa": null,
    "ti": null,
    "im": null,
    "ep": null,
    "eq": "0.01000000",
    "ef": null,
    "rq": null,
    "ra": null,
    "ui": "80744d42-6c89-4ab4-ac7a-1f46e2c7a042",
    "pq": null,
    "et": 0,
    "ot": null,
    "ts": 1761025685
  }
}
```
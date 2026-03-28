# 내 자산 변동 (MYASSET)

내 잔고변동을 모니터링

전체 종목의 잔고 변경이 발생할 때 변동 후 잔고 내역이 실시간 스트림으로 전송됩니다.

<br />

### Stream Fields

| Fields            | Short field | Type           | Description                                          |
| :---------------- | :---------- | :------------- | :--------------------------------------------------- |
| response\_type    | r           | string         | DATA로 고정                                             |
| channel           | c           | string         | MYASSET 고정                                           |
| data              | d           | object         | 구독 data 정보                                           |
| - order\_id       | oi          | string \| null | 주문 식별 ID (예: "0e30219d-1e4d-11e9-9ec7-00e04c3600d7") |
| - user\_order\_id | ui          | string \| null | 사용자 정의 주문 id                                         |
| - trade\_id       | ti          | string \| null | 체결 식별 ID (예: "0e30219d-1e4d-11e9-9ec7-00e04c3600d7") |
| - assets          | as          | Array\[Object] | 변동 자산 목록                                             |
| -- currency       | c           | string         | 코인 심볼 (예: "BTC")                                     |
| -- available      | a           | string         | 주문가능 수량                                              |
| -- limit          | l           | string         | 가용 잔고 ('available’과 ‘limit’의 합이 전체 잔고)               |
| -- type           | t           | string         | 잔고 변경 사유 (아래 type 표 참고)                              |
| -- timestamp      | ts          | long           | 타임스탬프                                                |

#### 잔고 변경 사유

| Type               | 설명                     |
| :----------------- | :--------------------- |
| deposit            | 입금                     |
| withdrawal         | 출금                     |
| cancel\_withdrawal | 출금 취소                  |
| order              | 주문                     |
| trade              | 체결                     |
| cancel             | 주문 취소                  |
| cancel\_post\_only | Post-only 주문 실패로 인한 취소 |

### MYORDER 데이터 예시

#### DEFAULT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"MYASSET"
}
```

#### DEFAULT Format Response

```json
{
  "response_type":"SUBSCRIBED",
  "channel":"MYASSET"
}
```

#### DEFAULT Format Stream

```json 입금
{
  "response_type": "DATA",
  "channel": "MYASSET",
  "data": {
    "assets": [
      {
        "currency": "KRW",
        "available": "205620364.5029",
        "limit": "8400.0000"
      }
    ],
    "type": "deposit",
    "timestamp": 1760939843
  }
}
```
```json 출금
{
  "response_type": "DATA",
  "channel": "MYASSET",
  "data": {
    "assets": [
      {
        "currency": "KRW",
        "available": "205619364.5029",
        "limit": "8400.0000"
      }
    ],
    "type": "withdrawal",
    "timestamp": 1760940999
  }
}
```
```json 출금 취소
{
  "response_type": "DATA",
  "channel": "MYASSET",
  "data": {
    "assets": [
      {
        "currency": "KRW",
        "available": "205611364.5029",
        "limit": "8400.0000"
      }
    ],
    "type": "cancel_withdrawal",
    "timestamp": 1760941808
  }
}
```
```json 주문
{
  "response_type": "DATA",
  "channel": "MYASSET",
  "data": {
    "assets": [
      {
        "currency": "ETH",
        "available": "55.64169518",
        "limit": "1.00000000"
      }
    ],
    "type": "order",
    "timestamp": 1760937483
  }
}
```
```json 체결
{
  "response_type": "DATA",
  "channel": "MYASSET",
  "data": {
    "assets": [
      {
        "currency": "KRW",
        "available": "154902734.0029",
        "limit": "8400.0000"
      },
      {
        "currency": "ETH",
        "available": "55.64169518",
        "limit": "0.09890000"
      }
    ],
    "type": "trade",
    "timestamp": 1760937483
  }
}
```
```json 주문 취소
{
  "response_type": "DATA",
  "channel": "MYASSET",
  "data": {
    "assets": [
      {
        "currency": "KRW",
        "available": "155520364.5029",
        "limit": "8400.0000"
      }
    ],
    "type": "cancel",
    "timestamp": 1760938364
  }
}
```

#### SHORT Format Request

```json
{
  "request_type":"SUBSCRIBE",
  "channel":"MYASSET",
  "format":"SHORT"
}
```

#### SHORT Format Response

```json
{
  "response_type":"SUBSCRIBED",
  "channel":"MYASSET"
}
```

#### SHORT Format Stream

```json 입금
{
  "r": "DATA",
  "c": "MYASSET",
  "d": {
    "as": [
      {
        "c": "KRW",
        "a": "205620364.5029",
        "l": "8400.0000"
      }
    ],
    "t": "deposit",
    "ts": 1760939843
  }
}
```
```json 출금
{
  "r": "DATA",
  "c": "MYASSET",
  "d": {
    "as": [
      {
        "c": "KRW",
        "a": "205619364.5029",
        "l": "8400.0000"
      }
    ],
    "t": "withdrawal",
    "ts": 1760940999
  }
}
```
```json 출금 취소
{
  "r": "DATA",
  "c": "MYASSET",
  "d": {
    "as": [
      {
        "c": "KRW",
        "a": "205611364.5029",
        "l": "8400.0000"
      }
    ],
    "t": "cancel_withdrawal",
    "ts": 1760941808
  }
}
```
```json 주문
{
  "r": "DATA",
  "c": "MYASSET",
  "d": {
    "as": [
      {
        "c": "ETH",
        "a": "55.64169518",
        "l": "1.00000000"
      }
    ],
    "t": "order",
    "ts": 1760937483
  }
}
```
```json 체결
{
  "r": "DATA",
  "c": "MYASSET",
  "d": {
    "as": [
      {
        "c": "KRW",
        "a": "154902734.0029",
        "l": "8400.0000"
      },
      {
        "c": "ETH",
        "a": "55.64169518",
        "l": "0.09890000"
      }
    ],
    "t": "trade",
    "ts": 1760937483
  }
}
```
```json 주문 취소
{
  "r": "DATA",
  "c": "MYASSET",
  "d": {
    "as": [
      {
        "c": "KRW",
        "a": "155520364.5029",
        "l": "8400.0000"
      }
    ],
    "t": "cancel",
    "ts": 1760938364
  }
}
```
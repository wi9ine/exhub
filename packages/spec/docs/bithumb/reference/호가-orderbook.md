# 호가 (Orderbook)

<h1>Request</h1>

요청은 크게 `ticket field`, `type field`, `format field` 로 분류되며 하나의 요청에 여러 개의 `type field` 를 명시할 수 있습니다. 자세한 사항은 <a href="https://apidocs.bithumb.com/v2.1.5/reference/%EC%9A%94%EC%B2%AD-%ED%8F%AC%EB%A7%B7" target="_blank">요청 방법 및 포맷</a> 페이지를 확인해주시기 바랍니다.

<h3>Type Field</h3>

수신하고 싶은 시세 정보를 나열하는 필드입니다.\
`is_only_snapshot`, `is_only_realtime` 필드는 생략 가능하며 모두 생략할 경우 스냅샷과 실시간 데이터 둘 다 수신합니다.

<Table align={["left","left","left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        필드명
      </th>

      <th style={{ textAlign: "left" }}>
        타입
      </th>

      <th style={{ textAlign: "left" }}>
        내용
      </th>

      <th style={{ textAlign: "left" }}>
        필수 여부
      </th>

      <th style={{ textAlign: "left" }}>
        기본 값
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        type
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        데이터 타입\
        -`orderbook` : 호가
      </td>

      <td style={{ textAlign: "left" }}>
        O
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        codes
      </td>

      <td style={{ textAlign: "left" }}>
        List
      </td>

      <td style={{ textAlign: "left" }}>
        마켓 코드 리스트

        * 대문자로 요청해야 합니다.
      </td>

      <td style={{ textAlign: "left" }}>
        O
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        level
      </td>

      <td style={{ textAlign: "left" }}>
        Double
      </td>

      <td style={{ textAlign: "left" }}>
        모아보기 단위
      </td>

      <td style={{ textAlign: "left" }}>
        X
      </td>

      <td style={{ textAlign: "left" }}>
        1
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        isOnlySnapshot
      </td>

      <td style={{ textAlign: "left" }}>
        Boolean
      </td>

      <td style={{ textAlign: "left" }}>
        스냅샷 시세만 제공
      </td>

      <td style={{ textAlign: "left" }}>
        X
      </td>

      <td style={{ textAlign: "left" }}>
        false
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        isOnlyRealtime
      </td>

      <td style={{ textAlign: "left" }}>
        Boolean
      </td>

      <td style={{ textAlign: "left" }}>
        실시간 시세만 제공
      </td>

      <td style={{ textAlign: "left" }}>
        X
      </td>

      <td style={{ textAlign: "left" }}>
        false
      </td>
    </tr>
  </tbody>
</Table>

<h1>Response</h1>

<Table align={["left","left","left","left","left"]}>
  <thead>
    <tr>
      <th>
        필드명
      </th>

      <th>
        축약형

        (format

        :SIMPLE)
      </th>

      <th>
        내용
      </th>

      <th>
        타입
      </th>

      <th>
        값
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        type
      </td>

      <td>
        ty
      </td>

      <td>
        타입
      </td>

      <td>
        String
      </td>

      <td>
        `orderbook` : 호가
      </td>
    </tr>

    <tr>
      <td>
        code
      </td>

      <td>
        cd
      </td>

      <td>
        마켓 코드 (ex. KRW-BTC)
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        total\_ask\_size
      </td>

      <td>
        tas
      </td>

      <td>
        호가 매도 총 잔량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        total\_bid\_size
      </td>

      <td>
        tbs
      </td>

      <td>
        호가 매수 총 잔량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        orderbook\_units
      </td>

      <td>
        obu
      </td>

      <td>
        호가
      </td>

      <td>
        List of Objects
      </td>

      <td />
    </tr>

    <tr>
      <td>
        orderbook\_units.ask\_price
      </td>

      <td>
        obu.ap
      </td>

      <td>
        매도 호가
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        orderbook\_units.bid\_price
      </td>

      <td>
        obu.bp
      </td>

      <td>
        매수 호가
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        orderbook\_units.ask\_size
      </td>

      <td>
        obu.as
      </td>

      <td>
        매도 잔량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        orderbook\_units.bid\_size
      </td>

      <td>
        obu.bs
      </td>

      <td>
        매수 잔량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        timestamp
      </td>

      <td>
        tms
      </td>

      <td>
        타임스탬프 (millisecond)
      </td>

      <td>
        Long
      </td>

      <td />
    </tr>

    <tr>
      <td>
        level
      </td>

      <td>
        lv
      </td>

      <td>
        호가 모아보기 단위 (default: 1, 기본 호가단위)
      </td>

      <td>
        Double
      </td>

      <td>
        모아보기 단위
      </td>
    </tr>
  </tbody>
</Table>

<br />

<h1>Example</h1>

<h3>Request</h3>

* `level` 값은 필수가 아니며, 제외될 경우 DEFAULT(1), 기본 호가단위로 내려갑니다.

```json
[
  {
    "ticket": "test example"
  },
  {
    "type": "orderbook",
    "codes": [
      "KRW-BTC",
      "KRW-ETH.3"
    ],
    "level": 10
  },
  {
    "format": "DEFAULT"
  }
]
```

종목별로 각기 다른 모아보기 `level` 값을 지정하기 위해서는 아래와 같이 요청할 수 있습니다.

```json
[  
    {  
        "ticket": "test example"  
    },  
    {  
        "type": "orderbook",  
        "codes": [  
            "KRW-BTC"
        ],  
        "level": 1000 
    },  
    {  
        "type": "orderbook",  
        "codes": [  
            "KRW-XRP"  
        ],  
        "level": 1
    },  
    {  
        "format": "DEFAULT"  
    }  
]  
```

<h3>Response</h3>

```json
{
    "type": "orderbook",
    "code": "KRW-BTC",
    "total_ask_size": 450.3526,
    "total_bid_size": 63.3006,
    "orderbook_units": [
        {
            "ask_price": 478800,
            "bid_price": 478300,
            "ask_size": 4.3478,
            "bid_size": 5.6370
        },
        {
            "ask_price": 489700,
            "bid_price": 477900,
            "ask_size": 2.3642,
            "bid_size": 0.9705
        },
        {
            "ask_price": 493100,
            "bid_price": 471200,
            "ask_size": 411.8686,
            "bid_size": 3.9279
        },
        {
            "ask_price": 493300,
            "bid_price": 471100,
            "ask_size": 2.0241,
            "bid_size": 1.4699
        },
        {
            "ask_price": 493700,
            "bid_price": 471000,
            "ask_size": 1.7870,
            "bid_size": 2.2573
        },
        {
            "ask_price": 493800,
            "bid_price": 470700,
            "ask_size": 3.9372,
            "bid_size": 9.7805
        },
        {
            "ask_price": 494900,
            "bid_price": 470400,
            "ask_size": 5.7560,
            "bid_size": 0.8093
        },
        {
            "ask_price": 495300,
            "bid_price": 470300,
            "ask_size": 3.6418,
            "bid_size": 4.6606
        },
        {
            "ask_price": 495700,
            "bid_price": 470100,
            "ask_size": 2.9617,
            "bid_size": 5.4907
        },
        {
            "ask_price": 495800,
            "bid_price": 469700,
            "ask_size": 0.2349,
            "bid_size": 2.3941
        },
        {
            "ask_price": 496100,
            "bid_price": 469600,
            "ask_size": 2.6019,
            "bid_size": 4.5505
        },
        {
            "ask_price": 496800,
            "bid_price": 469500,
            "ask_size": 3.4651,
            "bid_size": 5.4469
        },
        {
            "ask_price": 496900,
            "bid_price": 469200,
            "ask_size": 0.8400,
            "bid_size": 10.1685
        },
        {
            "ask_price": 497400,
            "bid_price": 469100,
            "ask_size": 2.1924,
            "bid_size": 5.1646
        },
        {
            "ask_price": 497900,
            "bid_price": 469000,
            "ask_size": 2.3299,
            "bid_size": 0.5723
        }
    ],
    "level": 1,
    "timestamp": 1725930007672,
    "stream_type": "REALTIME"
}
```
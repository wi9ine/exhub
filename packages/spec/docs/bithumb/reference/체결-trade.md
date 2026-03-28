# 체결 (Trade)

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
        -`trade` : 체결
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
        `trade`: 체결
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
        trade\_price
      </td>

      <td>
        tp
      </td>

      <td>
        체결 가격
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        trade\_volume
      </td>

      <td>
        tv
      </td>

      <td>
        체결량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        ask\_bid
      </td>

      <td>
        ab
      </td>

      <td>
        매수/매도 구분
      </td>

      <td>
        String
      </td>

      <td>
        `ASK` : 매도\
        `BID` : 매수
      </td>
    </tr>

    <tr>
      <td>
        prev\_closing\_price
      </td>

      <td>
        pcp
      </td>

      <td>
        전일 종가
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        change
      </td>

      <td>
        c
      </td>

      <td>
        전일 대비
      </td>

      <td>
        String
      </td>

      <td>
        `RISE`: 상승\
        `EVEN`: 보합\
        `FALL`: 하락
      </td>
    </tr>

    <tr>
      <td>
        change\_price
      </td>

      <td>
        cp
      </td>

      <td>
        부호 없는 전일 대비 값
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        trade\_date
      </td>

      <td>
        tdt
      </td>

      <td>
        최근 거래 일자(KST)
      </td>

      <td>
        String
      </td>

      <td>
        yyyy-MM-dd
      </td>
    </tr>

    <tr>
      <td>
        trade\_time
      </td>

      <td>
        ttm
      </td>

      <td>
        최근 거래 시각(KST)
      </td>

      <td>
        String
      </td>

      <td>
        HH:mm:ss
      </td>
    </tr>

    <tr>
      <td>
        trade\_timestamp
      </td>

      <td>
        ttms
      </td>

      <td>
        체결 타임스탬프 (milliseconds)
      </td>

      <td>
        Long
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
        sequential\_id
      </td>

      <td>
        sid
      </td>

      <td>
        체결 번호 (Unique)
      </td>

      <td>
        Long
      </td>

      <td />
    </tr>

    <tr>
      <td>
        stream\_type
      </td>

      <td>
        st
      </td>

      <td>
        스트림 타입
      </td>

      <td>
        String
      </td>

      <td>
        `SNAPSHOT` : 스냅샷\
        `REALTIME` : 실시간
      </td>
    </tr>
  </tbody>
</Table>

\*`sequential_id` 필드는 체결의 유일성을 판단하기 위한 근거로 쓰일 수 있습니다. 하지만 체결 순서를 보장하지는 못합니다.

<h1>Example</h1>

<h3>Request</h3>

* `KRW-BTC`, `KRW-ETH`

```json
[
  {
    "ticket": "test example"
  },
  {
    "type": "trade",
    "codes": [
      "KRW-BTC",
      "KRW-ETH"
    ]
  },
  {
    "format": "DEFAULT"
  }
]
```

<h3>Response</h3>

```json
{
    "type": "trade",
    "code": "KRW-BTC",
    "trade_price": 489700,
    "trade_volume": 1.4825,
    "ask_bid": "BID",
    "prev_closing_price": 484500,
    "change": "RISE",
    "change_price": 5200,
    "trade_date": "2024-09-10",
    "trade_time": "09:58:54",
    "trade_timestamp": 1725929934373,
    "sequential_id": 17259299343730000,
    "timestamp": 1725929934483,
    "stream_type": "REALTIME"
}
```
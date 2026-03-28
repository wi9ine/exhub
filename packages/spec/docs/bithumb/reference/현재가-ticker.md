# 현재가 (Ticker)

<h1>Request</h1>

요청은 크게 `ticket field`, `type field`, `format field` 로 분류되며 하나의 요청에 여러 개의 `type field` 를 명시할 수 있습니다. 자세한 사항은 <a href="https://apidocs.bithumb.com/v2.1.5/reference/%EC%9A%94%EC%B2%AD-%ED%8F%AC%EB%A7%B7" target="_blank">요청 방법 및 포맷</a> 페이지를 확인해주시기 바랍니다.

<h3>Type Field</h3>

수신하고 싶은 시세 정보를 나열하는 필드입니다.\
`is_only_snapshot`, `is_only_realtime` 필드는 생략할 수 있으며 둘 다 생략할 경우 스냅샷과 실시간 데이터 모두 수신합니다.

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
        -`ticker` : 현재가
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
        `ticker`: 현재가
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
        opening\_price
      </td>

      <td>
        op
      </td>

      <td>
        시가
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        high\_price
      </td>

      <td>
        hp
      </td>

      <td>
        고가
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        low\_price
      </td>

      <td>
        lp
      </td>

      <td>
        저가
      </td>

      <td>
        Double
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
        현재가
      </td>

      <td>
        Double
      </td>

      <td />
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
        signed\_change\_price
      </td>

      <td>
        scp
      </td>

      <td>
        전일 대비 값
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        change\_rate
      </td>

      <td>
        cr
      </td>

      <td>
        부호 없는 전일 대비 등락율
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        signed\_change\_rate
      </td>

      <td>
        scr
      </td>

      <td>
        전일 대비 등락율
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
        가장 최근 거래량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        acc\_trade\_volume
      </td>

      <td>
        atv
      </td>

      <td>
        누적 거래량(KST 0시 기준)
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        acc\_trade\_volume\_24h
      </td>

      <td>
        atv24h
      </td>

      <td>
        24시간 누적 거래량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        acc\_trade\_price
      </td>

      <td>
        atp
      </td>

      <td>
        누적 거래대금(KST 0시 기준)
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        acc\_trade\_price\_24h
      </td>

      <td>
        atp24h
      </td>

      <td>
        24시간 누적 거래대금
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
        yyyyMMdd
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
        HHmmss
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
        acc\_ask\_volume
      </td>

      <td>
        aav
      </td>

      <td>
        누적 매도량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        acc\_bid\_volume
      </td>

      <td>
        abv
      </td>

      <td>
        누적 매수량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        highest\_52\_week\_price
      </td>

      <td>
        h52wp
      </td>

      <td>
        52주 최고가
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        highest\_52\_week\_date
      </td>

      <td>
        h52wdt
      </td>

      <td>
        52주 최고가 달성일
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
        lowest\_52\_week\_price
      </td>

      <td>
        l52wp
      </td>

      <td>
        52주 최저가
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        lowest\_52\_week\_date
      </td>

      <td>
        l52wdt
      </td>

      <td>
        52주 최저가 달성일
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
        market\_state
      </td>

      <td>
        ms
      </td>

      <td>
        거래상태
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        is\_trading\_suspended
      </td>

      <td>
        its
      </td>

      <td>
        거래 정지 여부
      </td>

      <td>
        Boolean
      </td>

      <td />
    </tr>

    <tr>
      <td>
        delisting\_date
      </td>

      <td>
        dd
      </td>

      <td>
        거래지원 종료일
      </td>

      <td>
        Date
      </td>

      <td />
    </tr>

    <tr>
      <td>
        market\_warning
      </td>

      <td>
        mw
      </td>

      <td>
        유의 종목 여부
      </td>

      <td>
        String
      </td>

      <td>
        `NONE` : 해당없음\
        `CAUTION` : 거래유의
      </td>
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

<h1>Example</h1>

<h3>Request</h3>

* `KRW-BTC`, `KRW-ETH`

```json
[
  {
    "ticket": "test example"
  },
  {
    "type": "ticker",
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
    "type": "ticker",
    "code": "KRW-BTC",
    "opening_price": 484500,
    "high_price": 493100,
    "low_price": 472500,
    "trade_price": 493100,
    "prev_closing_price": 484500,
    "change": "RISE",
    "change_price": 8600,
    "signed_change_price": 8600,
    "change_rate": 0.01775026,
    "signed_change_rate": 0.01775026,
    "trade_volume": 1.2567,
    "acc_trade_volume": 225.622,
    "acc_trade_volume_24h": 13386.15417512,
    "acc_trade_price": 108663718.238256,
    "acc_trade_price_24h": 8230696760.346009,
    "trade_date": "20240910",
    "trade_time": "091617",
    "trade_timestamp": 1725927377820,
    "ask_bid": "BID",
    "acc_ask_volume": 106.7561,
    "acc_bid_volume": 118.8659,
    "highest_52_week_price": 999999000,
    "highest_52_week_date": "2024-06-18",
    "lowest_52_week_price": 1000,
    "lowest_52_week_date": "2024-06-18",
    "market_state": "ACTIVE",
    "is_trading_suspended": false,
    "delisting_date": null,
    "market_warning": "NONE",
    "timestamp": 1725927377931,
    "stream_type": "REALTIME"
}
```
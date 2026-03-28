# 내 주문 및 체결 (MyOrder)

<Callout icon="📘" theme="info">
  #### 사전 안내

  기존에는 자전거래 가능성이 있을 경우 주문이 접수되지 않았으나,
  개선 후에는 주문 접수 후 체결 단계에서 자전거래를 감지해
  충돌하는 신규 주문 수량만 취소하도록 **개선될 예정**입니다.
  자세한 내용은 [공지사항](https://apidocs.bithumb.com/changelog/%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-open-api-%EC%A3%BC%EB%AC%B8-%EA%B4%80%EB%A0%A8-%EC%9E%90%EC%A0%84%EA%B1%B0%EB%9E%98-%EB%B0%A9%EC%A7%80-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EA%B3%A0%EB%8F%84%ED%99%94-%EC%95%88%EB%82%B4)을 참고하세요(업데이트 일시: 2026년 4월 2일 오후 12시 이후).

  응답 항목 "취소 주문 고유 아이디" `canceling_uuid`, "취소유형" `cancel_type`이 신규 추가될 예정입니다.
</Callout>

<h1>Request</h1>

요청은 크게 `ticket field`, `type field`, `format field` 로 분류되며 하나의 요청에 여러 개의 `type field` 를 명시할 수 있습니다. 자세한 사항은 <a href="https://apidocs.bithumb.com/v2.1.5/reference/%EC%9A%94%EC%B2%AD-%ED%8F%AC%EB%A7%B7" target="_blank">요청 방법 및 포맷</a> 페이지를 확인해주시기 바랍니다.

<h3>Type Field</h3>

수신하고 싶은 시세 정보를 나열하는 필드입니다.

<Table align={["left","left","left","left","left"]}>
  <thead>
    <tr>
      <th>
        필드명
      </th>

      <th>
        타입
      </th>

      <th>
        내용
      </th>

      <th>
        필수 여부
      </th>

      <th>
        기본 값
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        type    
      </td>

      <td>
        String
      </td>

      <td>
        데이터 타입\
        -`myOrder`: 내 주문
      </td>

      <td>
        O
      </td>

      <td />
    </tr>

    <tr>
      <td>
        codes
      </td>

      <td>
        List
      </td>

      <td>
        마켓 코드 리스트

        * 대문자로 요청해야 합니다.
      </td>

      <td>
        X
      </td>

      <td>
        생략하거나 빈 배열로 요청할 경우 모든 마켓에 대한 정보를 수신합니다.
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
        `myOrder`: 내 주문
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
        client\_order\_id
      </td>

      <td>
        coid
      </td>

      <td>
        사용자 정의 식별 ID
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        uuid
      </td>

      <td>
        uid
      </td>

      <td>
        주문 고유 아이디
      </td>

      <td>
        String
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
        `ASK`: 매도\
        `BID`: 매수
      </td>
    </tr>

    <tr>
      <td>
        order\_type
      </td>

      <td>
        ot
      </td>

      <td>
        주문 타입
      </td>

      <td>
        String
      </td>

      <td>
        `limit`: 지정가 주문\
        `price`: 시장가 주문(매수)\
        `market`: 시장가 주문(매도)
      </td>
    </tr>

    <tr>
      <td>
        state
      </td>

      <td>
        s
      </td>

      <td>
        주문 상태
      </td>

      <td>
        String
      </td>

      <td>
        `wait`: 체결 대기\
        `trade`: 체결 발생\
        `done`: 전체 체결 완료\
        `cancel`: 주문 취소
      </td>
    </tr>

    <tr>
      <td>
        trade\_uuid
      </td>

      <td>
        tuid
      </td>

      <td>
        체결의 고유 아이디
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        price
      </td>

      <td>
        p
      </td>

      <td>
        주문 가격,\
        체결 가격 (state: trade 일 때)
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        volume
      </td>

      <td>
        v
      </td>

      <td>
        주문량,\
        체결량 (state: trade 일 때)
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        remaining\_volume
      </td>

      <td>
        rv
      </td>

      <td>
        체결 후 남은 주문 양
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        executed\_volume
      </td>

      <td>
        ev
      </td>

      <td>
        체결된 양
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        trades\_count
      </td>

      <td>
        tc
      </td>

      <td>
        해당 주문에 걸린 체결 수
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        reserved\_fee
      </td>

      <td>
        rsf
      </td>

      <td>
        수수료로 예약된 비용
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        remaining\_fee
      </td>

      <td>
        rmf
      </td>

      <td>
        남은 수수료
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        paid\_fee
      </td>

      <td>
        pf
      </td>

      <td>
        사용된 수수료
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        executed\_funds
      </td>

      <td>
        ef
      </td>

      <td>
        체결된 금액
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        trade\_timestamp
      </td>

      <td>
        ttms
      </td>

      <td>
        체결 타임스탬프 (millisecond)
      </td>

      <td>
        Long
      </td>

      <td />
    </tr>

    <tr>
      <td>
        order\_timestamp
      </td>

      <td>
        otms
      </td>

      <td>
        주문 타임스탬프 (millisecond)
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
        `REALTIME` : 실시간
      </td>
    </tr>
  </tbody>
</Table>

<h1>Example</h1>

<h3>Request</h3>

* 모든 마켓 정보 수신

```json
[
  {
    "ticket": "test example"
  },
  {
    "type": "myOrder",
    "codes": []
  }
]
```

* 특정 마켓 정보 수신

```json
[
  {
    "ticket": "test example"
  },
  {
    "type": "myOrder",
    "codes": ["KRW-BTC"]
  }
]
```

<h3>Response</h3>

```json
{
    "type": "myOrder",
    "code": "KRW-BTC",
    "client_order_id": "my-client-order-id-1",
    "uuid": "C0101000000001818113",
    "ask_bid": "BID",
    "order_type": "limit",
    "state": "trade",
    "trade_uuid": "C0101000000001744207",
    "price": 1927000,
    "volume": 0.4697,
    "remaining_volume": 0.0803,
    "executed_volume": 0.4697,
    "trades_count": 1,
    "reserved_fee": 0,
    "remaining_fee": 0,
    "paid_fee": 0,
    "executed_funds": 905111.9000,
    "trade_timestamp": 1727052318148,
    "order_timestamp": 1727052318074,
    "timestamp": 1727052318369,
    "stream_type": "REALTIME"
}
```
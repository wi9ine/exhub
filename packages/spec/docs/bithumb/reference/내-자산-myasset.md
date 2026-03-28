# 내 자산 (MyAsset)

<h1>Request</h1>

요청은 크게 `ticket field`, `type field`, `format field` 로 분류되며 하나의 요청에 여러 개의 `type field` 를 명시할 수 있습니다. 자세한 사항은 <a href="https://apidocs.bithumb.com/v2.1.5/reference/%EC%9A%94%EC%B2%AD-%ED%8F%AC%EB%A7%B7" target="_blank">요청 방법 및 포맷</a> 페이지를 확인해주시기 바랍니다.

<h3>Type Field</h3>

수신하고 싶은 시세 정보를 나열하는 필드입니다.

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
        -`myAsset`: 내 자산
      </td>

      <td style={{ textAlign: "left" }}>
        O
      </td>

      <td style={{ textAlign: "left" }} />
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
        `myAsset`: 내 자산
      </td>
    </tr>

    <tr>
      <td>
        assets
      </td>

      <td>
        ast
      </td>

      <td>
        자산 리스트
      </td>

      <td>
        List of Objects
      </td>

      <td />
    </tr>

    <tr>
      <td>
        assets.currency
      </td>

      <td>
        ast.cu
      </td>

      <td>
        화폐를 의미하는 영문 대문자 코드
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        assets.balance
      </td>

      <td>
        ast.b
      </td>

      <td>
        주문가능 수량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        assets.locked
      </td>

      <td>
        ast.l
      </td>

      <td>
        주문 중 묶여있는 수량
      </td>

      <td>
        Double
      </td>

      <td />
    </tr>

    <tr>
      <td>
        asset\_timestamp
      </td>

      <td>
        asttms
      </td>

      <td>
        자산 타임스탬프 (millisecond)
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
    "type": "myAsset"
  }
]
```

<h3>Response</h3>

```json
{
    "type": "myAsset",
    "assets": [
        {
            "currency": "KRW",
            "balance": "2061832.35",
            "locked": "3824127.3"
        }
    ],
    "asset_timestamp": 1727052537592,
    "timestamp": 1727052537687,
    "stream_type": "REALTIME"
}
{
    "type": "myAsset",
    "assets": [
        {
            "currency": "BTC",
            "balance": "156.70564833",
            "locked": "38.81945789"
        }
    ],
    "asset_timestamp": 1727052537592,
    "timestamp": 1727052537690,
    "stream_type": "REALTIME"
}
```
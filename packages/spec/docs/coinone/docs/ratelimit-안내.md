# API 요청건수 제한 안내

원활한 거래환경을 위해 아래와 같이 API의 요청건수를 제한합니다.

# API 요청건수 제한

**Public API**

| 버전 | 최대 요청건수 | 기준       |
| :- | :------ | :------- |
| V2 | 1200/분  | 요청 IP 기준 |
| V1 | 600/분   | 요청 IP 기준 |

**Private API**

[block:parameters]
{
  "data": {
    "h-0": "버전          ",
    "h-1": "최대 요청건수    ",
    "h-2": "기준",
    "0-0": "V2.1       ",
    "0-1": "주문관련 API - 40/초  \n기타 API - 80/초",
    "0-2": "포트폴리오 기준",
    "1-0": "V2",
    "1-1": "주문관련 API - 40/초  \n기타 API - 40/초",
    "1-2": "포트폴리오 기준"
  },
  "cols": 3,
  "rows": 2,
  "align": [
    "left",
    "left",
    "left"
  ]
}
[/block]

Private API는 포트폴리오를 기준으로 API 요청건수를 제한합니다.

코인원 홈페이지 > 자산 > [포트폴리오](https://coinone.co.kr/balance/portfolio/manage) 페이지에서 포트폴리오 관리가 가능합니다.\
포트폴리오에 대한 자세한 내용은 [이용 가이드](https://support.coinone.co.kr/support/solutions/articles/31000172450-%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0)를 확인해주세요.

***

# 주문 관련 API

**PRIVATE API V2.1 > 주문 권한**

* [매수/매도 주문](https://docs.coinone.co.kr/reference/place-order)
* [종목 별 전체 주문 취소](https://docs.coinone.co.kr/reference/cancel-orders)
* [개별 주문 취소](https://docs.coinone.co.kr/reference/cancel-order)
* [지정가 매매 주문 (Deprecated)](https://docs.coinone.co.kr/reference/order-place-limit-order)

**PRIVATE API >  주문 권한**

* [주문 취소](https://docs.coinone.co.kr/reference/cancel-order-1)
* [지정가 매수 주문 (Deprecated)](https://docs.coinone.co.kr/reference/limit-buy)
* [지정가 매도 주문 (Deprecated)](https://docs.coinone.co.kr/reference/limit-sell)

***

# API 요청 건 수 초과 시 에러 코드

상기 요청건수를 초과하는 경우 아래와 같은 메세지가 수신됩니다.

**요청 제한 에러 메세지**

```json PrivateV2.1 && Public V2
{
  "result": "error",
  "error_code": "4",
  "error_msg": "Blocked user access"
}
```
```json PrivateV2 && PublicV1
{
  "result": "error",
  "errorCode": "4",
  "errorMsg": "Blocked user access"
}
```

***

# API 잔여 요청건수 확인

Open API의 잔여 요청건수는 요청 응답의 아래 Header값을 통해 확인이 가능합니다.\
잔여 요청이 가능할 경우에만 해당 Header값이 포함됩니다.

**Public API (1분 기준)**

| 구분     | Header                       | 비고                          |
| :----- | :--------------------------- | :-------------------------- |
| 전체 API | `Public-Ratelimit-Remaining` | (V1 API 의 경우 요청건당 2가 감소합니다) |

**Private API (1초 기준)**

| 구분       | Header                              | 비고                          |
| :------- | :---------------------------------- | :-------------------------- |
| 주문관련 API | `Private-Order-Ratelimit-Remaining` |                             |
| 기타 API   | `Private-Ratelimit-Remaining`       | (V2 API 의 경우 요청건당 2가 감소합니다) |
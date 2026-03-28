# 주문 정보 조회

주문 식별 ID에 해당하는 주문 조회

## Request Header

| 필드                  | 필수   | 설명                                                       |
| :------------------ | :--- | :------------------------------------------------------- |
| X-COINONE-PAYLOAD   | true | Request body object -> JSON string -> base64             |
| X-COINONE-SIGNATURE | true | HMAC(X-COINONE-PAYLOAD, SECRET\_KEY, SHA512).hexdigest() |

## Request Body

[block:parameters]
{
  "data": {
    "h-0": "필드",
    "h-1": "타입",
    "h-2": "필수",
    "h-3": "설명",
    "0-0": "access_token",
    "0-1": "String",
    "0-2": "true",
    "0-3": "사용자의 액세스 토큰",
    "1-0": "nonce",
    "1-1": "String",
    "1-2": "true",
    "1-3": "UUID nonce (예: \"022f53b2-8b2f-40c6-8e51-b594f562ee83\")",
    "2-0": "order_id",
    "2-1": "String",
    "2-2": "true",
    "2-3": "주문 식별자 UUID",
    "3-0": "quote_currency",
    "3-1": "String",
    "3-2": "true",
    "3-3": "마켓 기준 통화  \n\\* 예: KRW",
    "4-0": "target_currency",
    "4-1": "String",
    "4-2": "true",
    "4-3": "주문하려는 종목의 심볼  \n\\* 예: BTC",
    "5-0": "user_order_id",
    "5-1": "String",
    "5-2": "false",
    "5-3": "user_order_id 필드와 기존 order_id 필드 중 하나만 입력되어야 함  \n  \n- 150자까지 지원\n- 알파벳 소문자 / 숫자 / 특수문자 - \\_ . 지원\n- 거래쌍 상관 없이 기존에 입력한 user_order_id 는 재사용 불가"
  },
  "cols": 4,
  "rows": 6,
  "align": [
    "left",
    "left",
    "left",
    "left"
  ]
}
[/block]

## Response Body

[block:parameters]
{
  "data": {
    "h-0": "필드",
    "h-1": "타입",
    "h-2": "설명",
    "h-3": "주문 유형",
    "0-0": "result",
    "0-1": "String",
    "0-2": "정상 반환 시 success, 에러 코드 반환 시 error",
    "0-3": "모든 유형",
    "1-0": "error_code",
    "1-1": "NumberString",
    "1-2": "error 발생 시 에러코드 반환, 성공인 경우 0 반환",
    "1-3": "모든 유형",
    "2-0": "order",
    "2-1": "Object",
    "2-2": "주문 정보 오브젝트",
    "2-3": "모든 유형 ",
    "3-0": "- order_id",
    "3-1": "String",
    "3-2": "주문 식별 ID  \n\\* 예: \"0e30219d-1e4d-11e9-9ec7-00e04c3600d7\"",
    "3-3": "모든 유형 ",
    "4-0": "- type",
    "4-1": "String",
    "4-2": "주문 유형  \n  \n- `LIMIT`: 지정가\n- `MARKET` : 시장가\n- `STOP_LIMIT` : 예약가",
    "4-3": "모든 유형",
    "5-0": "- quote_currency",
    "5-1": "String",
    "5-2": "마켓 기준 통화  \n\\* 예: \"KRW\"",
    "5-3": "모든 유형 ",
    "6-0": "- target_currency",
    "6-1": "String",
    "6-2": "주문 등록된 종목의 심볼  \n\\* 예: \"BTC\"",
    "6-3": "모든 유형",
    "7-0": "- status",
    "7-1": "String",
    "7-2": "주문 진행 상태 (아래 status 표 참고)",
    "7-3": "모든 유형 ",
    "8-0": "- side",
    "8-1": "String",
    "8-2": "매수/매도 분류  \n  \n- `BUY`: 매수\n- `SELL` : 매도",
    "8-3": "모든 유형 ",
    "9-0": "- fee",
    "9-1": "NumberString",
    "9-2": "체결 수수료",
    "9-3": "모든 유형 ",
    "10-0": "- fee_rate",
    "10-1": "NumberString",
    "10-2": "체결 수수료율",
    "10-3": "모든 유형 ",
    "11-0": "- average_executed_price",
    "11-1": "NumberString",
    "11-2": "체결된 주문의 평균 체결가",
    "11-3": "모든 유형 ",
    "12-0": "- updated_at",
    "12-1": "Number",
    "12-2": "마지막 주문 업데이트 시점  \n\\* unit of time: millisecond",
    "12-3": "모든 유형 ",
    "13-0": "- ordered_at",
    "13-1": "Number",
    "13-2": "주문 등록 시점  \n\\* unit of time: millisecond)",
    "13-3": "모든 유형 ",
    "14-0": "- price",
    "14-1": "NumberString",
    "14-2": "주문 가격",
    "14-3": "지정가, 예약가",
    "15-0": "- original_qty",
    "15-1": "NumberString",
    "15-2": "최초 주문 수량  \n_ remain_qty + executed_qty + canceled_qty)  \n_ 예: `\"0.01\"`",
    "15-3": "지정가, 시장가 매도, 예약가",
    "16-0": "- executed_qty",
    "16-1": "NumberString",
    "16-2": "체결된 수량",
    "16-3": "지정가, 시장가, 예약가",
    "17-0": "- canceled_qty",
    "17-1": "NumberString",
    "17-2": "취소된 수량",
    "17-3": "지정가, 시장가 매도, 예약가",
    "18-0": "- remain_qty",
    "18-1": "NumberString",
    "18-2": "미체결 잔량",
    "18-3": "지정가, 예약가",
    "19-0": "- limit_price",
    "19-1": "NumberString",
    "19-2": "체결 가격 한도  \n_  최대 한도 : 상한가  \n_ 최소 한도 :하한가",
    "19-3": "시장가",
    "20-0": "- traded_amount",
    "20-1": "NumberString",
    "20-2": "체결된 총액",
    "20-3": "시장가 매수",
    "21-0": "- original_amount",
    "21-1": "NumberString",
    "21-2": "주문 총액  \n\\* traded_amount + canceled_amount",
    "21-3": "시장가 매수",
    "22-0": "- canceled_amount",
    "22-1": "NumberString",
    "22-2": "주문 취소 총액",
    "22-3": "시장가 매수",
    "23-0": "- is_triggered",
    "23-1": "Boolean",
    "23-2": "해당 주문이 발동되었는지 여부  \n예약가 주문 이외의 경우, \u001dnull로 응답  \n\\* 예약가 주문에서만 사용",
    "23-3": "예약가",
    "24-0": "- trigger_price",
    "24-1": "NumberString",
    "24-2": "예약가 주문이 실행되는 가격 (감시가)  \n예약가 주문 이외의 경우, \u001dnull로 응답",
    "24-3": "예약가"
  },
  "cols": 4,
  "rows": 25,
  "align": [
    "left",
    "left",
    "left",
    "left"
  ]
}
[/block]

-limit\_price 사용예시

* 시장가 매수 주문 시\
  1BTC 현재가 = 30,000,000KRW, 상한가 = 45,000,000KRW인 경우 상한가의 수량까지만 체결

### status

[block:parameters]
{
  "data": {
    "h-0": "Order status",
    "h-1": "Description",
    "0-0": "LIVE",
    "0-1": "오더북에 등록된 상태로 취소나 체결이 되지 않은 상태",
    "1-0": "PARTIALLY_FILLED",
    "1-1": "주문이 부분적으로 체결된 상태. 잔여 수량 존재함",
    "2-0": "PARTIALLY_CANCELED",
    "2-1": "주문이 부분적으로 취소된 상태",
    "3-0": "FILLED",
    "3-1": "주문이 모두 체결된 상태",
    "4-0": "CANCELED",
    "4-1": "주문이 취소된 상태",
    "5-0": "NOT_TRIGGERED",
    "5-1": "예약가 주문이 발동되지 않은 상태",
    "6-0": "NOT_TRIGGERED_PARTIALLY_CANCELED",
    "6-1": "예약가 주문이 발동되지 않고 부분 취소된 상태",
    "7-0": "NOT_TRIGGERED_CANCELED",
    "7-1": "예약가 주문이 발동되지 않고 완전 취소된 상태",
    "8-0": "TRIGGERED",
    "8-1": "예약가 주문이 발동된 상태",
    "9-0": "CANCELED_NO_ORDER",
    "9-1": "시장가 주문이 체결할 수 있는 호가가 없어 자동으로 취소된 상태  \n취소 시 모든 주문이 취소되는것이 아닌, 부분만 취소됨 ",
    "10-0": "CANCELED_LIMIT_PRICE_EXCEED",
    "10-1": "시장가 주문이 limit_price에 걸려, 더이상 주문이 체결되지 않아 자동으로 취소된 상태  \n\\* [매수/매도 주문 request body](https://docs.coinone.co.kr/reference/place-order) 중 `limit_price` 참조  \n취소 시 모든 주문이 취소되는것이 아닌, 부분만 취소됨",
    "11-0": "CANCELED_UNDER_PRODUCT_UNIT",
    "11-1": "시장가 매수 주문 체결 중 주문 가능 총액이 최소 금액 미만으로 남아 자동으로 취소된 상태  \n취소 시 모든 주문이 취소되는것이 아닌, 부분만 취소됨"
  },
  "cols": 2,
  "rows": 12,
  "align": [
    "left",
    "left"
  ]
}
[/block]

# OpenAPI definition

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "PRIVATE API",
    "version": "1.7"
  },
  "servers": [
    {
      "url": "https://api.coinone.co.kr"
    }
  ],
  "security": [
    {}
  ],
  "paths": {
    "/v2.1/order/detail": {
      "post": {
        "summary": "주문 정보 조회",
        "description": "주문 식별 ID에 해당하는 주문 조회",
        "operationId": "order-detail",
        "parameters": [
          {
            "name": "X-COINONE-PAYLOAD",
            "in": "header",
            "description": "Request body object -> JSON string -> base64",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "X-COINONE-SIGNATURE",
            "in": "header",
            "description": "HMAC(X-COINONE-PAYLOAD, SECRET_KEY, SHA512).hexdigest()",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "access_token",
                  "nonce",
                  "order_id",
                  "quote_currency",
                  "target_currency"
                ],
                "properties": {
                  "access_token": {
                    "type": "string",
                    "description": "사용자의 액세스 토큰 (access token)"
                  },
                  "nonce": {
                    "type": "string",
                    "description": "UUID nonce (예: \"022f53b2-8b2f-40c6-8e51-b594f562ee83\")"
                  },
                  "order_id": {
                    "type": "string",
                    "description": "조회하려는 주문 식별 ID"
                  },
                  "quote_currency": {
                    "type": "string",
                    "description": "조회하려는 주문의 마켓 기준 통화",
                    "default": "KRW"
                  },
                  "target_currency": {
                    "type": "string",
                    "description": "조회하려는 주문의 종목 심볼",
                    "default": "BTC"
                  },
                  "user_order_id": {
                    "type": "string",
                    "description": "150자까지 지원 (알파벳 소문자 / 숫자 / 특수문자 - _ . 지원)"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "200",
            "content": {
              "application/json": {
                "examples": {
                  "limit": {
                    "value": "{\n    \"result\": \"success\",\n    \"error_code\": \"0\",\n    \"order\": {\n        \"order_id\": \"0f1c26d0-1e4d-11e9-9ec7-00e04c3600d7\",\n        \"type\": \"LIMIT\",\n        \"quote_currency\": \"KRW\",\n        \"target_currency\": \"BTC\",\n        \"status\": \"CANCELED\",\n        \"side\": \"BUY\",\n        \"fee\": \"0\",\n        \"fee_rate\": \"0.0\",\n        \"average_executed_price\": \"0\",\n        \"updated_at\": 1680055490000,\n        \"ordered_at\": 1680051059000,\n        \"price\": \"100000\",\n        \"original_qty\": \"1\",\n        \"executed_qty\": \"0\",\n        \"canceled_qty\": \"1\",\n        \"remain_qty\": \"0\",\n        \"limit_price\": null,\n        \"traded_amount\": null,\n        \"original_amount\": null,\n        \"canceled_amount\": null,\n        \"is_triggered\": null,\n        \"trigger_price\": null\n    }\n}"
                  },
                  "market buy": {
                    "value": "{\n    \"result\": \"success\",\n    \"error_code\": \"0\",\n    \"order\": {\n        \"order_id\": \"0f9d1473-1e4d-11e9-9ec7-00e04c3600d7\",\n        \"type\": \"MARKET\",\n        \"quote_currency\": \"KRW\",\n        \"target_currency\": \"BTC\",\n        \"status\": \"CANCELED_UNDER_PRODUCT_UNIT\",\n        \"side\": \"BUY\",\n        \"fee\": \"1999.9999\",\n        \"average_fee_rate\": \"0.002\",\n        \"average_executed_price\": \"29959000\",\n        \"updated_at\": 1686133903000,\n        \"ordered_at\": 1686133903000,\n        \"price\": null,\n        \"original_qty\": null,\n        \"executed_qty\": \"0.03337895\",\n        \"canceled_qty\": null,\n        \"remain_qty\": null,\n        \"limit_price\": \"40000000\",\n        \"traded_amount\": \"999999.963\",\n        \"original_amount\": \"1000000\",\n        \"canceled_amount\": \"0.0369\",\n        \"is_triggered\": null,\n        \"trigger_price\": null\n    }\n}"
                  },
                  "market sell": {
                    "value": "{\n    \"result\": \"success\",\n    \"error_code\": \"0\",\n    \"order\": {\n        \"order_id\": \"0f51301f-1e4d-11e9-9ec7-00e04c3600d7\",\n        \"type\": \"MARKET\",\n        \"quote_currency\": \"KRW\",\n        \"target_currency\": \"BTC\",\n        \"status\": \"FILLED\",\n        \"side\": \"SELL\",\n        \"fee\": \"73.36\",\n        \"fee_rate\": \"0.002\",\n        \"average_executed_price\": \"36680000\",\n        \"updated_at\": 1682385152000,\n        \"ordered_at\": 1682385152000,\n        \"price\": null,\n        \"original_qty\": \"0.001\",\n        \"executed_qty\": \"0.001\",\n        \"canceled_qty\": \"0\",\n        \"remain_qty\": null,\n        \"limit_price\": \"0.0001\",\n        \"traded_amount\": null,\n        \"original_amount\": null,\n        \"canceled_amount\": null,\n        \"is_triggered\": null,\n        \"trigger_price\": null\n    }\n}"
                  },
                  "stop limit": {
                    "value": "{\n    \"result\": \"success\",\n    \"error_code\": \"0\",\n    \"order\": {\n        \"order_id\": \"0f1c2fd6-1e4d-11e9-9ec7-00e04c3600d7\",\n        \"type\": \"STOP_LIMIT\",\n        \"quote_currency\": \"KRW\",\n        \"target_currency\": \"BTC\",\n        \"status\": \"FILLED\",\n        \"side\": \"BUY\",\n        \"fee\": \"80000\",\n        \"fee_rate\": \"0.002\",\n        \"average_executed_price\": \"20000000\",\n        \"updated_at\": 1680618935000,\n        \"ordered_at\": 1680052401000,\n        \"price\": \"20000000\",\n        \"original_qty\": \"2\",\n        \"executed_qty\": \"2\",\n        \"canceled_qty\": \"0\",\n        \"remain_qty\": \"0\",\n        \"limit_price\": null,\n        \"traded_amount\": null,\n        \"original_amount\": null,\n        \"canceled_amount\": null,\n        \"is_triggered\": true,\n        \"trigger_price\": \"36998000\"\n    }\n}"
                  }
                },
                "schema": {
                  "oneOf": [
                    {
                      "title": "limit",
                      "type": "object",
                      "properties": {
                        "result": {
                          "type": "string",
                          "example": "success"
                        },
                        "error_code": {
                          "type": "string",
                          "example": "0"
                        },
                        "order": {
                          "type": "object",
                          "properties": {
                            "order_id": {
                              "type": "string",
                              "example": "0f1c26d0-1e4d-11e9-9ec7-00e04c3600d7"
                            },
                            "type": {
                              "type": "string",
                              "example": "LIMIT"
                            },
                            "quote_currency": {
                              "type": "string",
                              "example": "KRW"
                            },
                            "target_currency": {
                              "type": "string",
                              "example": "BTC"
                            },
                            "status": {
                              "type": "string",
                              "example": "CANCELED"
                            },
                            "side": {
                              "type": "string",
                              "example": "BUY"
                            },
                            "fee": {
                              "type": "string",
                              "example": "0"
                            },
                            "fee_rate": {
                              "type": "string",
                              "example": "0.0"
                            },
                            "average_executed_price": {
                              "type": "string",
                              "example": "0"
                            },
                            "updated_at": {
                              "type": "integer",
                              "example": 1680055490000,
                              "default": 0
                            },
                            "ordered_at": {
                              "type": "integer",
                              "example": 1680051059000,
                              "default": 0
                            },
                            "price": {
                              "type": "string",
                              "example": "100000"
                            },
                            "original_qty": {
                              "type": "string",
                              "example": "1"
                            },
                            "executed_qty": {
                              "type": "string",
                              "example": "0"
                            },
                            "canceled_qty": {
                              "type": "string",
                              "example": "1"
                            },
                            "remain_qty": {
                              "type": "string",
                              "example": "0"
                            },
                            "limit_price": {},
                            "traded_amount": {},
                            "original_amount": {},
                            "canceled_amount": {},
                            "is_triggered": {},
                            "trigger_price": {}
                          }
                        }
                      }
                    },
                    {
                      "title": "market buy",
                      "type": "object",
                      "properties": {
                        "result": {
                          "type": "string",
                          "example": "success"
                        },
                        "error_code": {
                          "type": "string",
                          "example": "0"
                        },
                        "order": {
                          "type": "object",
                          "properties": {
                            "order_id": {
                              "type": "string",
                              "example": "0f9d1473-1e4d-11e9-9ec7-00e04c3600d7"
                            },
                            "type": {
                              "type": "string",
                              "example": "MARKET"
                            },
                            "quote_currency": {
                              "type": "string",
                              "example": "KRW"
                            },
                            "target_currency": {
                              "type": "string",
                              "example": "BTC"
                            },
                            "status": {
                              "type": "string",
                              "example": "CANCELED_UNDER_PRODUCT_UNIT"
                            },
                            "side": {
                              "type": "string",
                              "example": "BUY"
                            },
                            "fee": {
                              "type": "string",
                              "example": "1999.9999"
                            },
                            "average_fee_rate": {
                              "type": "string",
                              "example": "0.002"
                            },
                            "average_executed_price": {
                              "type": "string",
                              "example": "29959000"
                            },
                            "updated_at": {
                              "type": "integer",
                              "example": 1686133903000,
                              "default": 0
                            },
                            "ordered_at": {
                              "type": "integer",
                              "example": 1686133903000,
                              "default": 0
                            },
                            "price": {},
                            "original_qty": {},
                            "executed_qty": {
                              "type": "string",
                              "example": "0.03337895"
                            },
                            "canceled_qty": {},
                            "remain_qty": {},
                            "limit_price": {
                              "type": "string",
                              "example": "40000000"
                            },
                            "traded_amount": {
                              "type": "string",
                              "example": "999999.963"
                            },
                            "original_amount": {
                              "type": "string",
                              "example": "1000000"
                            },
                            "canceled_amount": {
                              "type": "string",
                              "example": "0.0369"
                            },
                            "is_triggered": {},
                            "trigger_price": {}
                          }
                        }
                      }
                    },
                    {
                      "title": "market sell",
                      "type": "object",
                      "properties": {
                        "result": {
                          "type": "string",
                          "example": "success"
                        },
                        "error_code": {
                          "type": "string",
                          "example": "0"
                        },
                        "order": {
                          "type": "object",
                          "properties": {
                            "order_id": {
                              "type": "string",
                              "example": "0f51301f-1e4d-11e9-9ec7-00e04c3600d7"
                            },
                            "type": {
                              "type": "string",
                              "example": "MARKET"
                            },
                            "quote_currency": {
                              "type": "string",
                              "example": "KRW"
                            },
                            "target_currency": {
                              "type": "string",
                              "example": "BTC"
                            },
                            "status": {
                              "type": "string",
                              "example": "FILLED"
                            },
                            "side": {
                              "type": "string",
                              "example": "SELL"
                            },
                            "fee": {
                              "type": "string",
                              "example": "73.36"
                            },
                            "fee_rate": {
                              "type": "string",
                              "example": "0.002"
                            },
                            "average_executed_price": {
                              "type": "string",
                              "example": "36680000"
                            },
                            "updated_at": {
                              "type": "integer",
                              "example": 1682385152000,
                              "default": 0
                            },
                            "ordered_at": {
                              "type": "integer",
                              "example": 1682385152000,
                              "default": 0
                            },
                            "price": {},
                            "original_qty": {
                              "type": "string",
                              "example": "0.001"
                            },
                            "executed_qty": {
                              "type": "string",
                              "example": "0.001"
                            },
                            "canceled_qty": {
                              "type": "string",
                              "example": "0"
                            },
                            "remain_qty": {},
                            "limit_price": {
                              "type": "string",
                              "example": "0.0001"
                            },
                            "traded_amount": {},
                            "original_amount": {},
                            "canceled_amount": {},
                            "is_triggered": {},
                            "trigger_price": {}
                          }
                        }
                      }
                    },
                    {
                      "title": "stop limit",
                      "type": "object",
                      "properties": {
                        "result": {
                          "type": "string",
                          "example": "success"
                        },
                        "error_code": {
                          "type": "string",
                          "example": "0"
                        },
                        "order": {
                          "type": "object",
                          "properties": {
                            "order_id": {
                              "type": "string",
                              "example": "0f1c2fd6-1e4d-11e9-9ec7-00e04c3600d7"
                            },
                            "type": {
                              "type": "string",
                              "example": "STOP_LIMIT"
                            },
                            "quote_currency": {
                              "type": "string",
                              "example": "KRW"
                            },
                            "target_currency": {
                              "type": "string",
                              "example": "BTC"
                            },
                            "status": {
                              "type": "string",
                              "example": "FILLED"
                            },
                            "side": {
                              "type": "string",
                              "example": "BUY"
                            },
                            "fee": {
                              "type": "string",
                              "example": "80000"
                            },
                            "fee_rate": {
                              "type": "string",
                              "example": "0.002"
                            },
                            "average_executed_price": {
                              "type": "string",
                              "example": "20000000"
                            },
                            "updated_at": {
                              "type": "integer",
                              "example": 1680618935000,
                              "default": 0
                            },
                            "ordered_at": {
                              "type": "integer",
                              "example": 1680052401000,
                              "default": 0
                            },
                            "price": {
                              "type": "string",
                              "example": "20000000"
                            },
                            "original_qty": {
                              "type": "string",
                              "example": "2"
                            },
                            "executed_qty": {
                              "type": "string",
                              "example": "2"
                            },
                            "canceled_qty": {
                              "type": "string",
                              "example": "0"
                            },
                            "remain_qty": {
                              "type": "string",
                              "example": "0"
                            },
                            "limit_price": {},
                            "traded_amount": {},
                            "original_amount": {},
                            "canceled_amount": {},
                            "is_triggered": {
                              "type": "boolean",
                              "example": true,
                              "default": true
                            },
                            "trigger_price": {
                              "type": "string",
                              "example": "36998000"
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        "deprecated": false,
        "x-readme": {
          "code-samples": [
            {
              "language": "python",
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport uuid\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = str(uuid.uuid4())\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', headers=headers)\n\n    return content\n\n\nprint(get_response(action='/v2.1/order/detail', payload={\n    'access_token': ACCESS_TOKEN,\n    'order_id': 'd85cc6af-b131-4398-b269-ddbafa760a39',\n    'quote_currency': 'KRW',\n    'target_currency': 'BTC',\n}))\n"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\nimport java.util.UUID;\n\npublic class FindOrderDetail {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/detail\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, String nonce, String quote_currency, String target_currency, String order_id){ }\n\n    public static void main(String[] args) {\n        var nonce = UUID.randomUUID().toString();\n        var payload = new Payload(ACCESS_TOKEN, nonce, \"krw\", \"btc\", \"0f930507-1e4d-11e9-9ec7-00e04c3600d7\");\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\nobject FindOrderDetail {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/detail\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    private data class Payload(val access_token: String, val nonce: String, val quote_currency: String, val target_currency: String, val order_id: String)\n\n    @JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = UUID.randomUUID().toString()\n        val payload = Payload(ACCESS_TOKEN, nonce, \"krw\", \"btc\", \"0f930507-1e4d-11e9-9ec7-00e04c3600d7\")\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: Payload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\nconst { v4: uuidv4 } = require('uuid');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = {\n    access_token: ACCESS_TOKEN,\n    nonce: uuidv4(),\n    order_id: '0f97a79f-1e4d-11e9-9ec7-00e04c3600d7',\n    quote_currency: 'KRW',\n    target_currency: 'BTC',\n};\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2.1/order/detail',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = uuid.New().String()\n\n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2.1/order/detail\", map[string]interface{}{\n\t\t\"access_token\":    accessToken,\n\t\t\"quote_currency\":  \"KRW\",\n\t\t\"target_currency\": \"BTC\",\n\t\t\"order_id\":        \"0f1c2fd6-1e4d-11e9-9ec7-00e04c3600d7\",\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
            }
          ],
          "samples-languages": [
            "python",
            "java",
            "kotlin",
            "javascript",
            "go"
          ]
        }
      }
    }
  },
  "x-readme": {
    "headers": [],
    "explorer-enabled": false,
    "proxy-enabled": true
  },
  "x-readme-fauxas": true,
  "_id": "68394678760f3c0030350497:68394678760f3c00303504e5"
}
```
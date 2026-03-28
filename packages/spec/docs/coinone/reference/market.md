# 개별 종목 정보 조회

마켓 별로 거래 가능한 개별 종목의 정보 조회

## Path Params

[block:parameters]
{
  "data": {
    "h-0": "field",
    "h-1": "type",
    "h-2": "required/optional",
    "h-3": "description",
    "0-0": "quote_currency",
    "0-1": "string",
    "0-2": "required",
    "0-3": "마켓 기준 통화  \n\\-예: KRW",
    "1-0": "target_currency",
    "1-1": "string",
    "1-2": "required",
    "1-3": "조회하려는 종목의 심볼  \n\\-예: BTC"
  },
  "cols": 4,
  "rows": 2,
  "align": [
    null,
    null,
    null,
    null
  ]
}
[/block]

## Response Body

[block:parameters]
{
  "data": {
    "h-0": "field",
    "h-1": "type",
    "h-2": "description",
    "0-0": "result",
    "0-1": "String",
    "0-2": "정상 반환 시 success, 에러 코드 반환 시 error",
    "1-0": "error_code",
    "1-1": "String",
    "1-2": "error 발생 시 에러코드 반환, 성공인 경우 0 반환",
    "2-0": "server_time",
    "2-1": "Number",
    "2-2": "반환 시점의 서버 시간 (ms)",
    "3-0": "markets",
    "3-1": "Array[Object]",
    "3-2": "종목 정보",
    "4-0": "\\-quote_currency",
    "4-1": "String",
    "4-2": "마켓 기준 통화",
    "5-0": "\\-target_currency",
    "5-1": "String",
    "5-2": "조회 요청한 종목",
    "6-0": "\\-price_unit",
    "6-1": "NumberString",
    "6-2": "가격 호가 단위 (해당 파라미터는 제거될 예정입니다. 개별 호가 단위 조회를 이용해 주세요)",
    "7-0": "\\-qty_unit",
    "7-1": "NumberString",
    "7-2": "주문 가능 수량 단위",
    "8-0": "\\-max_order_amount",
    "8-1": "NumberString",
    "8-2": "최대 주문 총액 (가격 X 주문량)",
    "9-0": "\\-max_price",
    "9-1": "NumberString",
    "9-2": "최대 주문 가능한 가격 (KRW 기준)",
    "10-0": "\\-max_qty",
    "10-1": "NumberString",
    "10-2": "최대 주문 가능한 수량 (종목 수량)",
    "11-0": "\\-min_order_amount",
    "11-1": "NumberString",
    "11-2": "최소 주문 총액 (가격 X 주문량)",
    "12-0": "\\-min_price",
    "12-1": "NumberString",
    "12-2": "최소 주문 가능한 가격 (KRW 기준)",
    "13-0": "\\-min_qty",
    "13-1": "NumberString",
    "13-2": "최소 주문 가능한 수량 (종목 수량)",
    "14-0": "\\-order_book_units",
    "14-1": "Array[NumberString]",
    "14-2": "오더북 단위 정보  \n표준 오더북(0.0), 최신 가격 정보에 따라 첫번째 뎁스 오더북, 두번째 뎁스 오더북이 보여짐",
    "15-0": "\\-maintenance_status",
    "15-1": "Integer",
    "15-2": "점검 여부 상태  \n0 - 정상  \n1 - 점검 중",
    "16-0": "\\-trade_status",
    "16-1": "Integer",
    "16-2": "거래 가능 여부 상태  \n0 - 매수/매도 불가 상태  \n1 - 매수/매도 가능 상태  \n2 - 매수 불가 상태  \n3 - 매도 불가 상태",
    "17-0": "\\-order_types",
    "17-1": "Array[String]",
    "17-2": "가능한 주문 방식  \nlimit: 지정가  \nmarket :시장가  \nstop_limit: 예약가"
  },
  "cols": 3,
  "rows": 18,
  "align": [
    "left",
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
    "title": "PUBLIC API",
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
    "/public/v2/markets/{quote_currency}/{target_currency}": {
      "get": {
        "summary": "개별 종목 정보 조회",
        "description": "마켓 별로 거래 가능한 개별 종목의 정보 조회",
        "operationId": "market",
        "parameters": [
          {
            "name": "quote_currency",
            "in": "path",
            "description": "마켓 기준 통화",
            "schema": {
              "type": "string",
              "default": "KRW"
            },
            "required": true
          },
          {
            "name": "target_currency",
            "in": "path",
            "description": "조회하려는 종목의 심볼",
            "schema": {
              "type": "string",
              "default": "BTC"
            },
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "200",
            "content": {
              "application/json": {
                "examples": {
                  "Result": {
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"server_time\": 1416895635000,\n  \"markets\": [\n    {\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"BTC\",\n      \"price_unit\": \"100.0\",\n      \"qty_unit\": \"0.0001\",\n      \"max_order_amount\": \"1000000000.0\",\n      \"max_price\": \"1000000000000.0\",\n      \"max_qty\": \"100000000.0\",\n      \"min_order_amount\": \"0.0001\",\n      \"min_price\": \"0.0001\",\n      \"min_qty\": \"0.00000001\",\n      \"order_book_units\": [\n        \"0.0\",\n        \"10000.0\",\n        \"100000.0\"\n      ],\n      \"maintenance_status\": 0,\n      \"trade_status\": 1,\n      \"order_types\": [\n        \"limit\",\n        \"market\"\n      ]\n    }\n  ]\n}"
                  }
                },
                "schema": {
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
                    "server_time": {
                      "type": "integer",
                      "example": 1416895635000,
                      "default": 0
                    },
                    "markets": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "quote_currency": {
                            "type": "string",
                            "example": "KRW"
                          },
                          "target_currency": {
                            "type": "string",
                            "example": "BTC"
                          },
                          "price_unit": {
                            "type": "string",
                            "example": "100.0"
                          },
                          "qty_unit": {
                            "type": "string",
                            "example": "0.0001"
                          },
                          "max_order_amount": {
                            "type": "string",
                            "example": "1000000000.0"
                          },
                          "max_price": {
                            "type": "string",
                            "example": "1000000000000.0"
                          },
                          "max_qty": {
                            "type": "string",
                            "example": "100000000.0"
                          },
                          "min_order_amount": {
                            "type": "string",
                            "example": "0.0001"
                          },
                          "min_price": {
                            "type": "string",
                            "example": "0.0001"
                          },
                          "min_qty": {
                            "type": "string",
                            "example": "0.00000001"
                          },
                          "order_book_units": {
                            "type": "array",
                            "items": {
                              "type": "string",
                              "example": "0.0"
                            }
                          },
                          "maintenance_status": {
                            "type": "integer",
                            "example": 0,
                            "default": 0
                          },
                          "trade_status": {
                            "type": "integer",
                            "example": 1,
                            "default": 0
                          },
                          "order_types": {
                            "type": "array",
                            "items": {
                              "type": "string",
                              "example": "limit"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "deprecated": false,
        "security": []
      }
    }
  },
  "x-readme": {
    "headers": [],
    "explorer-enabled": true,
    "proxy-enabled": true
  },
  "x-readme-fauxas": true,
  "_id": "68394678760f3c0030350496:68394678760f3c00303504c5"
}
```
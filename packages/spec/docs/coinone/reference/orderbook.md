# 오더북 조회

특정 종목의 오더북 정보 조회 (호가 단위 별)

## Path Params

[block:parameters]
{
  "data": {
    "h-0": "field",
    "h-1": "type",
    "h-2": "required/optional",
    "h-3": "description",
    "0-0": "quote_currency",
    "0-1": "String",
    "0-2": "required",
    "0-3": "마켓 기준 통화  \n\\*예: KRW",
    "1-0": "target_currency",
    "1-1": "String",
    "1-2": "required",
    "1-3": "조회하려는 종목의 심볼  \n\\*예: BTC"
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

## Query Params

[block:parameters]
{
  "data": {
    "h-0": "field",
    "h-1": "type",
    "h-2": "required/optional",
    "h-3": "description",
    "0-0": "size",
    "0-1": "Enum",
    "0-2": "optional",
    "0-3": "오더북 개수 (기본값 15)  \n(5, 10, 15, 16) 4개 값만 허용",
    "1-0": "order_book_unit",
    "1-1": "Number",
    "1-2": "optional",
    "1-3": "모아보기 단위로 종목 정보 조회 응답의 order_book_unit 값을 사용  \n(기본값 0.0)"
  },
  "cols": 4,
  "rows": 2,
  "align": [
    "left",
    "left",
    "left",
    "left"
  ]
}
[/block]

## Response Body

| field             | type           | description                                |
| :---------------- | :------------- | :----------------------------------------- |
| result            | String         | 정상 반환 시 success, 에러 코드 반환 시 error          |
| error\_code       | String         | error 발생 시 에러코드 반환, 성공인 경우 0 반환            |
| timestamp         | Number         | 오더북의 최근 업데이트 시간 (ms)                       |
| id                | String         | order book id 값, id 값이 클수록 최신 OrderBook 정보 |
| quote\_currency   | String         | 마켓 기준 통화                                   |
| target\_currency  | String         | 조회 요청한 종목                                  |
| order\_book\_unit | NumberString   | 현재 오더북 단위                                  |
| bids              | Array\[Object] | 매수 오더북 정보                                  |
| -price            | NumberString   | 매수 호가                                      |
| -qty              | NumberString   | 매수 수량                                      |
| asks              | Array\[Object] | 매도 오더북 정보                                  |
| -price            | NumberString   | 매도 호가                                      |
| -qty              | NumberString   | 매도 수량                                      |

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
    "/public/v2/orderbook/{quote_currency}/{target_currency}": {
      "get": {
        "summary": "오더북 조회",
        "description": "특정 종목의 오더북 정보 조회 (호가 단위 별)",
        "operationId": "orderbook",
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
          },
          {
            "name": "size",
            "in": "query",
            "description": "조회 하려는 오더북 개수 (기본값: 15)",
            "schema": {
              "type": "string",
              "enum": [
                "5",
                "10",
                "15",
                "16"
              ],
              "default": "15"
            }
          },
          {
            "name": "order_book_unit",
            "in": "query",
            "description": "Market API의 order_book_units 값 사용. 아닐경우, 표준 오더북 반환",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200",
            "content": {
              "application/json": {
                "examples": {
                  "Result": {
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"timestamp\": 1644488410702,\n  \"id\": \"1644488410702001\",\n  \"quote_currency\": \"KRW\",\n  \"target_currency\": \"BTC\",\n  \"order_book_unit\": \"1000.0\",\n  \"bids\": [\n    {\n      \"price\": \"75862000\",\n      \"qty\": \"0.5\"\n    },\n    {\n      \"price\": \"75860000\",\n      \"qty\": \"0.5\"\n    },\n    {\n      \"price\": \"75859000\",\n      \"qty\": \"0.5\"\n    },\n    {\n      \"price\": \"75857000\",\n      \"qty\": \"0.5\"\n    },\n    {\n      \"price\": \"75855000\",\n      \"qty\": \"0.5\"\n    }\n  ],\n  \"asks\": [\n    {\n      \"price\": \"75863000\",\n      \"qty\": \"22.5\"\n    },\n    {\n      \"price\": \"75865000\",\n      \"qty\": \"22\"\n    },\n    {\n      \"price\": \"75867000\",\n      \"qty\": \"11\"\n    },\n    {\n      \"price\": \"75869000\",\n      \"qty\": \"23\"\n    },\n    {\n      \"price\": \"75871000\",\n      \"qty\": \"24\"\n    }\n  ]\n}"
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
                    "timestamp": {
                      "type": "integer",
                      "example": 1644488410702,
                      "default": 0
                    },
                    "id": {
                      "type": "string",
                      "example": "1644488410702001"
                    },
                    "quote_currency": {
                      "type": "string",
                      "example": "KRW"
                    },
                    "target_currency": {
                      "type": "string",
                      "example": "BTC"
                    },
                    "order_book_unit": {
                      "type": "string",
                      "example": "1000.0"
                    },
                    "bids": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "price": {
                            "type": "string",
                            "example": "75862000"
                          },
                          "qty": {
                            "type": "string",
                            "example": "0.5"
                          }
                        }
                      }
                    },
                    "asks": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "price": {
                            "type": "string",
                            "example": "75863000"
                          },
                          "qty": {
                            "type": "string",
                            "example": "22.5"
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
        "deprecated": false
      }
    }
  },
  "x-readme": {
    "headers": [],
    "explorer-enabled": true,
    "proxy-enabled": true
  },
  "x-readme-fauxas": true,
  "_id": "68394678760f3c0030350496:68394678760f3c00303504a5"
}
```
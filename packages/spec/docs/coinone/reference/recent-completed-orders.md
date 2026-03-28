# 최근 체결 주문 조회

최신 순으로 체결된 주문 목록 조회

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
    "0-3": "마켓 기준 통화  \n\\-예: KRW",
    "1-0": "target_currency",
    "1-1": "String",
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
    "0-3": "조회할 목록 수 (기본:200)  \n(10, 50, 100, 150, 200 ) 5가지 값 허용"
  },
  "cols": 4,
  "rows": 1,
  "align": [
    "left",
    "left",
    "left",
    "left"
  ]
}
[/block]

## Response Body

| field              | type           | description                         |
| :----------------- | :------------- | :---------------------------------- |
| result             | String         | 정상 반환 시 success, 에러 코드 반환 시 error   |
| error\_code        | String         | error 발생 시 에러코드 반환, 성공인 경우 0 반환     |
| server\_time       | Number         | 반환 시점의 서버 시간 (ms)                   |
| quote\_currency    | String         | 마켓 기준 통화                            |
| target\_currency   | String         | 체결된 주문 목록의 종목                      |
| transactions       | Array\[Object] | 최근 체결된 주문 목록                        |
| -id                | String         | 주문 ID                               |
| -timestamp         | Number         | 주문 시간(ms)                           |
| -price             | NumberString   | 체결 시점 원화 기준 가격                      |
| -qty               | NumberString   | 체결 수량                               |
| -is\_seller\_maker | Boolean        | 매수/매도 여부, true인 경우 매도, false인 경우 매수 |

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
    "/public/v2/trades/{quote_currency}/{target_currency}": {
      "get": {
        "summary": "최근 체결 주문 조회",
        "description": "최신 순으로 체결된 주문 목록 조회",
        "operationId": "recent-completed-orders",
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
            "description": "한번에 조회할 목록 수 (기본:200)",
            "schema": {
              "type": "string",
              "enum": [
                "10",
                "50",
                "100",
                "150",
                "200"
              ],
              "default": "200"
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"server_time\": 1416895635000,\n  \"quote_currency\": \"krw\",\n  \"target_currency\": \"btc\",\n  \"transactions\": [\n    {\n      \"id\": \"1416893212001\",\n      \"timestamp\": 1416895634000,\n      \"price\": \"420000\",\n      \"qty\": \"0.1\",\n      \"is_seller_maker\": true\n    }\n  ]\n}"
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
                    "quote_currency": {
                      "type": "string",
                      "example": "krw"
                    },
                    "target_currency": {
                      "type": "string",
                      "example": "btc"
                    },
                    "transactions": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "example": "1416893212001"
                          },
                          "timestamp": {
                            "type": "integer",
                            "example": 1416895634000,
                            "default": 0
                          },
                          "price": {
                            "type": "string",
                            "example": "420000"
                          },
                          "qty": {
                            "type": "string",
                            "example": "0.1"
                          },
                          "is_seller_maker": {
                            "type": "boolean",
                            "example": true,
                            "default": true
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
  "_id": "68394678760f3c0030350496:68394678760f3c00303504ad"
}
```
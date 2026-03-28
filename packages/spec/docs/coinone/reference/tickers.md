# 전체 티커 정보 조회

마켓의 모든 티커 정보 조회

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
    "0-3": "마켓 기준 통화  \n\\-예: KRW"
  },
  "cols": 4,
  "rows": 1,
  "align": [
    null,
    null,
    null,
    null
  ]
}
[/block]

## Query Params

| field            | type    | required/optional | description             |
| :--------------- | :------ | :---------------- | :---------------------- |
| additional\_data | Boolean | optional          | 전일 정보 포함 여부(기본값: false) |

## Response Body

| field             | type           | description                       |
| :---------------- | :------------- | :-------------------------------- |
| result            | String         | 정상 반환 시 success, 에러 코드 반환 시 error |
| error\_code       | String         | error 발생 시 에러코드 반환, 성공인 경우 0 반환   |
| server\_time      | Number         | 반환 시점의 서버 시간 (ms)                 |
| tickers           | Array\[Object] | 티커 정보 목록                          |
| -quote\_currency  | String         | 마켓 기준 통화                          |
| -target\_currency | String         | 티커 종목 명                           |
| -timestamp        | Number         | 티커 생성 시점 (Unix time) (ms)         |
| -high             | NumberString   | 고가 (24시간 기준)                      |
| -low              | NumberString   | 저가 (24시간 기준)                      |
| -first            | NumberString   | 시가 (24시간 기준)                      |
| -last             | NumberString   | 종가  (24시간 기준)                     |
| -quote\_volume    | NumberString   | 24시간 기준 종목 체결 금액 (원화)             |
| -target\_volume   | NumberString   | 24시간 기준 종목 체결량 (종목)               |
| -best\_asks       | Array\[Object] | 매도 최저가의 오더북 정보                    |
| --price           | NumberString   | 매도 가격                             |
| --qty             | NumberString   | 매도 수량                             |
| -best\_bids       | Array\[Object] | 매수 최고가의 오더북 정보                    |
| --price           | NumberString   | 매수 가격                             |
| --qty             | NumberString   | 매수 수량                             |
| -id               | String         | 티커 별 ID 값으로 클수록 최신 티커 정보          |

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
    "/public/v2/ticker_new/{quote_currency}": {
      "get": {
        "summary": "전체 티커 정보 조회",
        "description": "마켓의 모든 티커 정보 조회",
        "operationId": "tickers",
        "parameters": [
          {
            "name": "quote_currency",
            "in": "path",
            "description": "조회하려는 마켓의 기준 통화",
            "schema": {
              "type": "string",
              "default": "KRW"
            },
            "required": true
          },
          {
            "name": "additional_data",
            "in": "query",
            "description": "입력 값이 true 이면 전일가 정보까지 조회",
            "schema": {
              "type": "boolean",
              "default": false
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"server_time\": 1416895635000,\n  \"tickers\": [\n    {\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"BTC\",\n      \"timestamp\": 1499341142000,\n      \"high\": \"3845000.0\",\n      \"low\": \"3819000.0\",\n      \"first\": \"3825000.0\",\n      \"last\": \"3833000.0\",\n      \"quote_volume\": \"10000.0\",\n      \"target_volume\": \"163.3828\",\n      \"best_asks\": [\n        {\n          \"price\": \"1200.0\",\n          \"qty\": \"1.234\"\n        }\n      ],\n      \"best_bids\": [\n        {\n          \"price\": \"1000.0\",\n          \"qty\": \"0.123\"\n        }\n      ],\n      \"id\": \"1499341142000001\"\n    },\n    {\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"BCH\",\n      \"timestamp\": 1499341142000,\n      \"high\": \"133500.0\",\n      \"low\": \"130500.0\",\n      \"first\": \"131500.0\",\n      \"last\": \"132000.0\",\n      \"quote_volume\": \"1000000.0\",\n      \"target_volume\": \"1770.8030\",\n      \"best_asks\": [\n        {\n          \"price\": \"1200.0\",\n          \"qty\": \"1.234\"\n        }\n      ],\n      \"best_bids\": [\n        {\n          \"price\": \"1000.0\",\n          \"qty\": \"0.123\"\n        }\n      ],\n      \"id\": \"1499341142000002\"\n    },\n    {\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"ETH\",\n      \"timestamp\": 1499351493000,\n      \"high\": \"120700.0\",\n      \"low\": \"117900.0\",\n      \"first\": \"118600.0\",\n      \"last\": \"118800.0\",\n      \"quote_volume\": \"10000000.0\",\n      \"target_volume\": \"3431.6560\",\n      \"best_asks\": [\n        {\n          \"price\": \"1200.0\",\n          \"qty\": \"1.234\"\n        }\n      ],\n      \"best_bids\": [\n        {\n          \"price\": \"1000.0\",\n          \"qty\": \"0.123\"\n        }\n      ],\n      \"id\": \"1499351493000001\"\n    }\n  ]\n}"
                  },
                  "OK (additional_data=true)": {
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"server_time\": 1416895635000,\n  \"tickers\": [\n    {\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"BTC\",\n      \"timestamp\": 1499341142000,\n      \"high\": \"3845000.0\",\n      \"low\": \"3819000.0\",\n      \"first\": \"3825000.0\",\n      \"last\": \"3833000.0\",\n      \"quote_volume\": \"10000.0\",\n      \"target_volume\": \"163.3828\",\n      \"best_asks\": [\n        {\n          \"price\": \"1200.0\",\n          \"qty\": \"1.234\"\n        }\n      ],\n      \"best_bids\": [\n        {\n          \"price\": \"1000.0\",\n          \"qty\": \"0.123\"\n        }\n      ],\n      \"id\": \"1499341142000001\",\n      \"yesterday_high\": \"39893000.0\",\n      \"yesterday_low\": \"37250000.0\",\n      \"yesterday_first\": \"37329000.0\",\n\t\t\t\"yesterday_last\": \"39590000.0\",\n\t\t\t\"yesterday_quote_volume\": \"60543502496.3\",\n\t\t\t\"yesterday_target_volume\": \"1562.9754\"\n    },\n    {\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"BCH\",\n      \"timestamp\": 1499341142000,\n      \"high\": \"133500.0\",\n      \"low\": \"130500.0\",\n      \"first\": \"131500.0\",\n      \"last\": \"132000.0\",\n      \"quote_volume\": \"1000000.0\",\n      \"target_volume\": \"1770.8030\",\n      \"best_asks\": [\n        {\n          \"price\": \"1200.0\",\n          \"qty\": \"1.234\"\n        }\n      ],\n      \"best_bids\": [\n        {\n          \"price\": \"1000.0\",\n          \"qty\": \"0.123\"\n        }\n      ],\n      \"id\": \"1499341142000002\"\n    },\n    {\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"ETH\",\n      \"timestamp\": 1499351493000,\n      \"high\": \"120700.0\",\n      \"low\": \"117900.0\",\n      \"first\": \"118600.0\",\n      \"last\": \"118800.0\",\n      \"quote_volume\": \"10000000.0\",\n      \"target_volume\": \"3431.6560\",\n      \"best_asks\": [\n        {\n          \"price\": \"1200.0\",\n          \"qty\": \"1.234\"\n        }\n      ],\n      \"best_bids\": [\n        {\n          \"price\": \"1000.0\",\n          \"qty\": \"0.123\"\n        }\n      ],\n      \"id\": \"1499351493000001\",\n      \"yesterday_high\": \"2539000.0\",\n\t\t\t\"yesterday_low\": \"2442000.0\",\n\t\t\t\"yesterday_first\": \"2449000.0\",\n\t\t\t\"yesterday_last\": \"2523000.0\",\n\t\t\t\"yesterday_quote_volume\": \"36533847991.9\",\n\t\t\t\"yesterday_target_volume\": \"14628.2616\"\n    }\n  ]\n}"
                  }
                },
                "schema": {
                  "oneOf": [
                    {
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
                        "tickers": {
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
                              "timestamp": {
                                "type": "integer",
                                "example": 1499341142000,
                                "default": 0
                              },
                              "high": {
                                "type": "string",
                                "example": "3845000.0"
                              },
                              "low": {
                                "type": "string",
                                "example": "3819000.0"
                              },
                              "first": {
                                "type": "string",
                                "example": "3825000.0"
                              },
                              "last": {
                                "type": "string",
                                "example": "3833000.0"
                              },
                              "quote_volume": {
                                "type": "string",
                                "example": "10000.0"
                              },
                              "target_volume": {
                                "type": "string",
                                "example": "163.3828"
                              },
                              "best_asks": {
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "price": {
                                      "type": "string",
                                      "example": "1200.0"
                                    },
                                    "qty": {
                                      "type": "string",
                                      "example": "1.234"
                                    }
                                  }
                                }
                              },
                              "best_bids": {
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "price": {
                                      "type": "string",
                                      "example": "1000.0"
                                    },
                                    "qty": {
                                      "type": "string",
                                      "example": "0.123"
                                    }
                                  }
                                }
                              },
                              "id": {
                                "type": "string",
                                "example": "1499341142000001"
                              }
                            }
                          }
                        }
                      }
                    },
                    {
                      "title": "OK (additional_data=true)",
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
                        "tickers": {
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
                              "timestamp": {
                                "type": "integer",
                                "example": 1499341142000,
                                "default": 0
                              },
                              "high": {
                                "type": "string",
                                "example": "3845000.0"
                              },
                              "low": {
                                "type": "string",
                                "example": "3819000.0"
                              },
                              "first": {
                                "type": "string",
                                "example": "3825000.0"
                              },
                              "last": {
                                "type": "string",
                                "example": "3833000.0"
                              },
                              "quote_volume": {
                                "type": "string",
                                "example": "10000.0"
                              },
                              "target_volume": {
                                "type": "string",
                                "example": "163.3828"
                              },
                              "best_asks": {
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "price": {
                                      "type": "string",
                                      "example": "1200.0"
                                    },
                                    "qty": {
                                      "type": "string",
                                      "example": "1.234"
                                    }
                                  }
                                }
                              },
                              "best_bids": {
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "price": {
                                      "type": "string",
                                      "example": "1000.0"
                                    },
                                    "qty": {
                                      "type": "string",
                                      "example": "0.123"
                                    }
                                  }
                                }
                              },
                              "id": {
                                "type": "string",
                                "example": "1499341142000001"
                              },
                              "yesterday_high": {
                                "type": "string",
                                "example": "39893000.0"
                              },
                              "yesterday_low": {
                                "type": "string",
                                "example": "37250000.0"
                              },
                              "yesterday_first": {
                                "type": "string",
                                "example": "37329000.0"
                              },
                              "yesterday_last": {
                                "type": "string",
                                "example": "39590000.0"
                              },
                              "yesterday_quote_volume": {
                                "type": "string",
                                "example": "60543502496.3"
                              },
                              "yesterday_target_volume": {
                                "type": "string",
                                "example": "1562.9754"
                              }
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
  "_id": "68394678760f3c0030350496:68394678760f3c00303504ae"
}
```
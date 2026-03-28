# 오더북 조회

특정 종목의 오더북 정보 조회

> 🚧 해당 API는 Deprecated되어 Public API V2 '오더북 조회' API를 사용하시기 바랍니다
>
> [V2 오더북 조회](https://coinone.readme.io/v1.0/reference/orderbook)

## Response Body

| field     | type           | description                       |
| :-------- | :------------- | :-------------------------------- |
| result    | String         | 정상 반환 시 success, 에러 코드 반환 시 error |
| errorCode | String         | error 발생 시 에러코드 반환, 성공인 경우 0 반환   |
| timestamp | NumberString   | 반환 시점의 서버 시간                      |
| currency  | String         | 조회 요청한 종목                         |
| bid       | Array\[Object] | 매수 오더북 정보                         |
| - price   | NumberString   | 매수 호가                             |
| - qty     | NumberString   | 매수 수량                             |
| ask       | Array\[Object] | 매도 오더북 정보                         |
| - price   | NumberString   | 매도 호가                             |
| - qty     | NumberString   | 매도 수량                             |

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
    "/orderbook": {
      "get": {
        "summary": "오더북 조회",
        "description": "특정 종목의 오더북 정보 조회",
        "operationId": "orderbook-deprecated",
        "parameters": [
          {
            "name": "currency",
            "in": "query",
            "description": "조회하려는 종목의 심볼",
            "schema": {
              "type": "string",
              "default": "BTC"
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
                    "value": "{\n  \"errorCode\": \"0\",\n  \"timestamp\": \"1416895635\",\n  \"currency\": \"btc\",\n  \"bid\": [\n    {\n      \"price\": \"414000.0\",\n      \"qty\": \"11.4946\"\n    },\n    {\n      \"price\": \"413000.0\",\n      \"qty\": \"6.74\"\n    },\n    {\n      \"price\": \"412000.0\",\n      \"qty\": \"3.248\"\n    },\n    {\n      \"price\": \"411000.0\",\n      \"qty\": \"1.284\"\n    }\n  ],\n  \"ask\": [\n    {\n      \"price\": \"420000.0\",\n      \"qty\": \"10.9186\"\n    },\n    {\n      \"price\": \"421000.0\",\n      \"qty\": \"7.32\"\n    },\n    {\n      \"price\": \"422000.0\",\n      \"qty\": \"5.004\"\n    },\n    {\n      \"price\": \"423000.0\",\n      \"qty\": \"3.726\"\n    }\n  ],\n  \"result\": \"success\"\n}"
                  }
                },
                "schema": {
                  "type": "object",
                  "properties": {
                    "errorCode": {
                      "type": "string",
                      "example": "0"
                    },
                    "timestamp": {
                      "type": "string",
                      "example": "1416895635"
                    },
                    "currency": {
                      "type": "string",
                      "example": "btc"
                    },
                    "bid": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "price": {
                            "type": "string",
                            "example": "414000.0"
                          },
                          "qty": {
                            "type": "string",
                            "example": "11.4946"
                          }
                        }
                      }
                    },
                    "ask": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "price": {
                            "type": "string",
                            "example": "420000.0"
                          },
                          "qty": {
                            "type": "string",
                            "example": "10.9186"
                          }
                        }
                      }
                    },
                    "result": {
                      "type": "string",
                      "example": "success"
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
  "_id": "68394678760f3c0030350496:68394678760f3c003035049a"
}
```
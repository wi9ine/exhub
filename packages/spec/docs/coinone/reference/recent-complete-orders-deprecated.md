# 최근 체결 주문 조회

최신 순으로 체결된 주문 목록 조회

> 🚧 해당 API는 Deprecated되어 Public API V2 '최근 체결 주문 조회' API를 사용하시기 바랍니다
>
> [V2 최근 체결 주문 조회](https://coinone.readme.io/v1.0/reference/recent-completed-orders)

## Response Body

| field          | type           | description                       |
| :------------- | :------------- | :-------------------------------- |
| result         | String         | 정상 반환 시 success, 에러 코드 반환 시 error |
| errorCode      | String         | error 발생 시 에러코드 반환, 성공인 경우 0 반환   |
| timestamp      | NumberString   | 반환 시점의 서버 시간                      |
| currency       | String         | 조회 요청한 종목                         |
| completeOrders | Array\[Object] | 배열 형태의 체결 주문 목록                   |
| - id           | String         | 주문 식별 ID                          |
| - timestamp    | NumberString   | 체결 시점의 타임스탬프                      |
| - price        | NumberString   | 체결 가격                             |
| - qty          | NumberString   | 체결 수량                             |
| - is\_ask      | NumberString   | maker 주문인 경우 1                   |

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
    "/trades": {
      "get": {
        "summary": "최근 체결 주문 조회",
        "description": "최신 순으로 체결된 주문 목록 조회",
        "operationId": "recent-complete-orders-deprecated",
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
                    "value": "{\n  \"result\": \"success\",\n  \"errorCode\": \"0\",\n  \"timestamp\": \"1416895635\",\n  \"currency\": \"BTC\",\n  \"completeOrders\": [\n    {\n      \"id\": \"1416893212123001\",\n      \"timestamp\": \"1416893212\",\n      \"price\": \"420000.0\",\n      \"qty\": \"0.1\",\n      \"is_ask\": \"1\"\n    }\n  ]\n}"
                  }
                },
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "string",
                      "example": "success"
                    },
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
                      "example": "BTC"
                    },
                    "completeOrders": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "example": "1416893212123001"
                          },
                          "timestamp": {
                            "type": "string",
                            "example": "1416893212"
                          },
                          "price": {
                            "type": "string",
                            "example": "420000.0"
                          },
                          "qty": {
                            "type": "string",
                            "example": "0.1"
                          },
                          "is_ask": {
                            "type": "string",
                            "example": "1"
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
  "_id": "68394678760f3c0030350496:68394678760f3c00303504b3"
}
```
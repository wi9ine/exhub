# 개별 가상자산 정보 조회

특정 종목의 정보 조회 (심볼 정보, 입/출금 가능여부, 입/출금 수수료, 최소 출금 가능 금액 등)

## Path Params

| field    | type   | required/optional | description              |
| :------- | :----- | :---------------- | :----------------------- |
| currency | String | required          | 조회하고자 하는 가상자산 심볼(예: BTC) |

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
    "3-0": "currencies",
    "3-1": "Array[Object]",
    "3-2": "반환하는 종목 정보 배열",
    "4-0": "-name",
    "4-1": "String",
    "4-2": "종목의 영문명",
    "5-0": "-symbol",
    "5-1": "String",
    "5-2": "종목의 심볼",
    "6-0": "-deposit_status",
    "6-1": "String",
    "6-2": "입금 가능 여부 상태(enum)  \n-normal : 입금 가능  \n-suspended : 입금 정지",
    "7-0": "-withdraw_status",
    "7-1": "String",
    "7-2": "출금 가능 여부 상태(enum)  \n-normal: 출금 가능  \n-suspended : 출금 정지",
    "8-0": "-deposit_confirm_count",
    "8-1": "Number",
    "8-2": "입금 컨펌 수",
    "9-0": "-max_precision",
    "9-1": "Number",
    "9-2": "출금 가능한 소숫점 아래 자릿수  \n예) 0.12345678 까지가능하면 max_precision = 8",
    "10-0": "-deposit_fee",
    "10-1": "NumberString",
    "10-2": "입금 수수료",
    "11-0": "-withdrawal_min_amount",
    "11-1": "NumberString",
    "11-2": "최소 출금 가능 수량",
    "12-0": "-withdrawal_fee",
    "12-1": "NumberString",
    "12-2": "출금 수수료"
  },
  "cols": 3,
  "rows": 13,
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
    "/public/v2/currencies/{currency}": {
      "get": {
        "summary": "개별 가상자산 정보 조회",
        "description": "특정 종목의 정보 조회 (심볼 정보, 입/출금 가능여부, 입/출금 수수료, 최소 출금 가능 금액 등)",
        "operationId": "currency",
        "parameters": [
          {
            "name": "currency",
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"server_time\": 1644541746590,\n  \"currencies\": [\n    {\n      \"name\": \"Bitcoin\",\n      \"symbol\": \"BTC\",\n      \"deposit_status\": \"normal\",\n      \"withdraw_status\": \"normal\",\n      \"deposit_confirm_count\": 2,\n      \"max_precision\": 8,\n      \"deposit_fee\": \"0.0\",\n      \"withdrawal_min_amount\": \"0.0001\",\n      \"withdrawal_fee\": \"0.0015\"\n    }\n  ]\n}"
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
                      "example": 1644541746590,
                      "default": 0
                    },
                    "currencies": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "example": "Bitcoin"
                          },
                          "symbol": {
                            "type": "string",
                            "example": "BTC"
                          },
                          "deposit_status": {
                            "type": "string",
                            "example": "normal"
                          },
                          "withdraw_status": {
                            "type": "string",
                            "example": "normal"
                          },
                          "deposit_confirm_count": {
                            "type": "integer",
                            "example": 2,
                            "default": 0
                          },
                          "max_precision": {
                            "type": "integer",
                            "example": 8,
                            "default": 0
                          },
                          "deposit_fee": {
                            "type": "string",
                            "example": "0.0"
                          },
                          "withdrawal_min_amount": {
                            "type": "string",
                            "example": "0.0001"
                          },
                          "withdrawal_fee": {
                            "type": "string",
                            "example": "0.0015"
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
  "_id": "68394678760f3c0030350496:68394678760f3c00303504c4"
}
```
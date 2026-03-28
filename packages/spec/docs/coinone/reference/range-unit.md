# 개별 호가 단위 조회

개별 종목의 가격 단위 별 호가 단위 조회

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

| field               | type           | description                        |
| :------------------ | :------------- | :--------------------------------- |
| result              | string         | 정상 반환 시 success, 에러 코드 반환 시 error  |
| error\_code         | string         | error 발생 시 에러코드 반환, 성공인 경우 0 반환    |
| range\_price\_units | Array\[Object] | 배열 형태로 가상자산 가격 단위 별 전체 호가 단위 정보 반환 |
| - range\_min        | integer        | 가격 범위의 최소 가격                       |
| - next\_range\_min  | integer        | 가격 범위의 최대 가격                       |
| - price\_unit       | double         | 가격 범위에 해당하는 호가 단위                  |

***

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
    "/public/v2/range_units/{quote_currency}/{target_currency}": {
      "get": {
        "summary": "개별 호가 단위 조회",
        "description": "개별 종목의 가격 단위 별 호가 단위 조회",
        "operationId": "range-unit",
        "parameters": [
          {
            "name": "quote_currency",
            "in": "path",
            "schema": {
              "type": "string",
              "default": "KRW"
            },
            "required": true
          },
          {
            "name": "target_currency",
            "in": "path",
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"range_price_units\": [\n    {\n      \"range_min\": 0,\n      \"next_range_min\": 1,\n      \"price_unit\": 0.0001\n    },\n    {\n      \"range_min\": 1,\n      \"next_range_min\": 10,\n      \"price_unit\": 0.001\n    },\n    {\n      \"range_min\": 10,\n      \"next_range_min\": 100,\n      \"price_unit\": 0.01\n    },\n    {\n      \"range_min\": 100,\n      \"next_range_min\": 1000,\n      \"price_unit\": 0.1\n    },\n    {\n      \"range_min\": 1000,\n      \"next_range_min\": 5000,\n      \"price_unit\": 1\n    },\n    {\n      \"range_min\": 5000,\n      \"next_range_min\": 10000,\n      \"price_unit\": 5\n    },\n    {\n      \"range_min\": 10000,\n      \"next_range_min\": 50000,\n      \"price_unit\": 10\n    },\n    {\n      \"range_min\": 50000,\n      \"next_range_min\": 100000,\n      \"price_unit\": 50\n    },\n    {\n      \"range_min\": 100000,\n      \"next_range_min\": 500000,\n      \"price_unit\": 100\n    },\n    {\n      \"range_min\": 500000,\n      \"next_range_min\": 1000000,\n      \"price_unit\": 500\n    },\n    {\n      \"range_min\": 1000000,\n      \"next_range_min\": 10000000000,\n      \"price_unit\": 1000\n    }\n  ]\n}"
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
                    "range_price_units": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "range_min": {
                            "type": "integer",
                            "example": 0,
                            "default": 0
                          },
                          "next_range_min": {
                            "type": "integer",
                            "example": 1,
                            "default": 0
                          },
                          "price_unit": {
                            "type": "number",
                            "example": 0.0001,
                            "default": 0
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
  "_id": "68394678760f3c0030350496:68394678760f3c00303504fc"
}
```
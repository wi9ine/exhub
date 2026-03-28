# 캔들 차트 조회

특정 종목의 캔들 차트 조회

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
    "0-0": "interval",
    "0-1": "Enum",
    "0-2": "required",
    "0-3": "차트 단위  \n1m, 3m, 5m, 10m, 15m, 30m, 1h, 2h, 4h, 6h, 1d, 1w, 1mon 허용값",
    "1-0": "timestamp",
    "1-1": "Number",
    "1-2": "optional",
    "1-3": "마지막 캔들의 타임스탬프 (UTC 기준 시간 입력, Unix time, ms)",
    "2-0": "size",
    "2-1": "Number",
    "2-2": "optional",
    "2-3": "조회할 캔들 수 (최소 1~최대 500) 미입력시 default: 200"
  },
  "cols": 4,
  "rows": 3,
  "align": [
    "left",
    "left",
    "left",
    "left"
  ]
}
[/block]

## Response Body

| field           | type           | description                       |
| :-------------- | :------------- | :-------------------------------- |
| result          | String         | 정상 반환 시 success, 에러 코드 반환 시 error |
| error\_code     | String         | error 발생 시 에러코드 반환, 성공인 경우 0 반환   |
| is\_last        | Boolean        | 차트의 마지막 캔들일 경우 true 반환            |
| chart           | Array\[Object] | 차트의 캔들스틱 정보                       |
| -timestamp      | Number         | 캔들스틱의 타임스탬프 (unix time, ms)       |
| -open           | NumberString   | 시가                                |
| -high           | NumberString   | 고가                                |
| -low            | NumberString   | 저가                                |
| -close          | NumberString   | 종가                                |
| -target\_volume | NumberString   | 해당 종목의 거래량                       |
| -quote\_volume  | NumberString   | 해당 종목의 거래 금액 (원화)                 |

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
    "/public/v2/chart/{quote_currency}/{target_currency}": {
      "get": {
        "summary": "캔들 차트 조회",
        "description": "특정 종목의 캔들 차트 조회",
        "operationId": "chart",
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
            "name": "interval",
            "in": "query",
            "description": "차트 간격",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "1m",
                "3m",
                "5m",
                "15m",
                "30m",
                "1h",
                "2h",
                "4h",
                "6h",
                "1d",
                "1w",
                "1mon"
              ]
            }
          },
          {
            "name": "timestamp",
            "in": "query",
            "description": "마지막 캔들의 타임스탬프 (UTC 기준 시간 입력, Unix time, ms)",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "size",
            "in": "query",
            "description": "조회할 캔들 수 (최소 1~최대 500) 미입력시 default: 200",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 200
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"is_last\": false,\n  \"chart\": [\n    {\n      \"timestamp\": 1582253100000,\n      \"open\": \"15133000.0\",\n      \"high\": \"15133000.0\",\n      \"low\": \"15133000.0\",\n      \"close\": \"15133000.0\",\n      \"target_volume\": \"0.0\",\n      \"quote_volume\": \"0.0\"\n    },\n    {\n      \"timestamp\": 1582252200000,\n      \"open\": \"15133000.0\",\n      \"high\": \"15133000.0\",\n      \"low\": \"15133000.0\",\n      \"close\": \"15133000.0\",\n      \"target_volume\": \"0.0\",\n      \"quote_volume\": \"0.0\"\n    },\n    {\n      \"timestamp\": 1582251300000,\n      \"open\": \"15133000.0\",\n      \"high\": \"15133000.0\",\n      \"low\": \"15133000.0\",\n      \"close\": \"15133000.0\",\n      \"target_volume\": \"0.0\",\n      \"quote_volume\": \"0.0\"\n    },\n    {\n      \"timestamp\": 1582250400000,\n      \"open\": \"15133000.0\",\n      \"high\": \"15133000.0\",\n      \"low\": \"15133000.0\",\n      \"close\": \"15133000.0\",\n      \"target_volume\": \"0.0\",\n      \"quote_volume\": \"0.0\"\n    },\n    {\n      \"timestamp\": 1582249500000,\n      \"open\": \"15133000.0\",\n      \"high\": \"15133000.0\",\n      \"low\": \"15133000.0\",\n      \"close\": \"15133000.0\",\n      \"target_volume\": \"0.0\",\n      \"quote_volume\": \"0.0\"\n    }\n  ]\n}"
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
                    "is_last": {
                      "type": "boolean",
                      "example": false,
                      "default": true
                    },
                    "chart": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "timestamp": {
                            "type": "integer",
                            "example": 1582253100000,
                            "default": 0
                          },
                          "open": {
                            "type": "string",
                            "example": "15133000.0"
                          },
                          "high": {
                            "type": "string",
                            "example": "15133000.0"
                          },
                          "low": {
                            "type": "string",
                            "example": "15133000.0"
                          },
                          "close": {
                            "type": "string",
                            "example": "15133000.0"
                          },
                          "target_volume": {
                            "type": "string",
                            "example": "0.0"
                          },
                          "quote_volume": {
                            "type": "string",
                            "example": "0.0"
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
  "_id": "68394678760f3c0030350496:68394678760f3c00303504b2"
}
```
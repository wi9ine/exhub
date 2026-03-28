# 티커 정보 조회 UTC

UTC 기준으로 마켓의 모든 티커 정보 조회

> 🚧 해당 API는 Deprecated되어 Public API V2 '전체 티커 정보 조회 (UTC)' API를 사용하시기 바랍니다
>
> [V2 전체 티커 정보 조회 (UTC)](https://coinone.readme.io/v1.0/reference/utc-tickers)

## Response Body

| field             | type         | description                       |
| :---------------- | :----------- | :-------------------------------- |
| result            | String       | 정상 반환 시 success, 에러 코드 반환 시 error |
| errorCode         | String       | error 발생 시 에러코드 반환, 성공인 경우 0 반환   |
| timestamp         | NumberString | 반환 시점의 서버 시간                      |
| currency          | String       | 조회 요청한 종목                         |
| high              | NumberString | 고가                                |
| low               | NumberString | 저가                                |
| first             | NumberString | 시가                                |
| last              | NumberString | 종가                                |
| volume            | NumberString | 거래량                               |
| yesterday\_high   | NumberString | 24시간 이전 고가                        |
| yesterday\_low    | NumberString | 24시간 이전 저가                        |
| yesterday\_first  | NumberString | 24시간 이전 시가                        |
| yesterday\_last   | NumberString | 24시간 이전 종가                        |
| yesterday\_volume | NumberString | 24시간 이전 거래량                       |

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
    "/ticker_utc": {
      "get": {
        "summary": "\b티커 정보 조회 UTC",
        "description": "UTC 기준으로 마켓의 모든 티커 정보 조회",
        "operationId": "ticker-utc-deprecated",
        "parameters": [
          {
            "name": "currency",
            "in": "query",
            "description": "조회하려는 종목의 심볼. 유효하지 않은 심볼 입력 시 전체 티커 정보가 조회 됨",
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
                    "value": "{\n    \"result\": \"success\",\n    \"errorCode\": \"0\",\n    \"timestamp\": \"1681288295\",\n    \"currency\": \"btc\",\n    \"first\": \"40017000.0\",\n    \"low\": \"39648000.0\",\n    \"high\": \"40191000.0\",\n    \"last\": \"39957000.0\",\n    \"volume\": \"1505.4987\",\n    \"yesterday_first\": \"38914000.0\",\n    \"yesterday_low\": \"38882000.0\",\n    \"yesterday_high\": \"40181000.0\",\n    \"yesterday_last\": \"40017000.0\",\n    \"yesterday_volume\": \"1564.0236\"\n}"
                  },
                  "OK (invalid Currency)": {
                    "value": "{\n  \"errorCode\": \"0\",\n  \"result\": \"success\",\n  \"timestamp\": \"1416895635\",\n  \"btc\": {\n    \"currency\": \"btc\",\n    \"high\": \"3845000.0\",\n    \"low\": \"3819000.0\",\n    \"first\": \"3825000.0\",\n    \"last\": \"3833000.0\",\n    \"volume\": \"163.3828\",\n    \"yesterday_high\": \"3846000.0\",\n    \"yesterday_low\": \"3800000.0\",\n    \"yesterday_first\": \"3829000.0\",\n    \"yesterday_last\": \"3827000.0\",\n    \"yesterday_volume\": \"191.0856\"\n  },\n  \"bch\": {\n    \"currency\": \"bch\",\n    \"high\": \"133500.0\",\n    \"low\": \"130500.0\",\n    \"first\": \"131500.0\",\n    \"last\": \"132000.0\",\n    \"volume\": \"1770.8030\",\n    \"yesterday_high\": \"133500.0\",\n    \"yesterday_low\": \"129000.0\",\n    \"yesterday_first\": \"133000.0\",\n    \"yesterday_last\": \"131000.0\",\n    \"yesterday_volume\": \"2948.2981\"\n  },\n  \"eth\": {\n    \"currency\": \"eth\",\n    \"high\": \"120700.0\",\n    \"low\": \"117900.0\",\n    \"first\": \"118600.0\",\n    \"last\": \"118800.0\",\n    \"volume\": \"3431.6560\",\n    \"yesterday_high\": \"120800.0\",\n    \"yesterday_low\": \"117400.0\",\n    \"yesterday_first\": \"120600.0\",\n    \"yesterday_last\": \"118700.0\",\n    \"yesterday_volume\": \"6883.8646\"\n  }\n}"
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
                        "errorCode": {
                          "type": "string",
                          "example": "0"
                        },
                        "timestamp": {
                          "type": "string",
                          "example": "1681288295"
                        },
                        "currency": {
                          "type": "string",
                          "example": "btc"
                        },
                        "first": {
                          "type": "string",
                          "example": "40017000.0"
                        },
                        "low": {
                          "type": "string",
                          "example": "39648000.0"
                        },
                        "high": {
                          "type": "string",
                          "example": "40191000.0"
                        },
                        "last": {
                          "type": "string",
                          "example": "39957000.0"
                        },
                        "volume": {
                          "type": "string",
                          "example": "1505.4987"
                        },
                        "yesterday_first": {
                          "type": "string",
                          "example": "38914000.0"
                        },
                        "yesterday_low": {
                          "type": "string",
                          "example": "38882000.0"
                        },
                        "yesterday_high": {
                          "type": "string",
                          "example": "40181000.0"
                        },
                        "yesterday_last": {
                          "type": "string",
                          "example": "40017000.0"
                        },
                        "yesterday_volume": {
                          "type": "string",
                          "example": "1564.0236"
                        }
                      }
                    },
                    {
                      "title": "OK (invalid Currency)",
                      "type": "object",
                      "properties": {
                        "errorCode": {
                          "type": "string",
                          "example": "0"
                        },
                        "result": {
                          "type": "string",
                          "example": "success"
                        },
                        "timestamp": {
                          "type": "string",
                          "example": "1416895635"
                        },
                        "btc": {
                          "type": "object",
                          "properties": {
                            "currency": {
                              "type": "string",
                              "example": "btc"
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
                            "volume": {
                              "type": "string",
                              "example": "163.3828"
                            },
                            "yesterday_high": {
                              "type": "string",
                              "example": "3846000.0"
                            },
                            "yesterday_low": {
                              "type": "string",
                              "example": "3800000.0"
                            },
                            "yesterday_first": {
                              "type": "string",
                              "example": "3829000.0"
                            },
                            "yesterday_last": {
                              "type": "string",
                              "example": "3827000.0"
                            },
                            "yesterday_volume": {
                              "type": "string",
                              "example": "191.0856"
                            }
                          }
                        },
                        "bch": {
                          "type": "object",
                          "properties": {
                            "currency": {
                              "type": "string",
                              "example": "bch"
                            },
                            "high": {
                              "type": "string",
                              "example": "133500.0"
                            },
                            "low": {
                              "type": "string",
                              "example": "130500.0"
                            },
                            "first": {
                              "type": "string",
                              "example": "131500.0"
                            },
                            "last": {
                              "type": "string",
                              "example": "132000.0"
                            },
                            "volume": {
                              "type": "string",
                              "example": "1770.8030"
                            },
                            "yesterday_high": {
                              "type": "string",
                              "example": "133500.0"
                            },
                            "yesterday_low": {
                              "type": "string",
                              "example": "129000.0"
                            },
                            "yesterday_first": {
                              "type": "string",
                              "example": "133000.0"
                            },
                            "yesterday_last": {
                              "type": "string",
                              "example": "131000.0"
                            },
                            "yesterday_volume": {
                              "type": "string",
                              "example": "2948.2981"
                            }
                          }
                        },
                        "eth": {
                          "type": "object",
                          "properties": {
                            "currency": {
                              "type": "string",
                              "example": "eth"
                            },
                            "high": {
                              "type": "string",
                              "example": "120700.0"
                            },
                            "low": {
                              "type": "string",
                              "example": "117900.0"
                            },
                            "first": {
                              "type": "string",
                              "example": "118600.0"
                            },
                            "last": {
                              "type": "string",
                              "example": "118800.0"
                            },
                            "volume": {
                              "type": "string",
                              "example": "3431.6560"
                            },
                            "yesterday_high": {
                              "type": "string",
                              "example": "120800.0"
                            },
                            "yesterday_low": {
                              "type": "string",
                              "example": "117400.0"
                            },
                            "yesterday_first": {
                              "type": "string",
                              "example": "120600.0"
                            },
                            "yesterday_last": {
                              "type": "string",
                              "example": "118700.0"
                            },
                            "yesterday_volume": {
                              "type": "string",
                              "example": "6883.8646"
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
  "_id": "68394678760f3c0030350496:68394678760f3c00303504b9"
}
```
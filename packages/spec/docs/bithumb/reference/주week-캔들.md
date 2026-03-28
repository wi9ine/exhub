# 주(Week) 캔들

> 예시코드는 JavaScript, Python, JAVA에 한해서만 제공합니다.

<br />

## **Request Parameters**

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        필드
      </th>

      <th>
        설명
      </th>

      <th>
        타입
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        market
      </td>

      <td>
        마켓 코드 (ex. KRW-BTC)
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        to
      </td>

      <td>
        마지막 캔들 시각 (exclusive).\
        ISO8061 포맷 (yyyy-MM-dd HH:mm:ss or yyyy-MM-ddTHH:mm:ss). 기본적으로 KST 기준 시간이며 비워서 요청시 가장 최근 캔들
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        count
      </td>

      <td>
        캔들 개수(최대 200개까지 요청 가능), 기본값 1
      </td>

      <td>
        Integer
      </td>
    </tr>
  </tbody>
</Table>

## **Response**

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        필드
      </th>

      <th>
        설명
      </th>

      <th>
        타입
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        market
      </td>

      <td>
        마켓명
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        candle\_date\_time\_utc
      </td>

      <td>
        캔들 기준 시각(UTC 기준)\
        포맷: `yyyy-MM-dd'T'HH:mm:ss`
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        candle\_date\_time\_kst
      </td>

      <td>
        캔들 기준 시각(KST 기준)\
        포맷: `yyyy-MM-dd'T'HH:mm:ss`
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        opening\_price
      </td>

      <td>
        시가
      </td>

      <td>
        Double
      </td>
    </tr>

    <tr>
      <td>
        high\_price
      </td>

      <td>
        고가
      </td>

      <td>
        Double
      </td>
    </tr>

    <tr>
      <td>
        low\_price
      </td>

      <td>
        저가
      </td>

      <td>
        Double
      </td>
    </tr>

    <tr>
      <td>
        trade\_price
      </td>

      <td>
        종가
      </td>

      <td>
        Double
      </td>
    </tr>

    <tr>
      <td>
        timestamp
      </td>

      <td>
        캔들 종료 시각(KST 기준)
      </td>

      <td>
        Long
      </td>
    </tr>

    <tr>
      <td>
        candle\_acc\_trade\_price
      </td>

      <td>
        누적 거래 금액
      </td>

      <td>
        Double
      </td>
    </tr>

    <tr>
      <td>
        candle\_acc\_trade\_volume
      </td>

      <td>
        누적 거래량
      </td>

      <td>
        Double
      </td>
    </tr>

    <tr>
      <td>
        first\_day\_of\_period
      </td>

      <td>
        캔들 기간의 가장 첫 날
      </td>

      <td>
        String
      </td>
    </tr>
  </tbody>
</Table>

# OpenAPI definition

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "open_api_public",
    "version": "2.1.5"
  },
  "servers": [
    {
      "url": "https://api.bithumb.com/v1"
    }
  ],
  "security": [
    {}
  ],
  "paths": {
    "/candles/weeks": {
      "get": {
        "summary": "주(Week) 캔들",
        "description": "",
        "operationId": "주week-캔들",
        "parameters": [
          {
            "name": "market",
            "in": "query",
            "description": "마켓 코드 (ex. KRW-BTC)",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "to",
            "in": "query",
            "description": "마지막 캔들 시각 (exclusive). 비워서 요청시 가장 최근 캔들",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "count",
            "in": "query",
            "description": "캔들 개수(최대 200개까지 요청 가능)",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 1
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
                    "value": "[\n  {\n    \"market\": \"KRW-BTC\",\n    \"candle_date_time_utc\": \"2018-04-16T00:00:00\",\n    \"candle_date_time_kst\": \"2018-04-16T09:00:00\",\n    \"opening_price\": 8665000,\n    \"high_price\": 8840000,\n    \"low_price\": 8360000,\n    \"trade_price\": 8611000,\n    \"timestamp\": 1524046708995,\n    \"candle_acc_trade_price\": 466989414916.1301,\n    \"candle_acc_trade_volume\": 54410.56660813,\n    \"first_day_of_period\": \"2018-04-16\"\n  }\n]"
                  }
                },
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "market": {
                        "type": "string",
                        "example": "KRW-BTC"
                      },
                      "candle_date_time_utc": {
                        "type": "string",
                        "example": "2018-04-16T00:00:00"
                      },
                      "candle_date_time_kst": {
                        "type": "string",
                        "example": "2018-04-16T09:00:00"
                      },
                      "opening_price": {
                        "type": "integer",
                        "example": 8665000,
                        "default": 0
                      },
                      "high_price": {
                        "type": "integer",
                        "example": 8840000,
                        "default": 0
                      },
                      "low_price": {
                        "type": "integer",
                        "example": 8360000,
                        "default": 0
                      },
                      "trade_price": {
                        "type": "integer",
                        "example": 8611000,
                        "default": 0
                      },
                      "timestamp": {
                        "type": "integer",
                        "example": 1524046708995,
                        "default": 0
                      },
                      "candle_acc_trade_price": {
                        "type": "number",
                        "example": 466989414916.13,
                        "default": 0
                      },
                      "candle_acc_trade_volume": {
                        "type": "number",
                        "example": 54410.56660813,
                        "default": 0
                      },
                      "first_day_of_period": {
                        "type": "string",
                        "example": "2018-04-16"
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "400",
            "content": {
              "application/json": {
                "examples": {
                  "Result": {
                    "value": "{}"
                  }
                },
                "schema": {
                  "type": "object",
                  "properties": {}
                }
              }
            }
          }
        },
        "deprecated": false,
        "x-readme": {
          "code-samples": [
            {
              "language": "javascript",
              "code": "const options = {method: 'GET', headers: {accept: 'application/json'}};\n\nfetch('https://api.bithumb.com/v1/candles/weeks?count=1', options)\n  .then(response => response.json())\n  .then(response => console.log(response))\n  .catch(err => console.error(err));"
            },
            {
              "language": "python",
              "code": "import requests\n\nurl = \"https://api.bithumb.com/v1/candles/weeks?count=1\"\n\nheaders = {\"accept\": \"application/json\"}\n\nresponse = requests.get(url, headers=headers)\n\nprint(response.text)"
            },
            {
              "language": "java",
              "code": "OkHttpClient client = new OkHttpClient();\n\nRequest request = new Request.Builder()\n  .url(\"https://api.bithumb.com/v1/candles/weeks?count=1\")\n  .get()\n  .addHeader(\"accept\", \"application/json\")\n  .build();\n\nResponse response = client.newCall(request).execute();"
            }
          ],
          "samples-languages": [
            "javascript",
            "python",
            "java"
          ]
        }
      }
    }
  },
  "x-readme": {
    "headers": [],
    "explorer-enabled": false,
    "proxy-enabled": false
  },
  "x-readme-fauxas": true
}
```
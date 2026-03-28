# 일(Day) 캔들

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
        마지막 캔들 시각 (exclusive)

        * ISO8061 포맷 (yyyy-MM-dd HH:mm:ss 또는 yyyy-MM-ddTHH:mm:ss)
        * 기준 시간 KST
        * 비워서 요청시 가장 최근 캔들로 반환됨
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

    <tr>
      <td>
        convertingPriceUnit
      </td>

      <td>
        종가 환산 화폐 단위
        (생략할 수 있으며 KRW로 입력한 경우 원화 환산 가격으로 반환됨)
      </td>

      <td>
        String
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
        캔들 기준 시각(UTC 기준)
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
        캔들 기준 시각(KST 기준)
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
        prev\_closing\_price
      </td>

      <td>
        전일 종가(UTC 0시 기준)
      </td>

      <td>
        Double
      </td>
    </tr>

    <tr>
      <td>
        change\_price
      </td>

      <td>
        전일 종가 대비 변화 금액
      </td>

      <td>
        Double
      </td>
    </tr>

    <tr>
      <td>
        change\_rate
      </td>

      <td>
        전일 종가 대비 변화량
      </td>

      <td>
        Double
      </td>
    </tr>

    <tr>
      <td>
        converted\_trade\_price
      </td>

      <td>
        종가 환산 화폐 단위로 환산된 가격
        (요청에 `convertingPriceUnit `파라미터가 없는 경우 해당 필드는 반환되지 않음)
      </td>

      <td>
        Double
      </td>
    </tr>
  </tbody>
</Table>

`convertingPriceUnit` 파라미터의 경우, 원화 마켓이 아닌 다른 마켓(ex. BTC)의 일봉 요청시 종가를 명시된 파라미터 값으로 환산해 `converted_trade_price` 필드에 추가하여 반환합니다.

현재는 원화(`KRW`) 로 변환하는 기능만 제공하며 추후 기능을 확장할 수 있습니다.

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
    "/candles/days": {
      "get": {
        "summary": "일(Day) 캔들",
        "description": "",
        "operationId": "일day-캔들",
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
          },
          {
            "name": "convertingPriceUnit",
            "in": "query",
            "description": "종가 환산 화폐 단위 (생략 가능, KRW로 명시할 시 원화 환산 가격을 반환.)",
            "schema": {
              "type": "string"
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
                    "value": "[\n  {\n    \"market\": \"KRW-BTC\",\n    \"candle_date_time_utc\": \"2018-04-18T00:00:00\",\n    \"candle_date_time_kst\": \"2018-04-18T09:00:00\",\n    \"opening_price\": 8450000,\n    \"high_price\": 8679000,\n    \"low_price\": 8445000,\n    \"trade_price\": 8626000,\n    \"timestamp\": 1524046650532,\n    \"candle_acc_trade_price\": 107184005903.68721,\n    \"candle_acc_trade_volume\": 12505.93101659,\n    \"prev_closing_price\": 8450000,\n    \"change_price\": 176000,\n    \"change_rate\": 0.0208284024\n  }\n]"
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
                        "example": "2018-04-18T00:00:00"
                      },
                      "candle_date_time_kst": {
                        "type": "string",
                        "example": "2018-04-18T09:00:00"
                      },
                      "opening_price": {
                        "type": "integer",
                        "example": 8450000,
                        "default": 0
                      },
                      "high_price": {
                        "type": "integer",
                        "example": 8679000,
                        "default": 0
                      },
                      "low_price": {
                        "type": "integer",
                        "example": 8445000,
                        "default": 0
                      },
                      "trade_price": {
                        "type": "integer",
                        "example": 8626000,
                        "default": 0
                      },
                      "timestamp": {
                        "type": "integer",
                        "example": 1524046650532,
                        "default": 0
                      },
                      "candle_acc_trade_price": {
                        "type": "number",
                        "example": 107184005903.687,
                        "default": 0
                      },
                      "candle_acc_trade_volume": {
                        "type": "number",
                        "example": 12505.93101659,
                        "default": 0
                      },
                      "prev_closing_price": {
                        "type": "integer",
                        "example": 8450000,
                        "default": 0
                      },
                      "change_price": {
                        "type": "integer",
                        "example": 176000,
                        "default": 0
                      },
                      "change_rate": {
                        "type": "number",
                        "example": 0.0208284024,
                        "default": 0
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
        "security": [],
        "x-readme": {
          "code-samples": [
            {
              "language": "javascript",
              "code": "const options = {method: 'GET', headers: {accept: 'application/json'}};\n\nfetch('https://api.bithumb.com/v1/candles/days?count=1', options)\n  .then(response => response.json())\n  .then(response => console.log(response))\n  .catch(err => console.error(err));"
            },
            {
              "language": "python",
              "code": "import requests\n\nurl = \"https://api.bithumb.com/v1/candles/days?count=1\"\n\nheaders = {\"accept\": \"application/json\"}\n\nresponse = requests.get(url, headers=headers)\n\nprint(response.text)"
            },
            {
              "language": "java",
              "code": "OkHttpClient client = new OkHttpClient();\n\nRequest request = new Request.Builder()\n  .url(\"https://api.bithumb.com/v1/candles/days?count=1\")\n  .get()\n  .addHeader(\"accept\", \"application/json\")\n  .build();\n\nResponse response = client.newCall(request).execute();"
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
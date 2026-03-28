# 전체 체결 주문 조회

체결된 모든 주문 조회

## Request Header

| 필드                  | 필수   | 설명                                                       |
| :------------------ | :--- | :------------------------------------------------------- |
| X-COINONE-PAYLOAD   | true | Request body object -> JSON string -> base64             |
| X-COINONE-SIGNATURE | true | HMAC(X-COINONE-PAYLOAD, SECRET\_KEY, SHA512).hexdigest() |

## Request Body

| 필드            | 타입     | 필수    | 설명                                                     |
| ------------- | ------ | ----- | ------------------------------------------------------ |
| access\_token | string | true  | 사용자의 액세스 토큰 (access token)                             |
| nonce         | string | true  | UUID nonce (예: "022f53b2-8b2f-40c6-8e51-b594f562ee83") |
| to\_trade\_id | string | false | 주문 ID 입력 시, 입력한 주문 ID 이전의 내역 조회                        |
| size          | int32  | true  | 한번에 조회할 목록 개수 (MAX: 100 MIN: 1)                        |
| from\_ts      | int64  | true  | 조회 시작 시점 입력 (UTC 기준 시간 입력, unit of time: millisecond)  |
| to\_ts        | int64  | true  | 조회 종료 시점 입력 (UTC 기준 시간 입력, unit of time: millisecond)  |

## Response Body

| 필드                 | 타입             | 설명                                                   |
| :----------------- | :------------- | :--------------------------------------------------- |
| result             | String         | 정상 반환 시 success, 에러 코드 반환 시 error                    |
| error\_code        | NumberString   | error 발생 시 에러코드 반환, 성공인 경우 0 반환                      |
| completed\_orders  | Array\[Object] | 배열 형태의 체결 주문 목록                                      |
| - trade\_id        | String         | 체결 ID (예: "0e2bb80f-1e4d-11e9-9ec7-00e04c3600d1")    |
| - order\_id        | String         | 주문 식별 ID (예: "0e30219d-1e4d-11e9-9ec7-00e04c3600d7") |
| - quote\_currency  | String         | 마켓 기준 통화 (예: "KRW")                                  |
| - target\_currency | String         | 주문 체결된 종목 (예: "BTC")                                 |
| - order\_type      | String         | 주문 방식 (Enum: "LIMIT", "MARKET", "STOP\_LIMIT")       |
| - is\_ask          | Boolean        | 체결된 주문의 매도 주문 여부 (true일 경우 매도, false일 경우 매수)         |
| - is\_maker        | Boolean        | maker 주문 여부 (예: true)                                |
| - price            | NumberString   | 체결된 주문 금액                                            |
| - qty              | NumberString   | 체결된 주문 수량                                            |
| - timestamp        | Number         | 주문 체결 시점의 타임스탬프 (unit of time: millisecond)          |
| - fee\_rate        | NumberString   | 체결된 주문 수수료율                                          |
| - fee              | NumberString   | 체결된 주문의 수수료                                          |
| - fee\_currency    | String         | 수수료 지불 통화 (예:"KRW")                                  |

시간 범위 제약

> * 시간 범위 필터의 최대 범위는 90일입니다. 초과 시 오류가 발생합니다.
> * 'from\_ts'가 'to\_ts'보다 크면 오류가 발생합니다.
> * 'from\_ts' 또는 'to\_ts'가 오늘 날짜보다 늦으면 오류가 발생합니다.

# OpenAPI definition

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "PRIVATE API",
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
    "/v2.1/order/completed_orders/all": {
      "post": {
        "summary": "전체 체결 주문 조회",
        "description": "체결된 모든 주문 조회",
        "operationId": "find-all-completed-orders",
        "parameters": [
          {
            "name": "X-COINONE-PAYLOAD",
            "in": "header",
            "description": "Request body object -> JSON string -> base64",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "X-COINONE-SIGNATURE",
            "in": "header",
            "description": "HMAC(X-COINONE-PAYLOAD, SECRET_KEY, SHA512).hexdigest()",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "access_token",
                  "nonce",
                  "size",
                  "from_ts",
                  "to_ts"
                ],
                "properties": {
                  "access_token": {
                    "type": "string",
                    "description": "사용자의 액세스 토큰 (access token)"
                  },
                  "nonce": {
                    "type": "string",
                    "description": "UUID nonce (예: \"022f53b2-8b2f-40c6-8e51-b594f562ee83\")"
                  },
                  "to_trade_id": {
                    "type": "string",
                    "description": "주문 ID 입력 시, 입력한 주문 ID 이전의 내역 조회"
                  },
                  "size": {
                    "type": "integer",
                    "description": "한번에 조회할 목록 개수 (MAX: 100 MIN: 1)",
                    "format": "int32"
                  },
                  "from_ts": {
                    "type": "integer",
                    "description": "조회 시작 시점 입력 (UTC 기준 시간 입력, unit of time: millisecond)",
                    "format": "int64"
                  },
                  "to_ts": {
                    "type": "integer",
                    "description": "조회 종료 시점 입력 (UTC 기준 시간 입력, unit of time: millisecond)",
                    "format": "int64"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "200",
            "content": {
              "application/json": {
                "examples": {
                  "Result": {
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"completed_orders\": [\n    {\n      \"trade_id\": \"0e2bb80f-1e4d-11e9-9ec7-00e04c3600d1\",\n      \"order_id\": \"0e2b9627-1e4d-11e9-9ec7-00e04c3600d2\",\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"BTC\",\n      \"order_type\": \"LIMIT\",\n      \"is_ask\": true,\n      \"is_maker\": true,\n      \"price\": \"8420\",\n      \"qty\": \"0.1599\",\n      \"timestamp\": 8964000,\n      \"fee_rate\": \"0.001\",\n      \"fee\": \"162\",\n      \"fee_currency\": \"KRW\"\n    },\n    {\n      \"trade_id\": \"0e2b9fb0-1e4d-11e9-9ec7-00e04c3600d3\",\n      \"order_id\": \"0e2bb1e3-1e4d-11e9-9ec7-00e04c3600d4\",\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"BTC\",\n      \"order_type\": \"LIMIT\",\n      \"is_ask\": false,\n      \"is_maker\": true,\n      \"price\": \"7951\",\n      \"qty\": \"0.97\",\n      \"timestamp\": 3642000,\n      \"fee_rate\": \"0.001\",\n      \"fee\": \"159\",\n      \"fee_currency\": \"KRW\"\n    }\n  ]\n}"
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
                    "completed_orders": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "trade_id": {
                            "type": "string",
                            "example": "0e2bb80f-1e4d-11e9-9ec7-00e04c3600d1"
                          },
                          "order_id": {
                            "type": "string",
                            "example": "0e2b9627-1e4d-11e9-9ec7-00e04c3600d2"
                          },
                          "quote_currency": {
                            "type": "string",
                            "example": "KRW"
                          },
                          "target_currency": {
                            "type": "string",
                            "example": "BTC"
                          },
                          "order_type": {
                            "type": "string",
                            "example": "LIMIT"
                          },
                          "is_ask": {
                            "type": "boolean",
                            "example": true,
                            "default": true
                          },
                          "is_maker": {
                            "type": "boolean",
                            "example": true,
                            "default": true
                          },
                          "price": {
                            "type": "string",
                            "example": "8420"
                          },
                          "qty": {
                            "type": "string",
                            "example": "0.1599"
                          },
                          "timestamp": {
                            "type": "integer",
                            "example": 8964000,
                            "default": 0
                          },
                          "fee_rate": {
                            "type": "string",
                            "example": "0.001"
                          },
                          "fee": {
                            "type": "string",
                            "example": "162"
                          },
                          "fee_currency": {
                            "type": "string",
                            "example": "KRW"
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
        "x-readme": {
          "code-samples": [
            {
              "language": "python",
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport uuid\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = str(uuid.uuid4())\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', headers=headers)\n\n    return content\n\n\nprint(get_response(action='/v2.1/order/completed_orders/all', payload={\n    'access_token': ACCESS_TOKEN,\n    'size': 30,\n    'from_ts': 1651202074230,\n    'to_ts': 1651202974230,\n    'to_trade_id': None\n}))\n"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\nimport java.util.UUID;\n\npublic class FindAllTradeHistory {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/completed_orders/all\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, String nonce, String to_trade_id, int size, long from_ts, long to_ts){}\n\n    public static void main(String[] args) {\n        var nonce = UUID.randomUUID().toString();\n        var payload = new Payload(ACCESS_TOKEN, nonce, null, 50, 1651202074230L, 1651202974230L);\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\nobject FindAllTradeHistory {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/completed_orders/all\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    internal data class Payload(val access_token: String, val nonce: String, val to_trade_id: String?, val size: Int, val from_ts: Long, val to_ts: Long)\n\n    @JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = UUID.randomUUID().toString()\n        val payload = Payload(ACCESS_TOKEN, nonce, null, 50, 1651202074230L, 1651202974230L)\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: Payload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\nconst { v4: uuidv4 } = require('uuid');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = {\n    access_token: ACCESS_TOKEN,\n    nonce: uuidv4(),\n    'size': 30,\n    'from_ts': 1651202074230,\n    'to_ts': 1651202974230,\n    'to_trade_id': null\n};\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2.1/order/completed_orders/all',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = uuid.New().String()\n\n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2.1/order/completed_orders/all\", map[string]interface{}{\n\t\t\"access_token\": accessToken,\n\t\t\"size\":         30,\n\t\t\"from_ts\":      1651202074230,\n\t\t\"to_ts\":        1651202974230,\n\t\t\"to_trade_id\":  nil,\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
            }
          ],
          "samples-languages": [
            "python",
            "java",
            "kotlin",
            "javascript",
            "go"
          ]
        }
      }
    }
  },
  "x-readme": {
    "headers": [],
    "explorer-enabled": false,
    "proxy-enabled": true
  },
  "x-readme-fauxas": true,
  "_id": "68394678760f3c0030350497:68394678760f3c00303504ab"
}
```
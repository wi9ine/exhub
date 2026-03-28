# 개별 주문 취소

주문 식별 ID로 원하는 주문의 취소

## Request Header

| 필드                  | 필수   | 설명                                                       |
| :------------------ | :--- | :------------------------------------------------------- |
| X-COINONE-PAYLOAD   | true | Request body object -> JSON string -> base64             |
| X-COINONE-SIGNATURE | true | HMAC(X-COINONE-PAYLOAD, SECRET\_KEY, SHA512).hexdigest() |

## Request Body

[block:parameters]
{
  "data": {
    "h-0": "필드",
    "h-1": "유형",
    "h-2": "필수",
    "h-3": "설명",
    "0-0": "access_token",
    "0-1": "String",
    "0-2": "true",
    "0-3": "사용자의 액세스 토큰 (access token)",
    "1-0": "nonce",
    "1-1": "String",
    "1-2": "true",
    "1-3": "UUID nonce (예: \"022f53b2-8b2f-40c6-8e51-b594f562ee83\")",
    "2-0": "order_id",
    "2-1": "String",
    "2-2": "true",
    "2-3": "주문 식별 ID (UUID 포맷)",
    "3-0": "quote_currency",
    "3-1": "String",
    "3-2": "true",
    "3-3": "마켓 기준 통화",
    "4-0": "target_currency",
    "4-1": "String",
    "4-2": "true",
    "4-3": "조회하려는 종목의 심볼",
    "5-0": "user_order_id",
    "5-1": "String",
    "5-2": "false",
    "5-3": "user_order_id 필드와 기존 order_id 필드 중 하나만 입력되어야 함  \n  \n- 150자까지 지원\n- 알파벳 소문자 / 숫자 / 특수문자 - \\_ . 지원\n- 거래쌍 상관 없이 기존에 입력한 user_order_id 는 재사용 불가"
  },
  "cols": 4,
  "rows": 6,
  "align": [
    null,
    null,
    null,
    null
  ]
}
[/block]

## Response Body

| 필드            | 타입           | 설명                                                       |
| :------------ | :----------- | :------------------------------------------------------- |
| result        | String       | 정상 반환 시 success, 에러 코드 반환 시 error                        |
| error\_code   | NumberString | error 발생 시 에러코드 반환, 성공인 경우 0 반환                          |
| order\_id     | String       | 주문 식별 가능한 ID (예: "d85cc6af-b131-4398-b269-ddbafa760a39") |
| price         | NumberString | 취소된 주문의 금액                                               |
| qty           | NumberString | 취소된 주문의 수량                                               |
| remain\_qty   | NumberString | 취소되지 않는 잔여 수량                                            |
| side          | String       | 매수/매도 여부 (Enum: "BUY", "SELL")                           |
| original\_qty | NumberString | 최초 주문 수량 (remain\_qty + traded\_qty + canceled\_qty)     |
| traded\_qty   | NumberString | 체결된 수량                                                   |
| canceled\_qty | NumberString | 취소된 수량                                                   |
| fee           | NumberString | 거래 수수료                                                   |
| fee\_rate     | NumberString | 거래 수수료율                                                  |
| avg\_price    | NumberString | 평균 체결 단가                                                 |
| canceled\_at  | Number       | 취소된 주문의 타임스탬프 (unit of time: millisecond)                |
| ordered\_at   | Number       | 주문 등록 시점의 타임스탬프 (unit of time: millisecond)              |

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
    "/v2.1/order/cancel": {
      "post": {
        "summary": "개별 주문 취소",
        "description": "주문 식별 ID로 원하는 주문의 취소",
        "operationId": "cancel-order",
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
                  "order_id",
                  "quote_currency",
                  "target_currency"
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
                  "order_id": {
                    "type": "string",
                    "description": "주문 식별 ID (UUID 포맷)"
                  },
                  "quote_currency": {
                    "type": "string",
                    "description": "마켓 기준 통화",
                    "default": "KRW"
                  },
                  "target_currency": {
                    "type": "string",
                    "description": "주문 취소하려는 종목의 심볼",
                    "default": "BTC"
                  },
                  "user_order_id": {
                    "type": "string",
                    "description": "150자까지 지원 (알파벳 소문자 / 숫자 / 특수문자 - _ . 지원)"
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"order_id\": \"d85cc6af-b131-4398-b269-ddbafa760a39\",\n  \"price\": \"26231000.0\",\n  \"qty\": \"0.002\",\n  \"remain_qty\": \"0.0\",\n  \"side\": \"BUY\",\n  \"original_qty\": \"0.005\",\n  \"traded_qty\": \"0.003\",\n  \"canceled_qty\": \"0.002\",\n  \"fee\": \"26231.0\",\n  \"fee_rate\": \"0.001\",\n  \"avg_price\": \"26231000.0\",\n  \"canceled_at\": 1650525935,\n  \"ordered_at\": 1650125935\n}"
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
                    "order_id": {
                      "type": "string",
                      "example": "d85cc6af-b131-4398-b269-ddbafa760a39"
                    },
                    "price": {
                      "type": "string",
                      "example": "26231000.0"
                    },
                    "qty": {
                      "type": "string",
                      "example": "0.002"
                    },
                    "remain_qty": {
                      "type": "string",
                      "example": "0.0"
                    },
                    "side": {
                      "type": "string",
                      "example": "BUY"
                    },
                    "original_qty": {
                      "type": "string",
                      "example": "0.005"
                    },
                    "traded_qty": {
                      "type": "string",
                      "example": "0.003"
                    },
                    "canceled_qty": {
                      "type": "string",
                      "example": "0.002"
                    },
                    "fee": {
                      "type": "string",
                      "example": "26231.0"
                    },
                    "fee_rate": {
                      "type": "string",
                      "example": "0.001"
                    },
                    "avg_price": {
                      "type": "string",
                      "example": "26231000.0"
                    },
                    "canceled_at": {
                      "type": "integer",
                      "example": 1650525935,
                      "default": 0
                    },
                    "ordered_at": {
                      "type": "integer",
                      "example": 1650125935,
                      "default": 0
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
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport uuid\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = str(uuid.uuid4())\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', headers=headers)\n\n    return content\n\n\nprint(get_response(action='/v2.1/order/cancel', payload={\n    'access_token': ACCESS_TOKEN,\n    'order_id': 'd85cc6af-b131-4398-b269-ddbafa760a39',\n    'quote_currency': 'KRW',\n    'target_currency': 'BTC',\n}))\n"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\nimport java.util.UUID;\n\npublic class CancelOrderById {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/cancel\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, String nonce, String order_id, String quote_currency, String target_currency) { }\n\n    public static void main(String[] args) {\n        var nonce = UUID.randomUUID().toString();\n        var payload = new Payload(ACCESS_TOKEN, nonce, \"0f930507-1e4d-11e9-9ec7-00e04c3600d7\",  \"KRW\", \"ETH\");\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\nobject CancelOrderById {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/cancel\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    internal class Payload(val access_token: String, val nonce: String, val order_id: String, val quote_currency: String, val target_currency: String)\n\n    @JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = UUID.randomUUID().toString()\n        val payload = Payload(ACCESS_TOKEN, nonce, \"0f930507-1e4d-11e9-9ec7-00e04c3600d7\", \"KRW\", \"ETH\")\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: Payload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}\n"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\nconst { v4: uuidv4 } = require('uuid');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = {\n    access_token: ACCESS_TOKEN,\n    nonce: uuidv4(),\n    order_id: '0f948b4e-1e4d-11e9-9ec7-00e04c3600d7',\n    quote_currency: 'KRW',\n    target_currency: 'BTC',\n};\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2.1/order/cancel',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = uuid.New().String()\n\n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2.1/order/cancel\", map[string]interface{}{\n\t\t\"access_token\":    accessToken,\n\t\t\"order_id\":        \"d85cc6af-b131-4398-b269-ddbafa760a39\",\n\t\t\"quote_currency\":  \"KRW\",\n\t\t\"target_currency\": \"BTC\",\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
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
  "_id": "68394678760f3c0030350497:68394678760f3c00303504a6"
}
```
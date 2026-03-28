# 전체 미체결 주문 조회

고객에게 걸려있는 모든 미체결 주문 조회

> 🚧 Private API V2.1 '미체결 주문 조회' API를 사용하시기 바랍니다
>
> [V2.1 미체결 주문 조회 ](https://coinone.readme.io/v1.1/reference/find-active-orders)

> ❗️ 해당 API는 포트폴리오 기능을 지원하지 않습니다
>
> [포트폴리오 API Key 이용 시 지원하지 않는 API 목록](https://docs.coinone.co.kr/changelog/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4-%EA%B8%B0%EB%8A%A5-%EC%8B%A0%EA%B7%9C-%EC%A7%80%EC%9B%90#:~:text=%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%20API%20Key%20%EC%9D%B4%EC%9A%A9%20%EC%8B%9C%20%EC%A7%80%EC%9B%90%ED%95%98%EC%A7%80%20%EC%95%8A%EB%8A%94%20API%20%EB%AA%A9%EB%A1%9D)

## Response Body

| Key                       | Type           | Description                                            |
| :------------------------ | :------------- | :----------------------------------------------------- |
| result                    | String         | 정상 반환 시 success, 에러 코드 반환 시 error                      |
| error\_code               | NumberString   | error 발생 시 에러코드 반환, 성공인 경우 0 반환                        |
| open\_orders              | Array\[Object] | 배열 형태의 미체결 주문 목록                                       |
| -order\_id                | String         | 주문 식별 ID                                               |
| -type                     | String         | 주문 방식 (Enum: "LIMIT", "MARKET")                        |
| -quote\_currency          | String         | 마켓 기준 통화                                               |
| -target\_currency         | String         | 주문한 종목                                                 |
| -side                     | String         | 매수/매도 여부 (Enum: "BUY", "SELL")                         |
| -price                    | NumberString   | 주문 금액                                                  |
| -remain\_qty              | NumberString   | 취소되지 않은 잔여 수량                                          |
| -original\_qty            | NumberString   | 최초 주문 수량 (remain\_qty + executed\_qty + canceled\_qty) |
| -canceled\_qty            | NumberString   | 취소된 수량                                                 |
| -executed\_qty            | NumberString   | 체결된 수량                                                 |
| -ordered\_at              | Number         | 주문 등록 시점의 타임스탬프 (unit of time: millisecond)            |
| -fee                      | NumberString   | 주문 수수료                                                 |
| -fee\_rate                | NumberString   | 주문 수수료율                                                |
| -average\_executed\_price | NumberString   | 체결된 주문의 평단가                                            |

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
    "/v2.1/order/open_orders/all": {
      "post": {
        "summary": "전체 미체결 주문 조회",
        "description": "고객에게 걸려있는 모든 미체결 주문 조회",
        "operationId": "find-all-open-orders",
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
                  "nonce"
                ],
                "properties": {
                  "access_token": {
                    "type": "string",
                    "description": "사용자의 액세스 토큰 (access token)"
                  },
                  "nonce": {
                    "type": "string",
                    "description": "UUID nonce (예: \"022f53b2-8b2f-40c6-8e51-b594f562ee83\")"
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"open_orders\": [\n    {\n      \"order_id\": \"0e30219d-1e4d-11e9-9ec7-00e04c3600d7\",\n      \"type\": \"LIMIT\",\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"BTC\",\n      \"side\": \"SELL\",\n      \"price\": \"75865000\",\n      \"remain_qty\": \"0.0097\",\n      \"original_qty\": \"0.01\",\n      \"canceled_qty\": \"0\",\n      \"executed_qty\": \"0.0003\",\n      \"ordered_at\": 1654238371000,\n      \"fee\": \"45.519\",\n      \"fee_rate\": \"0.002\",\n      \"average_executed_price\": \"75865000\"\n    },\n    {\n      \"order_id\": \"d82cc6af-b131-4398-b269-ddbafa760a19\",\n      \"type\": \"LIMIT\",\n      \"quote_currency\": \"KRW\",\n      \"target_currency\": \"BTC\",\n      \"side\": \"BUY\",\n      \"price\": \"1000\",\n      \"remain_qty\": \"0.1\",\n      \"original_qty\": \"1.0\",\n      \"canceled_qty\": \"0.5\",\n      \"executed_qty\": \"0.3\",\n      \"ordered_at\": 1651202974000,\n      \"fee\": \"17\",\n      \"feeRate\": \"0.0034\",\n      \"average_executed_price\": \"960\"\n    }\n  ]\n}"
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
                    "open_orders": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "order_id": {
                            "type": "string",
                            "example": "0e30219d-1e4d-11e9-9ec7-00e04c3600d7"
                          },
                          "type": {
                            "type": "string",
                            "example": "LIMIT"
                          },
                          "quote_currency": {
                            "type": "string",
                            "example": "KRW"
                          },
                          "target_currency": {
                            "type": "string",
                            "example": "BTC"
                          },
                          "side": {
                            "type": "string",
                            "example": "SELL"
                          },
                          "price": {
                            "type": "string",
                            "example": "75865000"
                          },
                          "remain_qty": {
                            "type": "string",
                            "example": "0.0097"
                          },
                          "original_qty": {
                            "type": "string",
                            "example": "0.01"
                          },
                          "canceled_qty": {
                            "type": "string",
                            "example": "0"
                          },
                          "executed_qty": {
                            "type": "string",
                            "example": "0.0003"
                          },
                          "ordered_at": {
                            "type": "integer",
                            "example": 1654238371000,
                            "default": 0
                          },
                          "fee": {
                            "type": "string",
                            "example": "45.519"
                          },
                          "fee_rate": {
                            "type": "string",
                            "example": "0.002"
                          },
                          "average_executed_price": {
                            "type": "string",
                            "example": "75865000"
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
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport uuid\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = str(uuid.uuid4())\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', headers=headers)\n\n    return content\n\n\nprint(get_response(action='/v2.1/order/open_orders/all', payload={\n    'access_token': ACCESS_TOKEN\n}))\n"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\nimport java.util.UUID;\n\npublic class FindAllOpenOrders {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/open_orders/all\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, String nonce){}\n\n    public static void main(String[] args) {\n        var nonce = UUID.randomUUID().toString();\n        var payload = new Payload(ACCESS_TOKEN, nonce);\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\nobject FindAllOpenOrders {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/open_orders/all\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    internal data class Payload(val access_token: String, val nonce: String)\n\n    @JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = UUID.randomUUID().toString()\n        val payload = Payload(ACCESS_TOKEN, nonce)\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: Payload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\nconst { v4: uuidv4 } = require('uuid');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = {\n    access_token: ACCESS_TOKEN,\n    nonce: uuidv4(),\n    'size': 30,\n    'from_ts': 1651202074230,\n    'to_ts': 1651202974230,\n    'to_trade_id': null\n};\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2.1/order/open_orders/all',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = uuid.New().String()\n\n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2.1/order/open_orders/all\", map[string]interface{}{\n\t\t\"access_token\": accessToken,\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
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
  "_id": "68394678760f3c0030350497:68394678760f3c00303504a9"
}
```
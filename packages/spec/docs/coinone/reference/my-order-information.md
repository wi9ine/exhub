# 특정 주문 조회

주문 식별 ID에 해당하는 주문 정보 조회

> ❗️ 해당 API는 포트폴리오 기능을 지원하지 않습니다
>
> [포트폴리오 API Key 이용 시 지원하지 않는 API 목록](https://docs.coinone.co.kr/changelog/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4-%EA%B8%B0%EB%8A%A5-%EC%8B%A0%EA%B7%9C-%EC%A7%80%EC%9B%90#:~:text=%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%20API%20Key%20%EC%9D%B4%EC%9A%A9%20%EC%8B%9C%20%EC%A7%80%EC%9B%90%ED%95%98%EC%A7%80%20%EC%95%8A%EB%8A%94%20API%20%EB%AA%A9%EB%A1%9D)

## Response Body

| Key                  | Type         | Description                                                                  |
| :------------------- | :----------- | :--------------------------------------------------------------------------- |
| result               | String       | 정상 반환 시 success, 에러 코드 반환 시 error                                            |
| errorCode            | NumberString | error 발생 시 에러코드 반환, 성공인 경우 0 반환                                              |
| orderId              | String       | 주문 식별 ID                                                                     |
| baseCurrency         | String       | 마켓 기준 통화                                                                     |
| targetCurrency       | String       | 조회하려는 종목의 심볼                                                                 |
| price                | NumberString | 주문된 금액                                                                       |
| originalQty          | NumberString | 최초 주문 수량                                                                     |
| executedQty          | NumberString | 체결된 주문 수량                                                                    |
| canceledQty          | NumberString | 취소된 주문 수량                                                                    |
| remainQty            | NumberString | 남아있는 주문 수량 (주문 등록된 상태)                                                       |
| status               | String       | 주문 상태 (Enum: live, filled, partially\_filled, partially\_canceled, canceled) |
| side                 | String       | 주문 타입 (Enum: ask인 경우 매도, bid인 경우 매수)                                         |
| orderedAt            | Number       | 주문 등록 시간 (Unix time)                                                         |
| updatedAt            | Number       | 최근 업데이트 시간 (Unix time)                                                       |
| feeRate              | NumberString | 수수료율                                                                         |
| fee                  | NumberString | 수수료                                                                          |
| averageExecutedPrice | NumberString | 평균 체결 단가                                                                     |

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
    "/v2/order/query_order": {
      "post": {
        "summary": "특정 주문 조회",
        "description": "주문 식별 ID에 해당하는 주문 정보 조회",
        "operationId": "my-order-information",
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
                  "currency"
                ],
                "properties": {
                  "access_token": {
                    "type": "string",
                    "description": "사용자의 액세스 토큰 (access token)"
                  },
                  "nonce": {
                    "type": "integer",
                    "description": "유닉스 타임스탬프처럼 양의 정수 (예: 1685094548)",
                    "format": "int64"
                  },
                  "order_id": {
                    "type": "string",
                    "description": "주문 식별 id"
                  },
                  "currency": {
                    "type": "string",
                    "description": "조회하려는 종목의 심볼",
                    "default": "BTC"
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
                    "value": "{\n  \"result\": \"success\",\n  \"errorCode\": \"0\",\n  \"orderId\": \"0e3019f2-1e4d-11e9-9ec7-00e04c3600d7\",\n  \"baseCurrency\": \"KRW\",\n  \"targetCurrency\": \"BTC\",\n  \"price\": \"10011000.0\",\n  \"originalQty\": \"3.0\",\n  \"executedQty\": \"0.62\",\n  \"canceledQty\": \"1.125\",\n  \"remainQty\": \"1.255\",\n  \"status\": \"partially_filled\",\n  \"side\": \"bid\",\n  \"orderedAt\": 1499340941,\n  \"updatedAt\": 1499341142,\n  \"feeRate\": \"0.002\",\n  \"fee\": \"0.00124\",\n  \"averageExecutedPrice\": \"10011000.0\"\n}"
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
                    "orderId": {
                      "type": "string",
                      "example": "0e3019f2-1e4d-11e9-9ec7-00e04c3600d7"
                    },
                    "baseCurrency": {
                      "type": "string",
                      "example": "KRW"
                    },
                    "targetCurrency": {
                      "type": "string",
                      "example": "BTC"
                    },
                    "price": {
                      "type": "string",
                      "example": "10011000.0"
                    },
                    "originalQty": {
                      "type": "string",
                      "example": "3.0"
                    },
                    "executedQty": {
                      "type": "string",
                      "example": "0.62"
                    },
                    "canceledQty": {
                      "type": "string",
                      "example": "1.125"
                    },
                    "remainQty": {
                      "type": "string",
                      "example": "1.255"
                    },
                    "status": {
                      "type": "string",
                      "example": "partially_filled"
                    },
                    "side": {
                      "type": "string",
                      "example": "bid"
                    },
                    "orderedAt": {
                      "type": "integer",
                      "example": 1499340941,
                      "default": 0
                    },
                    "updatedAt": {
                      "type": "integer",
                      "example": 1499341142,
                      "default": 0
                    },
                    "feeRate": {
                      "type": "string",
                      "example": "0.002"
                    },
                    "fee": {
                      "type": "string",
                      "example": "0.00124"
                    },
                    "averageExecutedPrice": {
                      "type": "string",
                      "example": "10011000.0"
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
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport time\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = int(time.time() * 1000)\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr/', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', body=encoded_payload, headers=headers)\n\n    return content\n\n\nprint(get_response(action='v2/order/query_order', payload={\n    'access_token': ACCESS_TOKEN,\n    'order_id': 'bafd3a24-6a17-49f0-a687-f542bd880e40',\n    'currency': 'BTC',\n}))"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\n\npublic class QueryOrder {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2/order/query_order\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, long nonce, String order_id, String currency){}\n\n    public static void main(String[] args) {\n        var nonce = System.currentTimeMillis();\n        var payload = new Payload(ACCESS_TOKEN, nonce, \"bafd3a24-6a17-49f0-a687-f542bd880e40\",\"BTC\");\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\nobject QueryOrder {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2/order/query_order\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    internal data class Payload(val access_token: String, val nonce: Long, val order_id: String, val currency: String)\n\n    @JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = System.currentTimeMillis()\n        val payload = Payload(ACCESS_TOKEN, nonce, \"bafd3a24-6a17-49f0-a687-f542bd880e40\", \"BTC\")\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: Payload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = {\n    access_token: ACCESS_TOKEN,\n    nonce: Date.now(),\n    order_id: '0f94899f-1e4d-11e9-9ec7-00e04c3600d7',\n    currency: 'BTC',\n};\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2/order/query_order/',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = int(time.Now().UnixMilli())\n  \n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2/order/query_order\", map[string]interface{}{\n\t\t\"access_token\": accessToken,\n\t\t\"order_id\":     \"d85cc6af-b131-4398-b269-ddbafa760a39\",\n\t\t\"currency\":     \"BTC\",\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
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
  "_id": "68394678760f3c0030350497:68394678760f3c00303504c1"
}
```
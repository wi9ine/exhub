# 주문 리워드 내역 조회

수령한 리워드 내역 정보 조회 (최근일부터 역순 조회, 기간내 최대 30일치 조회 가능)

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
    "h-1": "타입",
    "h-2": "필수",
    "h-3": "설명",
    "0-0": "access_token",
    "0-1": "String",
    "0-2": "true",
    "0-3": "사용자의 액세스 토큰",
    "1-0": "nonce",
    "1-1": "String",
    "1-2": "true",
    "1-3": "UUID nonce  \n\\* 예: \"022f53b2-8b2f-40c6-8e51-b594f562ee83\")",
    "2-0": "from_ts",
    "2-1": "Number",
    "2-2": "false",
    "2-3": "조회 시작 시점 타임스탬프 (UTC)  \n\\* unit of time: second",
    "3-0": "to_ts",
    "3-1": "Number",
    "3-2": "false",
    "3-3": "조회 종료 시점 타임스탬프 (UTC)  \n\\* unit of time: second"
  },
  "cols": 4,
  "rows": 4,
  "align": [
    "left",
    "left",
    "left",
    "left"
  ]
}
[/block]

## Response Body

[block:parameters]
{
  "data": {
    "h-0": "필드",
    "h-1": "타입",
    "h-2": "설명",
    "0-0": "result",
    "0-1": "String",
    "0-2": "정상 처리 시 \"success\", 에러 발생 시 \"error\" 반환",
    "1-0": "error_code",
    "1-1": "String",
    "1-2": "정상 처리 시 \"0\", 에러 발생 시 에러코드 \"0\" 이 아닌 값 반환",
    "2-0": "rewards",
    "2-1": "Array[Object]",
    "2-2": "배열 형태의 일별 리워드 보상 내역 ",
    "3-0": "- applied_at",
    "3-1": "Number",
    "3-2": "리워드 보상 적용 타임스탬프 (UTC)  \n\\* unit of time: second",
    "4-0": "- reward_amount",
    "4-1": "String",
    "4-2": "리워드 수령 대 금액 ",
    "5-0": "- net_reward_amount",
    "5-1": "String",
    "5-2": "순 리워드 수령 금액 (세금 제외)",
    "6-0": "- deposit_status",
    "6-1": "String",
    "6-2": "입금 상태 (PENDING, COMPLETE)",
    "7-0": "- details",
    "7-1": "Array[Object]",
    "7-2": "배열 형태의 종목별 리워드 상세 내역",
    "8-0": "- quote_currency",
    "8-1": "String",
    "8-2": "마켓 기준 통화",
    "9-0": "- target_currency",
    "9-1": "String",
    "9-2": "주문 통화",
    "10-0": "- daily_reward_amount",
    "10-1": "String",
    "10-2": "종목별 일 지급 리워드 금액 ",
    "11-0": "- received_reward_amount",
    "11-1": "String",
    "11-2": "수령 리워드 금",
    "12-0": "- score",
    "12-1": "String",
    "12-2": "내 점수",
    "13-0": "- total_score",
    "13-1": "String",
    "13-2": "전체 점수",
    "14-0": "- contribution_ratio",
    "14-1": "String",
    "14-2": "기여도"
  },
  "cols": 3,
  "rows": 15,
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
    "/v2.1/event/order-reward/history": {
      "post": {
        "summary": "주문 리워드 내역 조회",
        "description": "수령한 리워드 내역 정보 조회 (최근일부터 역순 조회, 기간내 최대 30일치 조회 가능)",
        "operationId": "order-reward-history",
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
                  "access_token"
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
                  "to_ts": {
                    "type": "integer",
                    "description": "조회 종료 시점 타임스탬프 (UTC) * unit of time: second (예: 1749513600)",
                    "default": null,
                    "format": "int64"
                  },
                  "from_ts": {
                    "type": "integer",
                    "description": "조회 시작 시점 타임스탬프 (UTC) * unit of time: second (예: 1746835200)",
                    "default": null,
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"rewards\": [\n    {\n      \"applied_at\": 1625097600,\n      \"reward_amount\": \"100\",\n      \"net_reward_amount\": \"95\",\n      \"deposit_status\": \"COMPLETE\",\n      \"details\": [\n        {\n          \"quote_currency\": \"KRW\",\n          \"target_currency\": \"BTC\",\n          \"daily_reward_amount\": \"100\",\n          \"received_reward_amount\": \"95\",\n          \"score\": \"10.0\",\n          \"total_score\": \"200.0\",\n          \"contribution_ratio\": \"0.05\"\n        }\n      ]\n    }\n  ]\n}"
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
                    "rewards": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "applied_at": {
                            "type": "integer",
                            "example": 1625097600,
                            "default": 0
                          },
                          "reward_amount": {
                            "type": "string",
                            "example": "100"
                          },
                          "net_reward_amount": {
                            "type": "string",
                            "example": "95"
                          },
                          "deposit_status": {
                            "type": "string",
                            "example": "COMPLETE"
                          },
                          "details": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "quote_currency": {
                                  "type": "string",
                                  "example": "KRW"
                                },
                                "target_currency": {
                                  "type": "string",
                                  "example": "BTC"
                                },
                                "daily_reward_amount": {
                                  "type": "string",
                                  "example": "100"
                                },
                                "received_reward_amount": {
                                  "type": "string",
                                  "example": "95"
                                },
                                "score": {
                                  "type": "string",
                                  "example": "10.0"
                                },
                                "total_score": {
                                  "type": "string",
                                  "example": "200.0"
                                },
                                "contribution_ratio": {
                                  "type": "string",
                                  "example": "0.05"
                                }
                              }
                            }
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
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport uuid\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = str(uuid.uuid4())\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', headers=headers)\n\n    return content\n\n\nprint(get_response(action='/v2.1/event/order-reward/history', payload={\n    'access_token': ACCESS_TOKEN,\n    'from_ts': 1746835200,\n    'to_ts': 1749513600\n}))"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\nimport java.util.UUID;\n\npublic class FindKrwTransferHistory {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2.1/event/order-reward/history\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, String nonce, long from_ts, long to_ts){}\n\n    public static void main(String[] args) {\n        var nonce = UUID.randomUUID().toString();\n        var payload = new Payload(ACCESS_TOKEN, nonce, 1746835200L, 1749513600L);\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\nobject FindKrwTransferHistory {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2.1/event/order-reward/history\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    internal data class Payload(val access_token: String, val nonce: String, val from_ts: Long, val to_ts: Long)\n\n    @JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = UUID.randomUUID().toString()\n        val payload = Payload(ACCESS_TOKEN, nonce, 1746835200L, 1749513600L)\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: Payload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\nconst { v4: uuidv4 } = require('uuid');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = {\n    access_token: ACCESS_TOKEN,\n    nonce: uuidv4(),\n    'from_ts': 1746835200,\n    'to_ts': 1749513600\n};\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2.1/event/order-reward/history',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = uuid.New().String()\n\n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2.1/event/order-reward/history\", map[string]interface{}{\n\t\t\"access_token\": accessToken,\n\t\t\"from_ts\":      1746835200,\n\t\t\"to_ts\":        1749513600,\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
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
  "_id": "68394678760f3c0030350497:68394678760f3c0030350500"
}
```
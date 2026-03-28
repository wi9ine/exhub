# 미체결 주문 조회

종목 별 / 주문 방식 별로 미체결 주문 조회

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
    "2-0": "quote_currency",
    "2-1": "String",
    "2-2": "false",
    "2-3": "마켓 기준 통화  \n\\* 예: KRW",
    "3-0": "target_currency",
    "3-1": "String",
    "3-2": "false",
    "3-3": "주문하려는 종목의 심볼  \n\\* 예: BTC",
    "4-0": "order_type",
    "4-1": "Array[String]",
    "4-2": "false",
    "4-3": "조회하고자하는 주문 유형,  \n[\"LIMIT\"], [\"STOP_LIMIT\"],이 가능하며,  \n[\"LIMIT\", \"STOP_LIMIT\"], \\[] 또는 생략시 모든 타입 조회 가능"
  },
  "cols": 4,
  "rows": 5,
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
    "2-0": "active_orders",
    "2-1": "Array[Object]",
    "2-2": "배열 형태의 미체결 주문 목록",
    "3-0": "- order_id",
    "3-1": "String",
    "3-2": "주문 식별 가능한 ID",
    "4-0": "- type",
    "4-1": "String",
    "4-2": "주문 유형  \n  \n- `LIMIT`: 지정가\n- `STOP_LIMIT` : 예약가",
    "5-0": "- side",
    "5-1": "String",
    "5-2": "매수/매도 분류  \n  \n- `BUY`: 매수\n- `SELL` : 매도",
    "6-0": "- quote_currency",
    "6-1": "String",
    "6-2": "마켓 기준 통화",
    "7-0": "- target_currency",
    "7-1": "String",
    "7-2": "주문한 종목",
    "8-0": "- price",
    "8-1": "String",
    "8-2": "주문 가격",
    "9-0": "- original_qty",
    "9-1": "String",
    "9-2": "최초 주문 수량  \n_  (remain_qty + executed_qty + canceled_qty)  \n_  예: `\"0.01\"`",
    "10-0": "- remain_qty",
    "10-1": "String",
    "10-2": "미체결 잔량",
    "11-0": "- executed_qty",
    "11-1": "String",
    "11-2": "체결된 수량",
    "12-0": "- canceled_qty",
    "12-1": "String",
    "12-2": "취소된 수량",
    "13-0": "- fee",
    "13-1": "String",
    "13-2": "체결 수수료",
    "14-0": "- fee_rate",
    "14-1": "String",
    "14-2": "체결 수수료율",
    "15-0": "- average_executed_price",
    "15-1": "String",
    "15-2": "체결된 주문들의 평균 체결가",
    "16-0": "- ordered_at",
    "16-1": "Number",
    "16-2": "주문 등록 시점의 타임스탬프  \n\\* unit of time: millisecond",
    "17-0": "- is_triggered",
    "17-1": "Boolean",
    "17-2": "해당 주문이 발동되었는지 여부  \n예약가 주문 이외의 경우, \u001dnull로 응답  \n\\* 예약가 주문에서만 사용",
    "18-0": "- trigger_price",
    "18-1": "String",
    "18-2": "예약가 주문이 실행되는 가격 (감시가)  \n예약가 주문 이외의 경우, \u001dnull로 응답 ",
    "19-0": "- triggered_at",
    "19-1": "Number",
    "19-2": "(예약가 주문인 경우) 해당 주문이 발동되었을 때, 발동된 시간  \n_ is_triggered=false 일때는 null  \n_ is_triggered=true 일때는 해당 주문이 발동된 시간임  \n예약가 주문 이외의 경우, \u001dnull로 응답"
  },
  "cols": 3,
  "rows": 20,
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
    "/v2.1/order/active_orders": {
      "post": {
        "summary": "미체결 주문 조회",
        "description": "종목 별 / 주문 방식 별로 미체결 주문 조회",
        "operationId": "find-active-orders",
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
                  },
                  "quote_currency": {
                    "type": "string",
                    "description": "마켓 기준 통화, 미입력 시 전체 종목에 해당되는 주문 목록 조회"
                  },
                  "target_currency": {
                    "type": "string",
                    "description": "조회하려는 종목의 심볼, 미입력 시 전체 종목에 해당되는 주문 목록 조회"
                  },
                  "order_type": {
                    "type": "array",
                    "description": "조회하고자하는 주문 방식, [\"LIMIT\"], [\"STOP_LIMIT\"], [\"LIMIT\", \"STOP_LIMIT\"] 이 가능하며, [] 또는 생략시 모든 타입이 조회",
                    "default": [
                      "[]"
                    ],
                    "items": {
                      "type": "string"
                    }
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
                    "value": "{\n    \"result\": \"success\",\n    \"error_code\": \"0\",\n    \"active_orders\": [\n        {\n            \"order_id\": \"0f5122d8-1e4d-11e9-9ec7-00e04c3600d7\",\n            \"type\": \"STOP_LIMIT\",\n            \"quote_currency\": \"KRW\",\n            \"target_currency\": \"ETH\",\n            \"price\": \"35000000\",\n            \"remain_qty\": \"1\",\n            \"original_qty\": \"1\",\n            \"canceled_qty\": \"0\",\n            \"executed_qty\": \"0\",\n            \"side\": \"SELL\",\n            \"fee\": \"0\",\n            \"fee_rate\": \"0.0\",\n            \"average_executed_price\": \"0\",\n            \"ordered_at\": 1682382211000,\n            \"is_triggered\": false,\n            \"trigger_price\": \"37000000\",\n            \"triggered_at\": null\n        },\n        {\n            \"order_id\": \"0f51223e-1e4d-11e9-9ec7-00e04c3600d7\",\n            \"type\": \"STOP_LIMIT\",\n            \"quote_currency\": \"KRW\",\n            \"target_currency\": \"BTC\",\n            \"price\": \"35000000\",\n            \"remain_qty\": \"1\",\n            \"original_qty\": \"1\",\n            \"canceled_qty\": \"0\",\n            \"executed_qty\": \"0\",\n            \"side\": \"BUY\",\n            \"fee\": \"0\",\n            \"fee_rate\": \"0.0\",\n            \"average_executed_price\": \"0\",\n            \"ordered_at\": 1682382109000,\n            \"is_triggered\": false,\n            \"trigger_price\": \"37000000\",\n            \"triggered_at\": null\n        },\n        {\n            \"order_id\": \"0f460777-1e4d-11e9-9ec7-00e04c3600d7\",\n            \"type\": \"LIMIT\",\n            \"quote_currency\": \"KRW\",\n            \"target_currency\": \"BTT\",\n            \"price\": \"0.0009\",\n            \"remain_qty\": \"10000000\",\n            \"original_qty\": \"10000000\",\n            \"canceled_qty\": \"0\",\n            \"executed_qty\": \"0\",\n            \"side\": \"BUY\",\n            \"fee\": \"0\",\n            \"fee_rate\": \"0.0\",\n            \"average_executed_price\": \"0\",\n            \"ordered_at\": 1682058807000,\n            \"is_triggered\": null,\n            \"trigger_price\": null,\n            \"triggered_at\": null\n        },\n        {\n            \"order_id\": \"0f459a2f-1e4d-11e9-9ec7-00e04c3600d7\",\n            \"type\": \"LIMIT\",\n            \"quote_currency\": \"KRW\",\n            \"target_currency\": \"BTT\",\n            \"price\": \"0.0009\",\n            \"remain_qty\": \"50000000.1234\",\n            \"original_qty\": \"50000000.1234\",\n            \"canceled_qty\": \"0\",\n            \"executed_qty\": \"0\",\n            \"side\": \"BUY\",\n            \"fee\": \"0\",\n            \"fee_rate\": \"0.0\",\n            \"average_executed_price\": \"0\",\n            \"ordered_at\": 1682055102000,\n            \"is_triggered\": null,\n            \"trigger_price\": null,\n            \"triggered_at\": null\n        },\n        {\n            \"order_id\": \"0f4376d9-1e4d-11e9-9ec7-00e04c3600d7\",\n            \"type\": \"LIMIT\",\n            \"quote_currency\": \"KRW\",\n            \"target_currency\": \"ETH\",\n            \"price\": \"700000\",\n            \"remain_qty\": \"120\",\n            \"original_qty\": \"120\",\n            \"canceled_qty\": \"0\",\n            \"executed_qty\": \"0\",\n            \"side\": \"BUY\",\n            \"fee\": \"0\",\n            \"fee_rate\": \"0.0\",\n            \"average_executed_price\": \"0\",\n            \"ordered_at\": 1681979473000,\n            \"is_triggered\": null,\n            \"trigger_price\": null,\n            \"triggered_at\": null\n        },\n        {\n            \"order_id\": \"0f43763c-1e4d-11e9-9ec7-00e04c3600d7\",\n            \"type\": \"LIMIT\",\n            \"quote_currency\": \"KRW\",\n            \"target_currency\": \"ETH\",\n            \"price\": \"1500000\",\n            \"remain_qty\": \"30.1234\",\n            \"original_qty\": \"30.1234\",\n            \"canceled_qty\": \"0\",\n            \"executed_qty\": \"0\",\n            \"side\": \"BUY\",\n            \"fee\": \"0\",\n            \"fee_rate\": \"0.0\",\n            \"average_executed_price\": \"0\",\n            \"ordered_at\": 1681979405000,\n            \"is_triggered\": null,\n            \"trigger_price\": null,\n            \"triggered_at\": null\n        }\n    ]\n}"
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
                        "error_code": {
                          "type": "string",
                          "example": "0"
                        },
                        "active_orders": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "order_id": {
                                "type": "string",
                                "example": "0f512299-1e4d-11e9-9ec7-00e04c3600d7"
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
                              "price": {
                                "type": "string",
                                "example": "35000000"
                              },
                              "remain_qty": {
                                "type": "string",
                                "example": "1"
                              },
                              "original_qty": {
                                "type": "string",
                                "example": "1"
                              },
                              "canceled_qty": {
                                "type": "string",
                                "example": "0"
                              },
                              "executed_qty": {
                                "type": "string",
                                "example": "0"
                              },
                              "side": {
                                "type": "string",
                                "example": "BUY"
                              },
                              "fee": {
                                "type": "string",
                                "example": "0"
                              },
                              "fee_rate": {
                                "type": "string",
                                "example": "0.0"
                              },
                              "average_executed_price": {
                                "type": "string",
                                "example": "0"
                              },
                              "ordered_at": {
                                "type": "integer",
                                "example": 1682382169000,
                                "default": 0
                              },
                              "is_triggered": {},
                              "trigger_price": {},
                              "triggered_at": {}
                            }
                          }
                        }
                      }
                    },
                    {
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
                        "active_orders": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "order_id": {
                                "type": "string",
                                "example": "0f5122d8-1e4d-11e9-9ec7-00e04c3600d7"
                              },
                              "type": {
                                "type": "string",
                                "example": "STOP_LIMIT"
                              },
                              "quote_currency": {
                                "type": "string",
                                "example": "KRW"
                              },
                              "target_currency": {
                                "type": "string",
                                "example": "ETH"
                              },
                              "price": {
                                "type": "string",
                                "example": "35000000"
                              },
                              "remain_qty": {
                                "type": "string",
                                "example": "1"
                              },
                              "original_qty": {
                                "type": "string",
                                "example": "1"
                              },
                              "canceled_qty": {
                                "type": "string",
                                "example": "0"
                              },
                              "executed_qty": {
                                "type": "string",
                                "example": "0"
                              },
                              "side": {
                                "type": "string",
                                "example": "SELL"
                              },
                              "fee": {
                                "type": "string",
                                "example": "0"
                              },
                              "fee_rate": {
                                "type": "string",
                                "example": "0.0"
                              },
                              "average_executed_price": {
                                "type": "string",
                                "example": "0"
                              },
                              "ordered_at": {
                                "type": "integer",
                                "example": 1682382211000,
                                "default": 0
                              },
                              "is_triggered": {
                                "type": "boolean",
                                "example": false,
                                "default": true
                              },
                              "trigger_price": {
                                "type": "string",
                                "example": "37000000"
                              },
                              "triggered_at": {}
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
        "x-readme": {
          "code-samples": [
            {
              "language": "python",
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport uuid\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = str(uuid.uuid4())\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', headers=headers)\n\n    return content\n\n\nprint(get_response(action='/v2.1/order/active_orders', payload={\n    'access_token': ACCESS_TOKEN,\n    'quote_currency': 'KRW',\n    'target_currency': 'BTC'\n}))\n"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\nimport java.util.List;\nimport java.util.UUID;\n\npublic class FindActiveOrders {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/active_orders\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, String nonce, String quote_currency, String target_currency, List<String> order_type){ }\n    private enum OrderType {\n        LIMIT,\n        STOP_LIMIT\n    }\n\n    public static void main(String[] args) throws JsonProcessingException {\n        var nonce = UUID.randomUUID().toString();\n        var payload = new Payload(ACCESS_TOKEN, nonce, \"krw\", \"btc\", List.of(OrderType.LIMIT.name(), OrderType.STOP_LIMIT.name()));\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\nobject FindActiveOrders {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2.1/order/active_orders\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    private data class Payload(val access_token: String, val nonce: String, val quote_currency: String, val target_currency: String, val order_type: List<String>)\n    private enum class OrderType {\n        LIMIT, STOP_LIMIT\n    }\n\n    @JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = UUID.randomUUID().toString()\n        val payload = Payload(ACCESS_TOKEN, nonce, \"krw\", \"btc\", listOf(OrderType.LIMIT.name, OrderType.STOP_LIMIT.name))\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: Payload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\nconst { v4: uuidv4 } = require('uuid');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = {\n    access_token: ACCESS_TOKEN,\n    nonce: uuidv4(),\n    quote_currency: 'KRW',\n    target_currency: 'BTC',\n    order_type: ['LIMIT', 'STOP_LIMIT']\n};\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2.1/order/active_orders',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = uuid.New().String()\n\n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2.1/order/active_orders\", map[string]interface{}{\n\t\t\"access_token\":    accessToken,\n\t\t\"quote_currency\":  \"KRW\",\n\t\t\"target_currency\": \"BTC\",\n\t\t\"order_type\":      []string{\"LIMIT\"}, //The order_type can include MARKET, STOP_LIMIT, and if order_type is null or an empty list, all order types are retrieved\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
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
  "_id": "68394678760f3c0030350497:68394678760f3c00303504e4"
}
```
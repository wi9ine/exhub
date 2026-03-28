# 매수/매도 주문

시장가, 지정가, 예약가 주문 유형으로 매수/매도 주문 등록

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
    "h-4": "주문 유형",
    "0-0": "access_token",
    "0-1": "String",
    "0-2": "true",
    "0-3": "사용자의 액세스 토큰",
    "0-4": "모든 유형",
    "1-0": "nonce",
    "1-1": "String",
    "1-2": "true",
    "1-3": "UUID nonce  \n\\* 예: \"022f53b2-8b2f-40c6-8e51-b594f562ee83\"",
    "1-4": "모든 유형",
    "2-0": "side",
    "2-1": "String",
    "2-2": "true",
    "2-3": "매수/매도 분류  \n  \n- `BUY`: 매수\n- `SELL` : 매도",
    "2-4": "모든 유형",
    "3-0": "quote_currency",
    "3-1": "String",
    "3-2": "true",
    "3-3": "마켓 기준 통화  \n\\* 예: KRW",
    "3-4": "모든 유형",
    "4-0": "target_currency",
    "4-1": "String",
    "4-2": "true",
    "4-3": "주문하려는 종목의 심볼  \n\\* 예: BTC",
    "4-4": "모든 유형",
    "5-0": "type",
    "5-1": "String",
    "5-2": "true",
    "5-3": "주문 유형  \n  \n- `LIMIT`: 지정가\n- `MARKET` : 시장가\n- `STOP_LIMIT` : 예약가",
    "5-4": "모든 유형",
    "6-0": "price",
    "6-1": "String",
    "6-2": "false",
    "6-3": "주문 가격  \n\\* 지정가, 예약가에서 필수",
    "6-4": "지정가, 예약가",
    "7-0": "qty",
    "7-1": "String",
    "7-2": "false",
    "7-3": "주문 수량  \n\\* 지정가, 예약가, 시장가 매도에서 필수  \n\\* 최소수량단위 미만은 절사됩니다.",
    "7-4": "지정가, 예약가, 시장가 매도",
    "8-0": "amount",
    "8-1": "String",
    "8-2": "false",
    "8-3": "주문 총액  \n\\* 시장가 매수에서 필수  \n\\* 원화최소단위(0.0001) 미만은 절사됩니다.",
    "8-4": "시장가 매수",
    "9-0": "post_only",
    "9-1": "Boolean",
    "9-2": "false",
    "9-3": "Post Only 주문 여부  \n\\* 지정가에서 필수",
    "9-4": "지정가",
    "10-0": "limit_price",
    "10-1": "String",
    "10-2": "false",
    "10-3": "체결 가격의 최대/최소 한도 (상한가,하한가)",
    "10-4": "시장가",
    "11-0": "trigger_price",
    "11-1": "String",
    "11-2": "false",
    "11-3": "예약가 주문이 실행되는 가격 (감시가)  \n\\* 예약가에서 필수",
    "11-4": "예약가",
    "12-0": "user_order_id",
    "12-1": "String",
    "12-2": "false",
    "12-3": "- 150자까지 지원\n- 알파벳 소문자 / 숫자 / 특수문자 - \\_ . 지원\n- 거래쌍 상관 없이 기존에 입력한 user_order_id 는 재사용 불가",
    "12-4": "모든 유형"
  },
  "cols": 5,
  "rows": 13,
  "align": [
    "left",
    "left",
    "left",
    "left",
    "left"
  ]
}
[/block]

* limit\_price 사용예시)
  * Case1: 시장가 매수, limit\_price: 350 KRW 설정 시,
    * 350원 호가까지 체결, 한틱위인 350.1원의 경우, 추가적으로 체결할 수 있는 총액이 남아 있더라도 체결되지 않음.
    * 체결되지 않은 주문 총액은 자동으로 취소.
  * Case2: 시장가 매도, limit\_price: 350 KRW 설정 시,
    * 350원 호가까지 체결, 한틱 아래인 349.9원의 경우, 추가적으로 체결할 수 있는 수량이 남아 있더라도 체결되지 않음.
    * 체결되지 않은 매도 총량은 자동으로 취소.

or

* 시장가 주문 중, 1BTC 현재가 = 30,000,000KRW, 상한가 = 35,000,000KRW인 경우 상한가의 수량까지만 체결

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
    "1-1": "NumberString",
    "1-2": "정상 처리 시 \"0\", 에러 발생 시 에러코드 \"0\" 이 아닌 값 반환",
    "2-0": "order_id",
    "2-1": "String",
    "2-2": "주문 식별 가능한 ID  \n\\* 예: \"d85cc6af-b131-4398-b269-ddbafa760a39\""
  },
  "cols": 3,
  "rows": 3,
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
    "/v2.1/order": {
      "post": {
        "summary": "매수/매도 주문",
        "description": "시장가, 지정가, 예약가 주문 유형으로 매수/매도 주문 등록",
        "operationId": "place-order",
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
                  "side",
                  "quote_currency",
                  "target_currency",
                  "type"
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
                  "side": {
                    "type": "string",
                    "description": "매수/매도 여부 (Enum: \"BUY\", \"SELL\")"
                  },
                  "quote_currency": {
                    "type": "string",
                    "description": "마켓 기준 통화"
                  },
                  "target_currency": {
                    "type": "string",
                    "description": "주문하려는 종목의 심볼"
                  },
                  "type": {
                    "type": "string",
                    "description": "주문 방식, LIMIT 지정가, STOP_LIMIT 예약 지정가, MARKET 시장가"
                  },
                  "price": {
                    "type": "string",
                    "description": "지정가, 예약지정가 일때 , 주문 가격"
                  },
                  "qty": {
                    "type": "string",
                    "description": "지정가, 예약지정가, 시장가 매도일 때, 주문 수량"
                  },
                  "amount": {
                    "type": "string",
                    "description": "시장가 매수 일 때, 주문 총액"
                  },
                  "post_only": {
                    "type": "boolean",
                    "description": "지정가 주문일때만, only maker로 주문할 것인지 여부"
                  },
                  "limit_price": {
                    "type": "string",
                    "description": "시장가 매수 일때 상한가, 매도 일때 하한가. 입력하지 않으면 가격 제한 없이 주문 체결"
                  },
                  "trigger_price": {
                    "type": "string",
                    "description": "예약지정가 주문인 일때, 주문이 발동되는 금액"
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
                    "value": "{\n    \"result\": \"success\",\n    \"error_code\": \"0\",\n    \"order_id\": \"0f512287-1e4d-11e9-9ec7-00e04c3600d7\"\n}"
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
                      "example": "0f512287-1e4d-11e9-9ec7-00e04c3600d7"
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
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport uuid\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = str(uuid.uuid4())\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', headers=headers)\n\n    return content\n\n\nprint(get_response(action='/v2.1/order', payload={\n    'access_token': ACCESS_TOKEN,\n    'quote_currency': 'KRW',\n    'target_currency': 'BTC',\n  \t'type': 'LIMIT',\n  \t'side': 'BUY',\n  \t'qty': '1',\n  \t'price': '38000000',\n  \t'post_only': False\n}))\n"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\nimport java.util.UUID;\n\npublic class PlaceOrder {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2.1/order\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, String nonce, String quote_currency, String target_currency, String type, String side, String price, String qty, String amount, String limit_price, Boolean post_only, String trigger_price){\n        public static Payload limitOrder(String access_token, String nonce, String quote_currency, String target_currency, String side, String price, String qty, boolean post_only) {\n            return new Payload(access_token, nonce, quote_currency, target_currency, OrderType.LIMIT.name(), side, price, qty, null, null, post_only, null);\n        }\n\n        public static Payload buyMarketOrder(String access_token, String nonce, String quote_currency, String target_currency, String amount, String limit_price) {\n            return new Payload(access_token, nonce, quote_currency, target_currency, OrderType.MARKET.name(), OrderSide.BUY.name(), null, null, amount, limit_price, null, null);\n        }\n\n        public static Payload sellMarketOrder(String access_token, String nonce, String quote_currency, String target_currency, String qty, String limit_price) {\n            return new Payload(access_token, nonce, quote_currency, target_currency, OrderType.MARKET.name(), OrderSide.SELL.name(), null, qty, null, limit_price, null, null);\n        }\n\n        public static Payload stopLimitOrder(String access_token, String nonce, String quote_currency, String target_currency, String side, String price, String qty, String trigger_price) {\n            return new Payload(access_token, nonce, quote_currency, target_currency, OrderType.STOP_LIMIT.name(), side, price, qty, null, null, null, trigger_price);\n        }\n    }\n    private enum OrderType {\n        LIMIT,\n        MARKET,\n        STOP_LIMIT\n    }\n\n    private enum OrderSide {\n        BUY,\n        SELL\n    }\n\n    public static void main(String[] args) {\n        var nonce = UUID.randomUUID().toString();\n        var payload = Payload.limitOrder(ACCESS_TOKEN, nonce, \"krw\", \"btc\", \"BUY\", \"35000000\", \"0.1\", false);\n//        var payload = Payload.buyMarketOrder(ACCESS_TOKEN, nonce, \"krw\", \"btc\", \"40000000\", \"1\");\n//        var payload = Payload.sellMarketOrder(ACCESS_TOKEN, nonce, \"krw\", \"btc\", \"0.5\", \"25000000\");\n//        var payload = Payload.stopLimitOrder(ACCESS_TOKEN, nonce, \"krw\", \"btc\", \"BUY\", \"35000000\", \"0.5\", \"34590000\");\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\nobject PlaceOrder {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2.1/order\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    private data class Payload(val access_token: String, val nonce: String, val quote_currency: String, val target_currency: String, val type: String, val side: String, val price: String?, val qty: String?, val amount: String?, val limit_price: String?, val post_only: Boolean?, val trigger_price: String?) {\n        companion object {\n            fun limitOrder(access_token: String, nonce: String, quote_currency: String, target_currency: String, side: String, price: String?, qty: String?, post_only: Boolean): Payload {\n                return Payload(\n                    access_token = access_token,\n                    nonce = nonce,\n                    quote_currency = quote_currency,\n                    target_currency = target_currency,\n                    type = OrderType.LIMIT.name,\n                    side = side,\n                    price = price,\n                    qty = qty,\n                    amount =  null,\n                    limit_price = null,\n                    post_only = post_only,\n                    trigger_price = null\n                )\n            }\n\n            fun buyMarketOrder(access_token: String, nonce: String, quote_currency: String, target_currency: String, amount: String?, limit_price: String?): Payload {\n                return Payload(\n                    access_token = access_token,\n                    nonce = nonce,\n                    quote_currency = quote_currency,\n                    target_currency = target_currency,\n                    type = OrderType.MARKET.name,\n                    side = OrderSide.BUY.name,\n                    price = null,\n                    qty = null,\n                    amount = amount,\n                    limit_price = limit_price,\n                    post_only = null,\n                    trigger_price = null\n                )\n            }\n\n            fun sellMarketOrder(access_token: String, nonce: String, quote_currency: String, target_currency: String, qty: String?, limit_price: String?): Payload {\n                return Payload(\n                    access_token = access_token,\n                    nonce = nonce,\n                    quote_currency = quote_currency,\n                    target_currency = target_currency,\n                    type = OrderType.MARKET.name,\n                    side = OrderSide.SELL.name,\n                    price = null,\n                    qty = qty,\n                    amount = null,\n                    limit_price = limit_price,\n                    post_only = null,\n                    trigger_price = null\n                )\n            }\n\n            fun stopLimitOrder(access_token: String, nonce: String, quote_currency: String, target_currency: String, side: String, price: String?, qty: String?, trigger_price: String?): Payload {\n                return Payload(\n                    access_token = access_token,\n                    nonce = nonce,\n                    quote_currency = quote_currency,\n                    target_currency = target_currency,\n                    type = OrderType.STOP_LIMIT.name,\n                    side = side,\n                    price = price,\n                    qty = qty,\n                    amount = null,\n                    limit_price = null,\n                    post_only = null,\n                    trigger_price = trigger_price\n                )\n            }\n        }\n    }\n\n    private enum class OrderType {\n        LIMIT, MARKET, STOP_LIMIT\n    }\n\n    private enum class OrderSide {\n        BUY, SELL\n    }\n  \n\t\t@JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = UUID.randomUUID().toString()\n        val payload = Payload.limitOrder(ACCESS_TOKEN, nonce, \"krw\", \"btc\", OrderSide.BUY.name, \"35000000\", \"0.1\", false)\n//        val payload = Payload.buyMarketOrder(ACCESS_TOKEN, nonce, \"krw\", \"btc\", \"40000000\", \"36000000\")\n//        val payload = Payload.sellMarketOrder(ACCESS_TOKEN, nonce, \"krw\", \"btc\", \"1.0\", \"35000000\")\n//        val payload = Payload.stopLimitOrder(ACCESS_TOKEN, nonce, \"krw\", \"btc\", OrderSide.BUY.name, \"35500000\", \"1.0\", \"35400000\")\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: Payload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\nconst { v4: uuidv4 } = require('uuid');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = limitOrder(ACCESS_TOKEN, 'KRW', 'BTC', 'BUY', '4241000.0', '0.1', false)\n// const payload = buyMarketOrder(ACCESS_TOKEN, 'KRW', 'BTC', '45000000.0', '40000000.0')\n// const payload = sellMarketOrder(ACCESS_TOKEN, 'KRW', 'BTC', '1.0', '25000000.0')\n// const payload = stopLimitOrder(ACCESS_TOKEN, 'KRW', 'BTC', 'BUY', '35000000.0', '1.0', '36000000.0')\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2.1/order',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});\n\n\nfunction limitOrder(accessToken, quoteCurrency, targetCurrency, side, price, qty, postOnly) {\n    return {\n        access_token: accessToken,\n        nonce: uuidv4(),\n        quote_currency: quoteCurrency,\n        target_currency: targetCurrency,\n        type: 'LIMIT',\n        side: side,\n        price: price,\n        qty: qty,\n        post_only: postOnly\n    }\n}\n\nfunction buyMarketOrder(accessToken, quoteCurrency, targetCurrency, amount, limitPrice) {\n    return {\n        access_token: accessToken,\n        nonce: uuidv4(),\n        quote_currency: quoteCurrency,\n        target_currency: targetCurrency,\n        type: 'MARKET',\n        side: 'BUY',\n        amount: amount,\n        limit_price: limitPrice,\n    }\n}\n\nfunction sellMarketOrder(accessToken, quoteCurrency, targetCurrency, qty, limitPrice) {\n    return {\n        access_token: accessToken,\n        nonce: uuidv4(),\n        quote_currency: quoteCurrency,\n        target_currency: targetCurrency,\n        type: 'MARKET',\n        side: 'SELL',\n        qty: qty,\n        limit_price: limitPrice\n    }\n}\n\nfunction stopLimitOrder(accessToken, quoteCurrency, targetCurrency, side, price, qty, triggerPrice) {\n    return {\n        access_token: accessToken,\n        nonce: uuidv4(),\n        quote_currency: quoteCurrency,\n        target_currency: targetCurrency,\n        type: 'STOP_LIMIT',\n        side: side,\n        price: price,\n        qty: qty,\n        trigger_price: triggerPrice\n    }\n}"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = uuid.New().String()\n\n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2.1/order\", map[string]interface{}{\n\t\t\"access_token\":    accessToken,\n\t\t\"quote_currency\":  \"KRW\",\n\t\t\"target_currency\": \"BTC\",\n\t\t\"type\":            \"MARKET\",\n\t\t\"side\":            \"BUY\",\n\t\t\"amount\":          \"10000000\", //only for market buy order\n\t\t\"qty\":             nil,        // for limit order, stop limit order, market sell order\n\t\t\"limit_price\":     \"12000000\", //for market order\n\t\t\"price\":           nil,        // for limit, stop limit order\n\t\t\"post_only\":       nil,        // for limit order\n\t\t\"trigger_price\":   nil,        // for stop limit order\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
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
  "_id": "68394678760f3c0030350497:68394678760f3c00303504e3"
}
```
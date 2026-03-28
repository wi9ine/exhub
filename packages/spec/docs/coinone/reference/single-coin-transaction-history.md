# 가상자산 입출금 내역 단건 조회

출금 API를 통해 받은 ID를 이용하여 가상자산의 입출금 내역의 진행상태를 조회할 수 있습니다.

> ❗️ 해당 API는 포트폴리오 기능을 지원하지 않습니다
>
> [포트폴리오 API Key 이용 시 지원하지 않는 API 목록](https://docs.coinone.co.kr/changelog/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4-%EA%B8%B0%EB%8A%A5-%EC%8B%A0%EA%B7%9C-%EC%A7%80%EC%9B%90#:~:text=%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%20API%20Key%20%EC%9D%B4%EC%9A%A9%20%EC%8B%9C%20%EC%A7%80%EC%9B%90%ED%95%98%EC%A7%80%20%EC%95%8A%EB%8A%94%20API%20%EB%AA%A9%EB%A1%9D)

## Request Header

| 필드                  | 필수   | 설명                                                       |
| :------------------ | :--- | :------------------------------------------------------- |
| X-COINONE-PAYLOAD   | true | Request body object -> JSON string -> base64             |
| X-COINONE-SIGNATURE | true | HMAC(X-COINONE-PAYLOAD, SECRET\_KEY, SHA512).hexdigest() |

## Request Body

| field         | type   | required/optional | description                                            |
| ------------- | ------ | ----------------- | ------------------------------------------------------ |
| access\_token | string | required          | 사용자의 액세스 토큰 (access token)                             |
| nonce         | string | required          | UUID nonce (예: "022f53b2-8b2f-40c6-8e51-b594f562ee83") |
| id            | string | required          | 입출금 거래 식별 id                                           |

## Response Body

| Key                        | Type           | Description                                                              |
| :------------------------- | :------------- | :----------------------------------------------------------------------- |
| result                     | String         | 정상 반환 시 success, 에러 코드 반환 시 error                                        |
| error\_code                | NumberString   | error 발생 시 에러코드 반환, 성공인 경우 0 반환                                          |
| transactions               | Array\[Object] | 배열 형태의 가상자산 입출금 목록                                                       |
| - id                       | String         | 입출금 거래 식별 ID (예: "0fec72eb-1e4d-11e9-9ec7-00e04c3600d7")                 |
| - currency                 | String         | 해당되는 종목의 심볼                                                              |
| - txid                     | String         | 블록체인상의 식별 ID (Transaction ID)                                            |
| - type                     | String         | 입출금 여부 (예: "WITHDRAWAL", "DEPOSIT")                                      |
| - from\_address            | String         | 발송 지갑 주소 (예: "muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL")                       |
| - from\_secondary\_address | String         | 발송 지갑의 서브 주소 (XRP, XLM, EOS, 등의 메모, 태그)가 있을 경우 해당 주소 반환 (예: "153214622") |
| - to\_address              | String         | 도착 지갑 주소 (예: "muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL")                       |
| - to\_secondary\_address   | String         | 도착 지갑의 서브 주소 (XRP, XLM, EOS, 등의 메모, 태그)가 있을 경우 해당 주소 반환 (예: "153214622") |
| - confirmations            | Number         | 컨펌 수                                                                     |
| - amount                   | NumberString   | 입금/출금 되는 수량                                                              |
| - fee                      | NumberString   | 거래 수수료                                                                   |
| - status                   | String         | 입출금 진행 상태 (아래 status 표 참고)                                               |
| - created\_at              | Number         | 입출금 거래 생성 시점 (unit of time: millisecond)                                 |

### status

| Transaction status       | Description                             |
| :----------------------- | :-------------------------------------- |
| DEPOSIT\_WAIT            | 입금 대기 중, 입금 요청이 컨펌되지는 않고 블록체인에 등록만 된 상태 |
| DEPOSIT\_SUCCESS         | 입금 완료, 블록체인에 반연 완료 된 상태                 |
| DEPOSIT\_FAIL            | 입금 실패                                   |
| DEPOSIT\_REFUND          | 입금 건을 환급한 상태                            |
| DEPOSIT\_REJECT          | 불가능한 경로로 입금되어 입금 거부된 상태                 |
| WITHDRAWAL\_REGISTER     | 출금 등록, 출금 요청이 컨펌되지는 않고 블록체인에 등록만 된 상태   |
| WITHDRAWAL\_WAIT         | 출금 대기 중, 출금 요청이 블록체인에 반영되고 컨펌이 진행 중인 상태 |
| WITHDRAWAL\_SUCCESS      | 출금 완료                                   |
| WITHDRAWAL\_FAIL         | 출금 실패                                   |
| WITHDRAWAL\_REFUND       | 출금 실패한 건을 환급한 상태                        |
| WITHDRAWAL\_REFUND\_FAIL | 출금 환급이 실패한 상태                           |

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
    "/v2.1/transaction/coin/history/detail": {
      "post": {
        "summary": "가상자산 입출금 내역 단건 조회",
        "description": "출금 API를 통해 받은 ID를 이용하여 가상자산의 입출금 내역의 진행상태를 조회할 수 있습니다.",
        "operationId": "single-coin-transaction-history",
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
                  "id"
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
                  "id": {
                    "type": "string",
                    "description": "입출금 거래 식별 id"
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"transactions\": [\n    {\n      \"id\": \"0fec72eb-1e4d-11e9-9ec7-00e04c3600d7\",\n      \"currency\": \"BTC\",\n      \"txid\": \"bb1d723751cc4d312c38adc13d9a45b9a16608328d0b9a10f5e3ebc647d64506\",\n      \"type\": \"WITHDRAWAL\",\n      \"from_address\": \"muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL\",\n      \"from_secondary_address\": \"153214622\",\n      \"to_address\": \"n4G1hT3egiBQ6uSU5pLkGjiKJ6XGjS5k1P\",\n      \"to_secondary_address\": \"\",\n      \"confirmations\": 3,\n      \"amount\": \"0.121\",\n      \"fee\": \"0.0001\",\n      \"status\": \"DEPOSIT_SUCCESS\",\n      \"created_at\": 1662108602000\n    }\n  ]\n}"
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
                    "transactions": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "example": "0fec72eb-1e4d-11e9-9ec7-00e04c3600d7"
                          },
                          "currency": {
                            "type": "string",
                            "example": "BTC"
                          },
                          "txid": {
                            "type": "string",
                            "example": "bb1d723751cc4d312c38adc13d9a45b9a16608328d0b9a10f5e3ebc647d64506"
                          },
                          "type": {
                            "type": "string",
                            "example": "WITHDRAWAL"
                          },
                          "from_address": {
                            "type": "string",
                            "example": "muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL"
                          },
                          "from_secondary_address": {
                            "type": "string",
                            "example": "153214622"
                          },
                          "to_address": {
                            "type": "string",
                            "example": "n4G1hT3egiBQ6uSU5pLkGjiKJ6XGjS5k1P"
                          },
                          "to_secondary_address": {
                            "type": "string",
                            "example": ""
                          },
                          "confirmations": {
                            "type": "integer",
                            "example": 3,
                            "default": 0
                          },
                          "amount": {
                            "type": "string",
                            "example": "0.121"
                          },
                          "fee": {
                            "type": "string",
                            "example": "0.0001"
                          },
                          "status": {
                            "type": "string",
                            "example": "DEPOSIT_SUCCESS"
                          },
                          "created_at": {
                            "type": "integer",
                            "example": 1662108602000,
                            "default": 0
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
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport uuid\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = str(uuid.uuid4())\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', headers=headers)\n\n    return content\n\n\nprint(get_response(action='/v2.1/transaction/coin/history/detail', payload={\n    'access_token': ACCESS_TOKEN,\n    'id': '0fec72eb-1e4d-11e9-9ec7-00e04c3600d7'\n}))"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\nimport java.util.UUID;\n\npublic class FindCoinTransferHistory {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2.1/transaction/coin/history/detail\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, String nonce, String id){}\n\n    public static void main(String[] args) {\n        var nonce = UUID.randomUUID().toString();\n        var payload = new Payload(ACCESS_TOKEN, nonce, \"0fec72eb-1e4d-11e9-9ec7-00e04c3600d7\");\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\n\nobject FindCoinTransferHistory {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2.1/transaction/coin/history/detail\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    internal data class FindCoinTransferHistoryPayload(val access_token: String, val nonce: String, val id: String)\n\n    @JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = UUID.randomUUID().toString()\n        val payload =\n            FindCoinTransferHistoryPayload(ACCESS_TOKEN, nonce,\"0fec72eb-1e4d-11e9-9ec7-00e04c3600d7\")\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: FindCoinTransferHistoryPayload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\nconst { v4: uuidv4 } = require('uuid');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = {\n    access_token: ACCESS_TOKEN,\n    nonce: uuidv4(),\n    id: '0fec72eb-1e4d-11e9-9ec7-00e04c3600d7'\n};\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2.1/transaction/coin/history/detail',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = uuid.New().String()\n\n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2.1/transaction/coin/history/detail\", map[string]interface{}{\n\t\t\"access_token\": accessToken,\n\t\t\"id\":  \"0fec72eb-1e4d-11e9-9ec7-00e04c3600d7\"\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
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
  "_id": "68394678760f3c0030350497:68394678760f3c00303504f0"
}
```
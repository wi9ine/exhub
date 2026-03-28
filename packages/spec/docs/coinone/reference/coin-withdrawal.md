# 가상자산 출금

2차 인증 및 수취인정보 입력이 완료된 주소에 대해 API를 이용한 출금을 요청합니다.

> ❗️ 해당 API는 포트폴리오 기능을 지원하지 않습니다
>
> [포트폴리오 API Key 이용 시 지원하지 않는 API 목록](https://docs.coinone.co.kr/changelog/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4-%EA%B8%B0%EB%8A%A5-%EC%8B%A0%EA%B7%9C-%EC%A7%80%EC%9B%90#:~:text=%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%20API%20Key%20%EC%9D%B4%EC%9A%A9%20%EC%8B%9C%20%EC%A7%80%EC%9B%90%ED%95%98%EC%A7%80%20%EC%95%8A%EB%8A%94%20API%20%EB%AA%A9%EB%A1%9D)

코인원 홈페이지 > Open API > API 출금주소록에서 추가 정보 등록과 추가 채널 인증을 완료한 출금 주소를 통해서만 출금 가능합니다.

## Request Header

| 필드                  | 필수   | 설명                                                       |
| :------------------ | :--- | :------------------------------------------------------- |
| X-COINONE-PAYLOAD   | true | Request body object -> JSON string -> base64             |
| X-COINONE-SIGNATURE | true | HMAC(X-COINONE-PAYLOAD, SECRET\_KEY, SHA512).hexdigest() |

## Request Body

| field              | type   | required/optional | description                                            |
| ------------------ | ------ | ----------------- | ------------------------------------------------------ |
| access\_token      | string | required          | 사용자의 액세스 토큰 (access token)                             |
| nonce              | string | required          | UUID nonce (예: "022f53b2-8b2f-40c6-8e51-b594f562ee83") |
| currency           | string | required          | 출금하려는 가상자산                                             |
| amount             | string | required          | 출금하려는 수량                                               |
| address            | string | required          | 출금 주소 (가상자산을 입금 받게될 주소)  : 대소문자를 구분합니다.                |
| secondary\_address | string | optional          | memo 혹은 dtag값 : 대소문자를 구분합니다.                           |

## Response Body

| Key                  | Type         | Description                                                              |
| :------------------- | :----------- | :----------------------------------------------------------------------- |
| result               | String       | 정상 반환 시 success, 에러 코드 반환 시 error                                        |
| error\_code          | NumberString | error 발생 시 에러코드 반환, 성공인 경우 0 반환                                          |
| transaction          | Object       |                                                                          |
| - id                 | String       | 입출금 거래 식별 ID (예: "0fec72eb-1e4d-11e9-9ec7-00e04c3600d7")                 |
| - currency           | String       | 해당되는 종목의 심볼                                                              |
| - address            | String       | 도착 지갑 주소 (예: "muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL")                       |
| - secondary\_address | String       | 도착 지갑의 서브 주소 (XRP, XLM, EOS, 등의 메모, 태그)가 있을 경우 해당 주소 반환 (예: "153214622") |
| - amount             | NumberString | 입금/출금 되는 수량                                                              |
| - status             | String       | 입출금 진행 상태 (아래 status 표 참고)                                               |

<br />

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
    "/v2.1/transaction/coin/withdrawal": {
      "post": {
        "summary": "가상자산 출금",
        "description": "\b2차 인증 및 수취인정보 입력이 완료된 주소에 대해 API를 이용한 출금을 요청합니다.",
        "operationId": "coin-withdrawal",
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
                  "\bcurrency",
                  "amount",
                  "address"
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
                  "\bcurrency": {
                    "type": "string",
                    "description": "출금하려는 가상자산"
                  },
                  "amount": {
                    "type": "string",
                    "description": "출금하려는 수량"
                  },
                  "address": {
                    "type": "string",
                    "description": "출금 주소 (가상자산을 입금 받게될 주소)"
                  },
                  "secondary_address": {
                    "type": "string",
                    "description": "memo 혹은 dtag값"
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
                    "value": "{\n  \"result\": \"success\",\n  \"error_code\": \"0\",\n  \"transaction\": \n    {\n      \"id\": \"0fec72eb-1e4d-11e9-9ec7-00e04c3600d7\",\n      \"currency\": \"BTC\",\n      \"address\": \"muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL\",\n      \"secondary_address\": \"memo,\n      \"amount\": \"1.1\",\n      \"status\": \"WITHDRAWAL_REGISTER\"\n    }\n}"
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
              "code": "import base64\nimport hashlib\nimport hmac\nimport json\nimport uuid\nimport httplib2\n\nACCESS_TOKEN = '{access token}'\nSECRET_KEY = bytes('{secret key}', 'utf-8')\n\n\ndef get_encoded_payload(payload):\n    payload['nonce'] = str(uuid.uuid4())\n\n    dumped_json = json.dumps(payload)\n    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))\n    return encoded_json\n\n\ndef get_signature(encoded_payload):\n    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)\n    return signature.hexdigest()\n\n\ndef get_response(action, payload):\n    url = '{}{}'.format('https://api.coinone.co.kr', action)\n\n    encoded_payload = get_encoded_payload(payload)\n\n    headers = {\n        'Content-type': 'application/json',\n        'X-COINONE-PAYLOAD': encoded_payload,\n        'X-COINONE-SIGNATURE': get_signature(encoded_payload),\n    }\n\n    http = httplib2.Http()\n    response, content = http.request(url, 'POST', headers=headers)\n\n    return content\n\n\nprint(get_response(action='/v2.1/transaction/coin/withdrawal', payload={\n    'access_token': ACCESS_TOKEN,\n    'currency': 'BTC',\n    'amount': '1.1',\n    'address': 'muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL',\n    'secondary_address': 'memo'\n\n}))"
            },
            {
              "language": "java",
              "code": "package main;\n\nimport com.fasterxml.jackson.core.JsonProcessingException;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.io.IOException;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.security.InvalidKeyException;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.Base64;\nimport java.util.UUID;\n\npublic class FindCoinTransferHistory {\n    private static final String ENDPOINT = \"https://api.coinone.co.kr/v2.1/transaction/coin/withdrawal\";\n    private static final String ACCESS_TOKEN = \"{accessToken}\";\n    private static final String SECRET_KEY = \"{secretKey}\";\n    private static final ObjectMapper om = new ObjectMapper();\n    private record Payload(String access_token, String nonce, String currency, String amount, String address, String secondary_address){}\n\n    public static void main(String[] args) {\n        var nonce = UUID.randomUUID().toString();\n        var payload = new Payload(ACCESS_TOKEN, nonce, \"BTC\", \"1.1\", \"muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL\", \"memo\");\n        var base64EncodedPayload = makeBase64EncodedPayload(payload);\n        var signature = makeSignature(base64EncodedPayload);\n\n        try {\n            var client = HttpClient.newBuilder().build();\n            var body = om.writeValueAsString(payload);\n            var request = HttpRequest.newBuilder()\n                    .uri(URI.create(ENDPOINT))\n                    .header(\"Content-type\", \"application/json\")\n                    .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                    .header(\"X-COINONE-SIGNATURE\", signature)\n                    .POST(HttpRequest.BodyPublishers.ofString(body))\n                    .build();\n            var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n            System.out.println(response.body());\n        } catch (InterruptedException | IOException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    private static String makeBase64EncodedPayload(Payload payload) {\n        try {\n            var bytesPayload = om.writeValueAsBytes(payload);\n            return Base64.getEncoder().encodeToString(bytesPayload);\n        } catch (JsonProcessingException e) {\n            throw new RuntimeException(e);\n        }\n    }\n    private static String makeSignature(String base64EncodedPayload) {\n        try {\n            var mac = Mac.getInstance(\"HmacSHA512\");\n            var keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), \"HmacSHA512\");\n            mac.init(keySpec);\n            var messageDigest = mac.doFinal(base64EncodedPayload.getBytes());\n            var sb = new StringBuilder();\n            for (byte b : messageDigest) {\n                sb.append(String.format(\"%02x\", b));\n            }\n            return sb.toString();\n        } catch (NoSuchAlgorithmException | InvalidKeyException e) {\n            throw new RuntimeException(e);\n        }\n    }\n}"
            },
            {
              "language": "kotlin",
              "code": "package main\n\nimport com.fasterxml.jackson.core.JsonProcessingException\nimport com.fasterxml.jackson.databind.ObjectMapper\nimport java.io.IOException\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\nimport java.security.InvalidKeyException\nimport java.security.NoSuchAlgorithmException\nimport java.util.*\nimport javax.crypto.Mac\nimport javax.crypto.spec.SecretKeySpec\n\n\nobject FindCoinTransferHistory {\n    private const val ENDPOINT = \"https://api.coinone.co.kr/v2.1/transaction/coin/withdrawal\"\n    private const val ACCESS_TOKEN = \"{accessToken}\"\n    private const val SECRET_KEY = \"{secretKey}\"\n    private val om = ObjectMapper()\n    internal data class FindCoinTransferHistoryPayload(val access_token: String, val nonce: String, val currency: String, val amount: String, val address: String, val secondary_address: String)\n\n    @JvmStatic\n    fun main(args: Array<String>) {\n        val nonce = UUID.randomUUID().toString()\n        val payload =\n            FindCoinTransferHistoryPayload(ACCESS_TOKEN, nonce, \"BTC\", \"1.1\", \"muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL\", \"memo\")\n        val base64EncodedPayload = makeBase64EncodedPayload(payload)\n        val signature = makeSignature(base64EncodedPayload)\n        try {\n            val client = HttpClient.newBuilder().build()\n            val body = om.writeValueAsString(payload)\n            val request = HttpRequest.newBuilder()\n                .uri(URI.create(ENDPOINT))\n                .header(\"Content-type\", \"application/json\")\n                .header(\"X-COINONE-PAYLOAD\", base64EncodedPayload)\n                .header(\"X-COINONE-SIGNATURE\", signature)\n                .POST(HttpRequest.BodyPublishers.ofString(body))\n                .build()\n            val response = client.send(request, HttpResponse.BodyHandlers.ofString())\n            println(response.body())\n        } catch (e: InterruptedException) {\n            throw RuntimeException(e)\n        } catch (e: IOException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeBase64EncodedPayload(payload: FindCoinTransferHistoryPayload): String {\n        return try {\n            val bytesPayload = om.writeValueAsBytes(payload)\n            Base64.getEncoder().encodeToString(bytesPayload)\n        } catch (e: JsonProcessingException) {\n            throw RuntimeException(e)\n        }\n    }\n\n    private fun makeSignature(base64EncodedPayload: String): String {\n        return try {\n            val mac = Mac.getInstance(\"HmacSHA512\")\n            val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(), \"HmacSHA512\")\n            mac.init(keySpec)\n            val messageDigest = mac.doFinal(base64EncodedPayload.toByteArray())\n            val sb = StringBuilder()\n            for (b in messageDigest) {\n                sb.append(String.format(\"%02x\", b))\n            }\n            sb.toString()\n        } catch (e: NoSuchAlgorithmException) {\n            throw RuntimeException(e)\n        } catch (e: InvalidKeyException) {\n            throw RuntimeException(e)\n        }\n    }\n}"
            },
            {
              "language": "javascript",
              "code": "const request = require('request');\nconst crypto = require('crypto');\nconst { v4: uuidv4 } = require('uuid');\n\n\nconst ACCESS_TOKEN = \"{accessToken}\"\nconst SECRET_KEY = \"{secretKey}\"\n\nconst payload = {\n    access_token: ACCESS_TOKEN,\n    nonce: uuidv4(),\n    currency: 'BTC',\n    amount: '1.1',\n    address: 'muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL',\n    secondary_address: 'memo'\n};\n\nconst encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');\nconst signature = crypto.createHmac('sha512', SECRET_KEY).update(encodedPayload).digest('hex');\nconst options = {\n    url: 'https://api.coinone.co.kr/v2.1/transaction/coin/withdrawal',\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json',\n        'X-COINONE-PAYLOAD': encodedPayload,\n        'X-COINONE-SIGNATURE': signature,\n    },\n    body: JSON.stringify(payload),\n};\n\nrequest(options, (error, response, body) => {\n    if (error) throw new Error(error);\n    console.log(body);\n});"
            },
            {
              "language": "go",
              "code": "package main\n\nimport (\n\t\"fmt\"\n)\n\nimport (\n\t\"crypto/hmac\"\n\t\"crypto/sha512\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"github.com/google/uuid\"\n\t\"io\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nconst (\n\taccessToken = \"{access token}\"\n\tsecretKey   = \"{secret key}\"\n)\n\nfunc getEncodedPayload(payload map[string]interface{}) string {\n\tpayload[\"nonce\"] = uuid.New().String()\n\n\tdumpedJSON, _ := json.Marshal(payload)\n\treturn base64.StdEncoding.EncodeToString(dumpedJSON)\n}\n\nfunc getSignature(encodedPayload string) string {\n\th := hmac.New(sha512.New, []byte(secretKey))\n\th.Write([]byte(encodedPayload))\n\treturn fmt.Sprintf(\"%x\", h.Sum(nil))\n}\n\nfunc getResponse(action string, payload map[string]interface{}) ([]byte, error) {\n\turl := fmt.Sprintf(\"https://api.coinone.co.kr%s\", action)\n\n\tencodedPayload := getEncodedPayload(payload)\n\n\treq, err := http.NewRequest(\"POST\", url, strings.NewReader(\"\"))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treq.Header.Set(\"Content-Type\", \"application/json\")\n\treq.Header.Set(\"X-COINONE-PAYLOAD\", encodedPayload)\n\treq.Header.Set(\"X-COINONE-SIGNATURE\", getSignature(encodedPayload))\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn body, nil\n}\n\nfunc main() {\n\tresponse, err := getResponse(\"/v2.1/transaction/coin/withdrawal\", map[string]interface{}{\n\t\t\"access_token\": accessToken,\n\t\t\"currency\": \"BTC\",\n\t\t\"amount\": \"1.1\",\n\t\t\"address\": \"muQoJGAySUJsn1c9iaj9GQitdVLJhnQVnL\",\n\t\t\"secondary_address\": \"memo\"\n\t})\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(string(response))\n}"
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
  "_id": "68394678760f3c0030350497:68394678760f3c00303504f1"
}
```
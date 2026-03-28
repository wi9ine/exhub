# TWAP - 주문 취소

주문 목록을 조회합니다.

> 예시코드는 JavaScript, Python, JAVA에 한해서만 제공합니다.

<br />

## **Request Parameters**

| 필드                 | 설명             | 타입     |
| :----------------- | :------------- | :----- |
| algo\_order\_id \* | 취소할 TWAP 주문 ID | String |

<br />

## **Responses**

| 필드                 | 설명             | 타입     |
| :----------------- | :------------- | :----- |
| algo\_order\_id \* | 취소된 TWAP 주문 ID | String |

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
    "/twap": {
      "delete": {
        "summary": "Copy of Copy of 주문 리스트 조회",
        "description": "주문 목록을 조회합니다.",
        "operationId": "get_orders-1-1",
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "description": "Authorization token (JWT)",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "algo_order_id",
            "in": "query",
            "description": "취소할 TWAP 주문 ID",
            "schema": {
              "type": "string"
            },
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "200",
            "content": {
              "application/json": {
                "examples": {
                  "Result": {
                    "value": {
                      "algo_order_id": "TWAP-A01B02C03D04E05F06"
                    }
                  }
                },
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "algo_order_id": {
                        "type": "string",
                        "example": "C0101000000001799625",
                        "description": "취소된 TWAP 주문 ID"
                      }
                    },
                    "required": [
                      "algo_order_id"
                    ]
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
                    "value": "{\n  \"error\": {\n    \"name\": \"error name\",\n    \"message\": \"error message\"\n  }\n}"
                  }
                },
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": {
                      "type": "object",
                      "properties": {
                        "name": {
                          "type": "string",
                          "example": "error name"
                        },
                        "message": {
                          "type": "string",
                          "example": "error message"
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
              "language": "javascript",
              "code": "const jwt = require('jsonwebtoken');\nconst { v4: uuidv4 } = require('uuid');\nconst crypto = require('crypto');\nconst querystring = require('querystring');\nconst axios = require('axios');\n\n// --- 인증 정보 설정 ---\nconst accessKey = '발급받은 API KEY';   // 실제 발급받은 Access Key로 변경\nconst secretKey = '발급받은 SECRET KEY'; // 실제 발급받은 Secret Key로 변경\nconst apiUrl = 'https://api.bithumb.com';\nconst twapCancelEndpoint = '/v1/twap';\n\n// --- 1. TWAP 주문 취소 파라미터 설정 (명세 반영) ---\nconst twapCancelParams = {\n    algo_order_id: 'TWAP-A01B02C03D04E05F06' // 취소할 실제 TWAP 주문 ID로 변경\n};\n\n// --- 2. JWT 토큰 생성 ---\n// DELETE 요청이지만, 파라미터를 쿼리 문자열로 인코딩하여 해시 생성\nconst query = querystring.encode(twapCancelParams);\nconst alg = 'SHA512';\nconst hash = crypto.createHash(alg);\nconst queryHash = hash.update(query, 'utf-8').digest('hex');\n\n// 페이로드 구성\nconst payload = {\n    access_key: accessKey,\n    nonce: uuidv4(),\n    timestamp: Date.now(),\n    query_hash: queryHash,\n    query_hash_alg: alg\n};\n\n// Secret Key로 서명하여 JWT 토큰 생성\nconst jwtToken = jwt.sign(payload, secretKey);\n\n// --- 3. HTTP 요청 설정 ---\nconst config = {\n    headers: {\n        Authorization: `Bearer ${jwtToken}`\n        // DELETE 요청은 Body가 없으므로 Content-Type은 필수가 아닐 수 있습니다.\n    },\n    // axios.delete에서 params를 사용하면 쿼리 문자열을 자동으로 URL에 추가합니다.\n    params: twapCancelParams\n};\n\n// --- 4. API 호출 (DELETE 메서드 사용) ---\naxios.delete(apiUrl + twapCancelEndpoint, config)\n    .then((response) => {\n        // 성공 응답 처리 (Response 명세: algo_order_id)\n        console.log('--- TWAP 주문 취소 요청 성공 ---');\n        console.log('상태 코드: ', response.status);\n        console.log('응답 데이터: ', response.data);\n        \n        if (response.data && response.data.algo_order_id) {\n             console.log('취소된 TWAP 주문 ID: ', response.data.algo_order_id);\n        }\n    })\n    .catch((error) => {\n        // 실패 응답 처리\n        console.error('--- TWAP 주문 취소 요청 실패 ---');\n        console.error('상태 코드:', error.response.status);\n        console.error('에러 데이터:', error.response.data);\n    });"
            },
            {
              "language": "python",
              "code": "# Python 3\n# pip3 install pyjwt requests\nimport jwt \nimport uuid\nimport hashlib\nimport time\nfrom urllib.parse import urlencode\nimport requests\nimport json\n\n# --- 인증 정보 설정 ---\naccessKey = '발급받은 API KEY'  # 실제 발급받은 Access Key로 변경\nsecretKey = '발급받은 SECRET KEY' # 실제 발급받은 Secret Key로 변경\napiUrl = 'https://api.bithumb.com'\ntwapCancelEndpoint = '/v1/twap' # TWAP 주문 취소 엔드포인트\n\n# --- 1. TWAP 주문 취소 파라미터 설정 (명세 반영) ---\n# algo_order_id를 사용하여 취소할 주문 ID 지정\nparam = dict(\n    algo_order_id='TWAP-A01B02C03D04E05F06'  # 취소할 실제 TWAP 주문 ID로 변경\n)\n\n# --- 2. JWT 토큰 생성 ---\n# DELETE 요청이지만, 파라미터는 쿼리 문자열 형태로 인코딩하여 해시 생성\nquery = urlencode(param).encode('utf-8')\nhash_obj = hashlib.sha512()\nhash_obj.update(query)\nquery_hash = hash_obj.hexdigest()\n\n# 페이로드 구성\npayload = {\n    'access_key': accessKey,\n    'nonce': str(uuid.uuid4()),\n    'timestamp': round(time.time() * 1000), \n    'query_hash': query_hash,\n    'query_hash_alg': 'SHA512',\n}    \n# Secret Key로 서명하여 JWT 토큰 생성\njwt_token = jwt.encode(payload, secretKey, algorithm='HS512')\nauthorization_token = 'Bearer {}'.format(jwt_token)\n\n# 헤더 설정\nheaders = {\n    'Authorization': authorization_token\n    # DELETE 요청이므로 Content-Type은 필수가 아닙니다.\n}\n\ntry:\n    # --- 3. API 호출 (DELETE 메서드 및 TWAP 엔드포인트 사용) ---\n    # requests.delete의 params 인자는 쿼리 문자열로 URL에 자동 추가됩니다.\n    response = requests.delete(\n        apiUrl + twapCancelEndpoint, \n        params=param, \n        headers=headers\n    )\n    \n    # 응답 처리\n    print('--- TWAP 주문 취소 요청 결과 ---')\n    print('상태 코드:', response.status_code)\n    \n    response_data = response.json()\n    print('데이터:', response_data)\n    \n    # Response 명세: algo_order_id 추출\n    if response.status_code == 200 and 'algo_order_id' in response_data:\n        print(f\"취소된 TWAP 주문 ID: {response_data.get('algo_order_id')}\")\n\nexcept Exception as err:\n    # 예외 처리\n    print('--- TWAP 주문 취소 요청 중 오류 발생 ---')\n    print(err)"
            },
            {
              "language": "java",
              "code": "package com.example.sample;\n\n// https://mvnrepository.com/artifact/com.auth0/java-jwt\nimport com.auth0.jwt.JWT;\nimport com.auth0.jwt.algorithms.Algorithm;\n// https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient\nimport org.apache.http.NameValuePair;\nimport org.apache.http.client.methods.CloseableHttpResponse;\nimport org.apache.http.client.methods.HttpDelete; // HttpDelete 사용\nimport org.apache.http.client.utils.URLEncodedUtils;\nimport org.apache.http.impl.client.CloseableHttpClient;\nimport org.apache.http.impl.client.HttpClients;\nimport org.apache.http.message.BasicNameValuePair;\nimport org.apache.http.util.EntityUtils;\n\nimport java.io.IOException;\nimport java.math.BigInteger;\nimport java.nio.charset.StandardCharsets;\nimport java.security.MessageDigest;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.UUID;\n\npublic class TwapOrderCancelClient {\n\n    public static void main(String[] args) throws NoSuchAlgorithmException, IOException {\n        String accessKey = \"발급받은 API KEY\";   // 실제 발급받은 Access Key로 변경\n        String secretKey = \"발급받은 SECRET KEY\"; // 실제 발급받은 Secret Key로 변경\n        String apiUrl = \"https://api.bithumb.com\";\n        String twapCancelEndpoint = \"/v1/twap\"; // TWAP 주문 취소 엔드포인트\n\n        // --- 1. TWAP 주문 취소 파라미터 설정 (명세 반영) ---\n        List<NameValuePair> queryParams = new ArrayList<>();\n        // 'uuid' 대신 'algo_order_id' 사용\n        queryParams.add(new BasicNameValuePair(\"algo_order_id\", \"TWAP-A01B02C03D04E05F06\")); // 취소할 실제 TWAP 주문 ID로 변경\n\n        // --- 2. JWT 토큰 생성 ---\n        // 쿼리 문자열 인코딩 (서명에 사용)\n        String query = URLEncodedUtils.format(queryParams, StandardCharsets.UTF_8);\n        \n        // SHA-512 해시 생성\n        MessageDigest md = MessageDigest.getInstance(\"SHA-512\");\n        md.update(query.getBytes(StandardCharsets.UTF_8));\n        String queryHash = String.format(\"%0128x\", new BigInteger(1, md.digest()));\n        \n        // JWT 페이로드 및 토큰 생성\n        Algorithm algorithm = Algorithm.HMAC256(secretKey);\n        String jwtToken = JWT.create()\n                .withClaim(\"access_key\", accessKey)\n                .withClaim(\"nonce\", UUID.randomUUID().toString())\n                .withClaim(\"timestamp\", System.currentTimeMillis())\n                .withClaim(\"query_hash\", queryHash)\n                .withClaim(\"query_hash_alg\", \"SHA512\")\n                .sign(algorithm);\n        String authenticationToken = \"Bearer \" + jwtToken;\n\n        // --- 3. API 호출 (DELETE 메서드 및 TWAP 엔드포인트 사용) ---\n        // DELETE 요청 시 파라미터를 쿼리 문자열로 URL에 추가\n        final HttpDelete httpDeleteRequest = new HttpDelete(apiUrl + twapCancelEndpoint + \"?\" + query);\n        httpDeleteRequest.addHeader(\"Authorization\", authenticationToken);\n        // DELETE 요청은 Body가 없으므로 Content-Type 헤더는 필수가 아닐 수 있습니다.\n\n        try (CloseableHttpClient client = HttpClients.createDefault();\n             CloseableHttpResponse response = client.execute(httpDeleteRequest)) {\n            \n            // 응답 처리\n            int httpStatus = response.getStatusLine().getStatusCode();\n            String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);\n            \n            System.out.println(\"--- TWAP 주문 취소 요청 결과 ---\");\n            System.out.println(\"상태 코드: \" + httpStatus);\n            System.out.println(\"응답 본문: \" + responseBody);\n            \n            // 응답에 algo_order_id가 포함되어 있는지 확인 (JSON 파싱 로직 추가 필요)\n            // if (httpStatus == 200) { ... }\n            \n        } catch (IOException | RuntimeException e) {\n            throw new RuntimeException(\"API 요청 처리 중 예외 발생\", e);\n        }\n    }\n}"
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
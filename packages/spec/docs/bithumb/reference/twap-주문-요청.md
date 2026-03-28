# TWAP - 주문하기

주문 목록을 조회합니다.

> 예시코드는 JavaScript, Python, JAVA에 한해서만 제공합니다.

<br />

## **Request Parameters**

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        필드
      </th>

      <th>
        설명
      </th>

      <th>
        타입
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        market \*
      </td>

      <td>
        마켓 ID(ex.KRW-BTC)
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        side \*
      </td>

      <td>
        주문 종류\
        `- bid : 매수`\
        `- ask : 매도`
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        volume
      </td>

      <td>
        주문량 (매도 시 필수)
      </td>

      <td>
        NumberString
      </td>
    </tr>

    <tr>
      <td>
        price
      </td>

      <td>
        주문 가격. (매수 시 필수)
      </td>

      <td>
        NumberString
      </td>
    </tr>

    <tr>
      <td>
        duration \*
      </td>

      <td>
        주문 시간 (twap 주문이 진행되는 시간) - 초\
        `- Min 300, Max 43200`
      </td>

      <td>
        NumberString
      </td>
    </tr>

    <tr>
      <td>
        frequency\*
      </td>

      <td>
        주문 간격 - 초\
        `- 5, 15, 20, 30, 60, 120 값 중에 하나 입력 가능`
      </td>

      <td>
        NumberString
      </td>
    </tr>
  </tbody>
</Table>

<br />

## **Responses**

| 필드                 | 설명         | 타입     |
| :----------------- | :--------- | :----- |
| algo\_order\_id \* | TWAP 주문 ID | String |

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
      "post": {
        "summary": "Copy of Copy of Copy of 주문 리스트 조회",
        "description": "주문 목록을 조회합니다.",
        "operationId": "get_orders-1-1-1",
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
            "name": "market",
            "in": "query",
            "description": "Market ID",
            "schema": {
              "type": "string"
            },
            "required": true
          },
          {
            "name": "side",
            "in": "query",
            "description": "주문 종류 (bid 매수, ask 매도)",
            "schema": {
              "type": "string"
            },
            "required": true
          },
          {
            "name": "volume",
            "in": "query",
            "description": "주문 수량 (매도시 필수)",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "price",
            "in": "query",
            "description": "주문 가격 (매수시 필수)",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "duration",
            "in": "query",
            "description": "주문 시간 (twap 주문이 진행되는 시간) - 초",
            "schema": {
              "type": "string",
              "default": ""
            },
            "required": true
          },
          {
            "name": "frequency",
            "in": "query",
            "description": "주문 간격 - 초",
            "schema": {
              "type": "string",
              "default": ""
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
                        "description": "TWAP 주문 ID"
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
              "code": "const jwt = require('jsonwebtoken');\nconst { v4: uuidv4 } = require('uuid');\nconst crypto = require('crypto');\nconst querystring = require('querystring');\nconst axios = require('axios');\n\n// --- 인증 정보 설정 ---\nconst accessKey = '발급받은 API KEY';   // 실제 발급받은 Access Key로 변경\nconst secretKey = '발급받은 SECRET KEY'; // 실제 발급받은 Secret Key로 변경\nconst apiUrl = 'https://api.bithumb.com';\nconst twapEndpoint = '/v1/twap'; // TWAP 주문 엔드포인트\n\n// --- 1. TWAP 주문 파라미터 설정 (명세 반영) ---\n// *market, *side, *duration, *frequency 는 필수 필드입니다.\nconst twapRequestBody = {\n    // 필수 필드\n    market: 'KRW-BTC', // 마켓 ID\n    side: 'bid',       // 주문 종류 (매수: bid, 매도: ask)\n    duration: '3600',  // 주문 시간 (총 3600초 = 1시간)\n    frequency: '60',   // 주문 간격 (60초마다 분할 주문)\n\n    // 조건부 필수 필드 (매수 시 price, 매도 시 volume 필수)\n    volume: '0.5',     // 총 주문량 (0.5 BTC)\n    price: '100000000' // 주문 가격 (1억 원)\n};\n\n// --- 2. JWT 토큰 생성 ---\n// JWT 토큰 생성을 위한 쿼리 문자열 인코딩 및 SHA512 해시 생성\nconst query = querystring.encode(twapRequestBody);\nconst alg = 'SHA512';\nconst hash = crypto.createHash(alg);\nconst queryHash = hash.update(query, 'utf-8').digest('hex');\n\n// 페이로드 구성\nconst payload = {\n    access_key: accessKey,\n    nonce: uuidv4(),\n    timestamp: Date.now(),\n    query_hash: queryHash,\n    query_hash_alg: alg\n};\n\n// Secret Key로 서명하여 JWT 토큰 생성\nconst jwtToken = jwt.sign(payload, secretKey);\n\n// --- 3. HTTP 요청 설정 ---\nconst config = {\n    headers: {\n        Authorization: `Bearer ${jwtToken}`, // 생성된 JWT 토큰 사용\n        'Content-Type': 'application/json'\n    }\n};\n\n// --- 4. API 호출 ---\naxios.post(apiUrl + twapEndpoint, twapRequestBody, config)\n    .then((response) => {\n        // 성공 응답 처리 (Response 명세: algo_order_id)\n        console.log('--- TWAP 주문 요청 성공 ---');\n        console.log('상태 코드: ', response.status);\n        console.log('응답 데이터: ', response.data);\n        \n        // Response에서 TWAP 주문 ID 추출\n        if (response.data && response.data.algo_order_id) {\n             console.log('TWAP 주문 ID (algo_order_id): ', response.data.algo_order_id);\n        }\n    })\n    .catch((error) => {\n        // 실패 응답 처리\n        console.error('--- TWAP 주문 요청 실패 ---');\n        console.error('상태 코드:', error.response.status);\n        console.error('에러 데이터:', error.response.data);\n    });"
            },
            {
              "language": "python",
              "code": "# Python 3\n# pip3 install pyjwt requests\nimport jwt \nimport uuid\nimport hashlib\nimport time\nfrom urllib.parse import urlencode\nimport requests\nimport json\n\n# --- 인증 정보 설정 ---\naccessKey = '발급받은 API KEY'  # 실제 발급받은 Access Key로 변경\nsecretKey = '발급받은 SECRET KEY' # 실제 발급받은 Secret Key로 변경\napiUrl = 'https://api.bithumb.com'\ntwapEndpoint = '/v1/twap' # TWAP 주문 엔드포인트\n\n# --- 1. TWAP 주문 파라미터 설정 (명세 반영) ---\n# TWAP 주문은 market, side, duration, frequency가 필수입니다.\n# 매수(bid) 시 price 필수, 매도(ask) 시 volume 필수\nrequestBody = dict(\n    market='KRW-BTC',\n    side='bid',\n    volume='0.5',          # 총 주문량 (String 타입으로 전달)\n    price='100000000',    # 주문 가격 (String 타입으로 전달)\n    duration='3600',      # TWAP 주문이 진행되는 총 시간 (초 단위)\n    frequency='60'        # 주문이 분할되어 제출될 간격 (초 단위)\n)\n\n# --- 2. JWT 토큰 생성 ---\n# JWT 토큰 생성을 위해 쿼리 문자열 인코딩 및 SHA512 해시 생성\n# 주의: requests.post에 data=json.dumps()를 사용하더라도, JWT 서명 시에는 \n#       쿼리 문자열(URL-encoded form data) 기반으로 해시를 생성해야 합니다.\nquery = urlencode(requestBody).encode('utf-8')\nhash_obj = hashlib.sha512()\nhash_obj.update(query)\nquery_hash = hash_obj.hexdigest()\n\n# 페이로드 구성\npayload = {\n    'access_key': accessKey,\n    'nonce': str(uuid.uuid4()),\n    'timestamp': round(time.time() * 1000), \n    'query_hash': query_hash,\n    'query_hash_alg': 'SHA512',\n}    \n# Secret Key로 서명하여 JWT 토큰 생성\njwt_token = jwt.encode(payload, secretKey, algorithm='HS512') # HS512 알고리즘 명시\nauthorization_token = 'Bearer {}'.format(jwt_token)\n\n# 헤더 설정\nheaders = {\n    'Authorization': authorization_token,\n    'Content-Type': 'application/json' # 요청 본문 타입은 JSON\n}\n\ntry:\n    # --- 3. API 호출 (TWAP 엔드포인트 사용) ---\n    # TWAP 주문은 JSON 본문을 사용합니다.\n    response = requests.post(\n        apiUrl + twapEndpoint, \n        data=json.dumps(requestBody), \n        headers=headers\n    )\n    \n    # 응답 처리\n    print('--- TWAP 주문 요청 결과 ---')\n    print('상태 코드:', response.status_code)\n    \n    response_data = response.json()\n    print('데이터:', response_data)\n    \n    # Response 명세: algo_order_id 추출\n    if response.status_code == 200 and 'algo_order_id' in response_data:\n        print(f\"TWAP 주문 ID (algo_order_id): {response_data['algo_order_id']}\")\n\nexcept Exception as err:\n    # 예외 처리\n    print('--- TWAP 주문 요청 중 오류 발생 ---')\n    print(err)"
            },
            {
              "language": "java",
              "code": "package com.example.sample;\n\n// https://mvnrepository.com/artifact/com.auth0/java-jwt\nimport com.auth0.jwt.JWT;\nimport com.auth0.jwt.algorithms.Algorithm;\n// https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient\nimport org.apache.http.client.methods.CloseableHttpResponse;\nimport org.apache.http.client.methods.HttpPost;\nimport org.apache.http.client.utils.URLEncodedUtils;\nimport org.apache.http.entity.StringEntity;\nimport org.apache.http.impl.client.CloseableHttpClient;\nimport org.apache.http.impl.client.HttpClients;\nimport org.apache.http.message.BasicNameValuePair;\nimport org.apache.http.util.EntityUtils;\n// https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\nimport java.io.IOException;\nimport java.math.BigInteger;\nimport java.nio.charset.StandardCharsets;\nimport java.security.MessageDigest;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.LinkedHashMap;\nimport java.util.List;\nimport java.util.Map;\nimport java.util.UUID;\nimport java.util.stream.Collectors;\n\npublic class TwapOrderClient {\n\n    public static void main(String[] args) throws NoSuchAlgorithmException, IOException {\n        String accessKey = \"발급받은 API KEY\";   // 실제 발급받은 Access Key로 변경\n        String secretKey = \"발급받은 SECRET KEY\"; // 실제 발급받은 Secret Key로 변경\n        String apiUrl = \"https://api.bithumb.com\";\n        String twapEndpoint = \"/v1/twap\"; // TWAP 주문 엔드포인트\n\n        // --- 1. TWAP 주문 파라미터 설정 (명세 반영) ---\n        // 모든 NumberString 타입 필드는 String으로 전달되도록 Map에 String 값을 사용합니다.\n        Map<String, String> requestBody = new LinkedHashMap<>();\n        requestBody.put(\"market\", \"KRW-BTC\");\n        requestBody.put(\"side\", \"bid\");\n        requestBody.put(\"volume\", \"0.5\");       // 총 주문량 (NumberString)\n        requestBody.put(\"price\", \"100000000\");  // 주문 가격 (NumberString)\n        requestBody.put(\"duration\", \"3600\");    // TWAP 주문 총 시간 (필수, NumberString)\n        requestBody.put(\"frequency\", \"60\");     // TWAP 주문 간격 (필수, NumberString)\n\n        // --- 2. JWT 토큰 생성 ---\n        // 쿼리 파라미터 생성 (JWT 서명은 쿼리 문자열 기반으로 해시를 생성해야 함)\n        List<BasicNameValuePair> queryParams = requestBody.entrySet().stream()\n                .map(entry -> new BasicNameValuePair(entry.getKey(), entry.getValue()))\n                .collect(Collectors.toList());\n\n        String query = URLEncodedUtils.format(queryParams, StandardCharsets.UTF_8);\n        \n        // SHA-512 해시 생성\n        MessageDigest md = MessageDigest.getInstance(\"SHA-512\");\n        md.update(query.getBytes(StandardCharsets.UTF_8));\n        String queryHash = String.format(\"%0128x\", new BigInteger(1, md.digest()));\n        \n        // JWT 알고리즘 설정 (Bithumb은 HMAC256이 아니라 HMAC512로 알고리즘을 사용하기도 함. \n        // 여기서는 예시와 같이 HMAC256을 사용하되, 실제 거래소 문서를 확인해야 합니다.)\n        Algorithm algorithm = Algorithm.HMAC256(secretKey); \n        \n        // JWT 페이로드 및 토큰 생성\n        String jwtToken = JWT.create()\n                .withClaim(\"access_key\", accessKey)\n                .withClaim(\"nonce\", UUID.randomUUID().toString())\n                .withClaim(\"timestamp\", System.currentTimeMillis())\n                .withClaim(\"query_hash\", queryHash)\n                .withClaim(\"query_hash_alg\", \"SHA512\")\n                .sign(algorithm);\n        String authenticationToken = \"Bearer \" + jwtToken;\n\n        // --- 3. API 호출 (TWAP 엔드포인트 사용) ---\n        final HttpPost httpRequest = new HttpPost(apiUrl + twapEndpoint);\n        httpRequest.addHeader(\"Authorization\", authenticationToken);\n        httpRequest.addHeader(\"Content-type\", \"application/json\");\n\n        // 요청 본문 (requestBody)은 JSON 형태로 변환하여 엔티티에 설정\n        String jsonBody = new ObjectMapper().writeValueAsString(requestBody);\n        httpRequest.setEntity(new StringEntity(jsonBody, StandardCharsets.UTF_8));\n\n        try (CloseableHttpClient client = HttpClients.createDefault();\n             CloseableHttpResponse response = client.execute(httpRequest)) {\n            \n            // 응답 처리\n            int httpStatus = response.getStatusLine().getStatusCode();\n            String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);\n            \n            System.out.println(\"--- TWAP 주문 요청 결과 ---\");\n            System.out.println(\"상태 코드: \" + httpStatus);\n            System.out.println(\"응답 본문: \" + responseBody);\n            \n            // Response 명세: algo_order_id 추출 (Jackson ObjectMapper 사용 가정)\n            if (httpStatus >= 200 && httpStatus < 300) {\n                 ObjectMapper mapper = new ObjectMapper();\n                 Map<String, Object> responseMap = mapper.readValue(responseBody, Map.class);\n                 String algoOrderId = (String) responseMap.get(\"algo_order_id\");\n                 if (algoOrderId != null) {\n                     System.out.println(\"TWAP 주문 ID (algo_order_id): \" + algoOrderId);\n                 }\n            }\n        } catch (Exception e) {\n            throw new RuntimeException(\"API 요청 중 예외 발생\", e);\n        }\n    }\n}"
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
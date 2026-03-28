# TWAP - 주문 내역 조회

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
        market
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
        uuids
      </td>

      <td>
        TWAP 주문 ID 목록
      </td>

      <td>
        Array
      </td>
    </tr>

    <tr>
      <td>
        state
      </td>

      <td>
        TWAP 주문 상태\
        `- progress : 진행중 (default)`\
        `- done : 주문 완료`\
        `- cancel : 취소`
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        next\_key
      </td>

      <td>
        다음 페이지 조회를 위한 커서 값
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        limit
      </td>

      <td>
        개수 제한 (default: 100, limit: 100)
      </td>

      <td>
        Number
      </td>
    </tr>

    <tr>
      <td>
        order\_by
      </td>

      <td>
        정렬방식\
        `- asc : 오름차순`\
        `- desc : 내림차순 (default)`
      </td>

      <td>
        String
      </td>
    </tr>
  </tbody>
</Table>

<br />

## **Responses**

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
        has\_next
      </td>

      <td>
        다음 페이지 존재 여부
      </td>

      <td>
        Boolean
      </td>
    </tr>

    <tr>
      <td>
        next\_key
      </td>

      <td>
        다음 페이지 조회를 위한 커서 값 (`Base64 인코딩된 문자열`).\
        `- hasNext 가 false 면 null`
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        uuid
      </td>

      <td>
        TWAP 주문 ID\
        `- algo_order_id 와 동일`
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        side
      </td>

      <td>
        주문 종류
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        price
      </td>

      <td>
        주문 당시 화폐 가격
      </td>

      <td>
        NumberString
      </td>
    </tr>

    <tr>
      <td>
        state
      </td>

      <td>
        TWAP 주문 상태\
        `- progress : 진행중 (default)`\
        `- done : 주문 완료`\
        `- cancel : 취소`
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        market
      </td>

      <td>
        마켓의 유일키
      </td>

      <td>
        String
      </td>
    </tr>

    <tr>
      <td>
        created\_at
      </td>

      <td>
        주문 생성 시간
      </td>

      <td>
        DateString
      </td>
    </tr>

    <tr>
      <td>
        volume
      </td>

      <td>
        사용자가 입력한 주문 양
      </td>

      <td>
        NumberString
      </td>
    </tr>

    <tr>
      <td>
        finished\_at
      </td>

      <td>
        주문 종료 시간\
        `- done 상태일 시 완료시간 노출`\
        `- cancel 상태일 시 미노출`
      </td>

      <td>
        DateString
      </td>
    </tr>

    <tr>
      <td>
        total\_order\_count
      </td>

      <td>
        주문 전체 건수
      </td>

      <td>
        Number
      </td>
    </tr>

    <tr>
      <td>
        total\_trades\_count
      </td>

      <td>
        주문에 걸린 전체 체결 수
      </td>

      <td>
        Number
      </td>
    </tr>

    <tr>
      <td>
        progress\_count
      </td>

      <td>
        주문 진행 건수
      </td>

      <td>
        Number
      </td>
    </tr>

    <tr>
      <td>
        total\_executed\_amount
      </td>

      <td>
        주문 총 체결 금액
      </td>

      <td>
        NumberString
      </td>
    </tr>

    <tr>
      <td>
        total\_executed\_volume
      </td>

      <td>
        주문 총 체결 수량
      </td>

      <td>
        NumberString
      </td>
    </tr>

    <tr>
      <td>
        avg\_trade\_price
      </td>

      <td>
        주문 평균 체결 단가
      </td>

      <td>
        NumberString
      </td>
    </tr>

    <tr>
      <td>
        canceled\_at
      </td>

      <td>
        주문 취소 시간\
        `- done 상태일 시 미노출`\
        `- cancel 상태일 시 취소시간 노출`
      </td>

      <td>
        DateString
      </td>
    </tr>

    <tr>
      <td>
        cancel\_type
      </td>

      <td>
        주문 취소 타입\
        `- user : 사용자 취소`\
        `- asset : 자산 부족`\
        `- admin : 관리자 취소`\
        `- system : 시스템 취소`
      </td>

      <td>
        String
      </td>
    </tr>
  </tbody>
</Table>

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
      "get": {
        "summary": "Copy of 주문 리스트 조회",
        "description": "주문 목록을 조회합니다.",
        "operationId": "get_orders-1",
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
            "description": "마켓 ID",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "uuids",
            "in": "query",
            "description": "TWAP 주문 ID 목록",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "state",
            "in": "query",
            "description": "주문 상태",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "next_key",
            "in": "query",
            "description": "다음 페이지 조회를 위한 커서 값",
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "개수 제한",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 100
            }
          },
          {
            "name": "order_by",
            "in": "query",
            "description": "정렬방식",
            "schema": {
              "type": "integer",
              "default": "desc",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200",
            "content": {
              "application/json": {
                "examples": {
                  "Result": {
                    "value": "{\n  \"has_next\": true,\n  \"next_key\": \"NDMyMjM2fEdCRVQtS1JXfDYyNDc3YjYxLWEwZjItNDY1OC04ZGVhLTFkMjQyYjIxZGFmZQ==\",\n  \"data\": [\n    {\n      \"uuid\": \"TWAP-001-PROGRESS-BID\",\n      \"side\": \"bid\",\n      \"price\": \"92500000\",\n      \"state\": \"progress\",\n      \"market\": \"KRW-BTC\",\n      \"created_at\": \"2025-12-04T10:00:00+09:00\",\n      \"volume\": \"1.0\",\n      \"total_order_count\": 60,\n      \"total_trades_count\": 10,\n      \"progress_count\": 25,\n      \"total_executed_amount\": \"2312500000\",\n      \"total_executed_volume\": \"0.25\",\n      \"avg_trade_price\": \"92500000.000\",\n    },\n    {\n      \"uuid\": \"TWAP-002-CANCEL-ASK\",\n      \"side\": \"ask\",\n      \"price\": \"5000\",\n      \"state\": \"cancel\",\n      \"market\": \"KRW-XRP\",\n      \"created_at\": \"2025-12-03T09:00:00+09:00\",\n      \"volume\": \"1000\",\n      \"total_order_count\": 120,\n      \"total_trades_count\": 5,\n      \"progress_count\": 15,\n      \"total_executed_amount\": \"25000000\",\n      \"total_executed_volume\": \"5000\",\n      \"avg_trade_price\": \"5000.0\",\n      \"canceled_at\": \"2025-12-03T09:15:00+09:00\",\n      \"cancel_type\": \"user\"\n    }\n  ]\n}"
                  }
                },
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "has_next": {
                        "type": "boolean",
                        "description": "다음 페이지 존재 여부"
                      },
                      "next_key": {
                        "type": "string",
                        "description": "다음 페이지 조회를 위한 커서 값"
                      },
                      "uuid": {
                        "type": "string",
                        "example": "C0101000000001799625",
                        "description": "TWAP 주문 ID"
                      },
                      "side": {
                        "type": "string",
                        "example": "ask",
                        "description": "주문 종류"
                      },
                      "price": {
                        "type": "string",
                        "example": "84001000",
                        "description": "주문 당시 화폐 가격"
                      },
                      "state": {
                        "type": "string",
                        "example": "wait",
                        "description": "주문 상태"
                      },
                      "market": {
                        "type": "string",
                        "example": "KRW-BTC",
                        "description": "마켓의 유일키"
                      },
                      "created_at": {
                        "type": "string",
                        "example": "2024-07-12T16:30:01+09:00",
                        "description": "주문 생성 시간",
                        "format": "date"
                      },
                      "volume": {
                        "type": "string",
                        "example": "0.2",
                        "description": "사용자가 입력한 주문 양"
                      },
                      "finished_at": {
                        "type": "string",
                        "example": "limit",
                        "format": "date",
                        "description": "주문 종료 시간"
                      },
                      "total_order_count": {
                        "type": "number",
                        "example": "0.2",
                        "description": "주문 전체 건수"
                      },
                      "total_trades_count": {
                        "type": "number",
                        "example": "0",
                        "description": "주문에 걸린 전체 체결 수"
                      },
                      "progress_count": {
                        "type": "number",
                        "example": "0",
                        "description": "주문 진행 건수 "
                      },
                      "total_executed_amount": {
                        "type": "string",
                        "example": "0",
                        "description": "주문 총 체결 금액"
                      },
                      "total_executed_volume": {
                        "type": "string",
                        "example": "0.2",
                        "description": "주문 총 체결 수량"
                      },
                      "avg_trade_price": {
                        "type": "string",
                        "example": "0",
                        "description": "주문 평균 체결 단가"
                      },
                      "canceled_at": {
                        "type": "string",
                        "example": 0,
                        "default": 0,
                        "description": "주문 취소 시간 ",
                        "format": "date"
                      },
                      "cancel_type": {
                        "type": "string",
                        "description": "주문 취소 타입"
                      }
                    }
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
              "code": "const jwt = require('jsonwebtoken');\nconst { v4: uuidv4 } = require('uuid');\nconst crypto = require('crypto');\nconst querystring = require('querystring');\nconst axios = require('axios');\n\n// --- 인증 정보 설정 ---\nconst accessKey = '발급받은 API KEY';   // 실제 발급받은 Access Key로 변경\nconst secretKey = '발급받은 SECRET KEY'; // 실제 발급받은 Secret Key로 변경\nconst apiUrl = 'https://api.bithumb.com';\nconst twapQueryEndpoint = '/v1/twap';\n\n// --- 1. TWAP 주문내역 조회 파라미터 설정 (명세 반영) ---\n\n// 쿼리 파라미터 객체 정의 (uuids는 별도로 처리)\nconst twapParams = {\n    market: 'KRW-BTC',      // 마켓 ID\n    state: 'progress',      // 주문 상태: 진행중 (progress), 완료 (done), 취소 (cancel)\n    limit: 50,              // 개수 제한 (최대 100)\n    order_by: 'desc',       // 정렬방식 (desc: 내림차순, asc: 오름차순)\n    // next_key: '커서_값'  // 다음 페이지 조회를 위한 커서 값 (필요 시 주석 해제)\n};\n\n// TWAP 주문 ID 목록 (uuids)\nconst uuids = [\n    'TWAP-A01B02C03D04E05F06', \n    'TWAP-002-DONE'\n];\n\n// 기본 쿼리 문자열 생성 (uuids 제외)\nlet query = querystring.encode(twapParams);\n\n// uuids 배열을 'uuids[]=' 형태로 쿼리 문자열에 추가 (있을 경우에만)\nconst uuid_query = uuids.map(uuid => `uuids[]=${uuid}`).join('&');\nif (uuid_query) {\n    query = query ? query + \"&\" + uuid_query : uuid_query;\n}\n\n// 최종 쿼리 문자열 예시: market=KRW-BTC&state=progress&limit=50&order_by=desc&uuids[]=TWAP-A01...&uuids[]=TWAP-002...\n\n// --- 2. JWT 토큰 생성 ---\n// GET 요청은 쿼리 문자열을 해시하여 서명에 사용합니다.\nconst alg = 'SHA512';\nconst hash = crypto.createHash(alg);\nconst queryHash = hash.update(query, 'utf-8').digest('hex');\n\n// 페이로드 구성\nconst payload = {\n    access_key: accessKey,\n    nonce: uuidv4(),\n    timestamp: Date.now(),\n    query_hash: queryHash,\n    query_hash_alg: alg\n};\n\n// Secret Key로 서명하여 JWT 토큰 생성\nconst jwtToken = jwt.sign(payload, secretKey);\n\n// --- 3. HTTP 요청 설정 ---\nconst config = {\n    headers: {\n        Authorization: `Bearer ${jwtToken}`\n    }\n};\n\n// --- 4. API 호출 (GET 메서드 사용) ---\naxios.get(apiUrl + twapQueryEndpoint + '?' + query, config)\n    .then((response) => {\n        // 성공 응답 처리\n        console.log('--- TWAP 주문내역 조회 성공 ---');\n        console.log('상태 코드: ', response.status);\n        console.log('응답 데이터: ', response.data);\n\n        if (response.data && response.data.data) {\n             console.log(`조회된 TWAP 주문 건수: ${response.data.data.length}`);\n             console.log(`다음 페이지 존재 여부 (has_next): ${response.data.has_next}`);\n        }\n    })\n    .catch((error) => {\n        // 실패 응답 처리\n        console.error('--- TWAP 주문내역 조회 실패 ---');\n        console.error('상태 코드:', error.response.status);\n        console.error('에러 데이터:', error.response.data);\n    });"
            },
            {
              "language": "python",
              "code": "# Python 3\n# pip3 install pyjwt requests\nimport jwt \nimport uuid\nimport hashlib\nimport time\nfrom urllib.parse import urlencode\nimport requests\nimport json\n\n# --- 인증 정보 설정 ---\naccessKey = '발급받은 API KEY'  # 실제 발급받은 Access Key로 변경\nsecretKey = '발급받은 SECRET KEY' # 실제 발급받은 Secret Key로 변경\napiUrl = 'https://api.bithumb.com'\ntwapQueryEndpoint = '/v1/twap' # TWAP 주문내역 조회 엔드포인트\n\n# --- 1. TWAP 주문내역 조회 파라미터 설정 (명세 반영) ---\n\n# 기본 쿼리 파라미터 설정\nparam = dict(\n    market='KRW-BTC',      # 마켓 ID (예시 변경)\n    state='progress',      # TWAP 주문 상태 (progress, done, cancel)\n    limit=50,              # 개수 제한 (default 100, limit 100)\n    order_by='desc',       # 정렬방식 (desc: 내림차순)\n    # next_key: '커서값'    # 다음 페이지 조회를 위한 커서 (필요 시 주석 해제)\n)\n\n# TWAP 주문 ID 목록 (uuids 필드에 해당)\nuuids = [\n    'TWAP-A01B02C03D04E05F06',  # TWAP 주문 ID 예시\n    'TWAP-002-DONE'            # TWAP 주문 ID 예시\n]\n\n# 쿼리 문자열 인코딩 (param)\nquery = urlencode(param)\n\n# uuids 배열을 'uuids[]=' 형태로 쿼리 문자열에 추가 (명세에 따라 'uuids' 필드로 전달)\nuuid_query = '&'.join([f'uuids[]={uuid}' for uuid in uuids])\nquery = query + \"&\" + uuid_query\n\n# --- 2. JWT 토큰 생성 ---\n# GET 요청의 최종 쿼리 문자열을 해시하여 서명에 사용\nhash_obj = hashlib.sha512()\nhash_obj.update(query.encode('utf-8'))\nquery_hash = hash_obj.hexdigest()\n\n# 페이로드 구성\npayload = {\n    'access_key': accessKey,\n    'nonce': str(uuid.uuid4()),\n    'timestamp': round(time.time() * 1000), \n    'query_hash': query_hash,\n    'query_hash_alg': 'SHA512',\n}    \n# Secret Key로 서명하여 JWT 토큰 생성\njwt_token = jwt.encode(payload, secretKey, algorithm='HS512')\nauthorization_token = 'Bearer {}'.format(jwt_token)\n\n# 헤더 설정\nheaders = {\n    'Authorization': authorization_token\n}\n\ntry:\n    # --- 3. API 호출 (GET 메서드 및 TWAP 엔드포인트 사용) ---\n    response = requests.get(\n        apiUrl + twapQueryEndpoint + '?' + query, \n        headers=headers\n    )\n    \n    # 응답 처리\n    print('--- TWAP 주문내역 조회 요청 결과 ---')\n    print('상태 코드:', response.status_code)\n    \n    response_data = response.json()\n    print('데이터:', response_data)\n    \n    # Response 명세: 데이터 추출\n    if response.status_code == 200 and 'data' in response_data:\n        print(f\"조회된 TWAP 주문 건수: {len(response_data['data'])}\")\n\nexcept Exception as err:\n    # 예외 처리\n    print('--- TWAP 주문내역 조회 중 오류 발생 ---')\n    print(err)"
            },
            {
              "language": "java",
              "code": "package com.example.sample;\n\n// https://mvnrepository.com/artifact/com.auth0/java-jwt\nimport com.auth0.jwt.JWT;\nimport com.auth0.jwt.algorithms.Algorithm;\n// https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient\nimport org.apache.http.NameValuePair;\nimport org.apache.http.client.methods.CloseableHttpResponse;\nimport org.apache.http.client.methods.HttpGet;\nimport org.apache.http.client.utils.URLEncodedUtils;\nimport org.apache.http.impl.client.CloseableHttpClient;\nimport org.apache.http.impl.client.HttpClients;\nimport org.apache.http.message.BasicNameValuePair;\nimport org.apache.http.util.EntityUtils;\n\nimport com.fasterxml.jackson.databind.ObjectMapper; // JSON 파싱을 위해 추가\n\nimport java.io.IOException;\nimport java.math.BigInteger;\nimport java.nio.charset.StandardCharsets;\nimport java.security.MessageDigest;\nimport java.security.NoSuchAlgorithmException;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Map;\nimport java.util.UUID;\nimport java.util.stream.Collectors;\n\npublic class TwapOrderQueryClient {\n\n    public static void main(String[] args) throws NoSuchAlgorithmException, IOException {\n        String accessKey = \"발급받은 API KEY\";   // 실제 발급받은 Access Key로 변경\n        String secretKey = \"발급받은 SECRET KEY\"; // 실제 발급받은 Secret Key로 변경\n        String apiUrl = \"https://api.bithumb.com\";\n        String twapQueryEndpoint = \"/v1/twap\"; // TWAP 주문내역 조회 엔드포인트\n\n        // --- 1. TWAP 주문내역 조회 파라미터 설정 (명세 반영) ---\n        // 기본 파라미터 (map 대신 List<NameValuePair> 사용)\n        List<NameValuePair> queryParams = new ArrayList<>();\n        queryParams.add(new BasicNameValuePair(\"market\", \"KRW-BTC\")); // 마켓 ID\n        queryParams.add(new BasicNameValuePair(\"state\", \"progress\")); // TWAP 주문 상태 (progress, done, cancel)\n        queryParams.add(new BasicNameValuePair(\"limit\", \"50\"));\n        queryParams.add(new BasicNameValuePair(\"order_by\", \"desc\"));\n        // queryParams.add(new BasicNameValuePair(\"next_key\", \"커서값\")); // 페이지네이션 커서\n\n        // TWAP 주문 ID 목록 (uuids)\n        List<String> uuids = new ArrayList<>();\n        uuids.add(\"TWAP-A01B02C03D04E05F06\");\n        uuids.add(\"TWAP-002-DONE\");\n        \n        // uuids 배열을 'uuids[]=' 형태로 쿼리 문자열에 추가\n        // Note: URLEncodedUtils.format은 Map이 아닌 List<NameValuePair>만 처리하므로,\n        // uuids[]는 별도의 문자열로 구성해야 합니다.\n        String uuidQuery = uuids.stream()\n                .map(uuid -> \"uuids[]=\" + uuid)\n                .collect(Collectors.joining(\"&\"));\n        \n        // --- 2. JWT 토큰 생성 ---\n        // 쿼리 문자열 인코딩 및 합치기 (서명에 사용)\n        String baseQuery = URLEncodedUtils.format(queryParams, StandardCharsets.UTF_8);\n        String finalQuery = baseQuery;\n        \n        if (!uuidQuery.isEmpty()) {\n             finalQuery = finalQuery + \"&\" + uuidQuery;\n        }\n\n        // SHA-512 해시 생성\n        MessageDigest md = MessageDigest.getInstance(\"SHA-512\");\n        md.update(finalQuery.getBytes(StandardCharsets.UTF_8));\n        String queryHash = String.format(\"%0128x\", new BigInteger(1, md.digest()));\n        \n        // JWT 페이로드 및 토큰 생성\n        Algorithm algorithm = Algorithm.HMAC256(secretKey);\n        String jwtToken = JWT.create()\n                .withClaim(\"access_key\", accessKey)\n                .withClaim(\"nonce\", UUID.randomUUID().toString())\n                .withClaim(\"timestamp\", System.currentTimeMillis())\n                .withClaim(\"query_hash\", queryHash)\n                .withClaim(\"query_hash_alg\", \"SHA512\")\n                .sign(algorithm);\n        String authenticationToken = \"Bearer \" + jwtToken;\n\n        // --- 3. API 호출 (GET 메서드 및 TWAP 엔드포인트 사용) ---\n        // 최종 쿼리 문자열을 URL에 추가\n        final HttpGet httpRequest = new HttpGet(apiUrl + twapQueryEndpoint + \"?\" + finalQuery);\n        httpRequest.addHeader(\"Authorization\", authenticationToken);\n\n        try (CloseableHttpClient client = HttpClients.createDefault();\n             CloseableHttpResponse response = client.execute(httpRequest)) {\n            \n            // 응답 처리\n            int httpStatus = response.getStatusLine().getStatusCode();\n            String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);\n            \n            System.out.println(\"--- TWAP 주문내역 조회 요청 결과 ---\");\n            System.out.println(\"상태 코드: \" + httpStatus);\n            System.out.println(\"응답 본문: \" + responseBody);\n            \n            if (httpStatus >= 200 && httpStatus < 300) {\n                 ObjectMapper mapper = new ObjectMapper();\n                 Map<String, Object> responseMap = mapper.readValue(responseBody, Map.class);\n                 List<?> dataList = (List<?>) responseMap.get(\"data\");\n                 \n                 if (dataList != null) {\n                     System.out.println(\"조회된 TWAP 주문 건수: \" + dataList.size());\n                 }\n            }\n        } catch (Exception e) {\n            throw new RuntimeException(\"API 요청 처리 중 예외 발생\", e);\n        }\n    }\n}"
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
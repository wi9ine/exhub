# API 키 리스트 조회

API 키 리스트와 만료 일자를 조회합니다.

> 예시코드는 JavaScript, Python, JAVA에 한해서만 제공합니다.

<br />

<li>API는 <a href="https://bithumb.com/react/api-support/management-api" target="_blank">해당페이지</a> 에서 API Key를 발급 받은 후 사용 가능합니다.</li>
<li>API Key 발급 시에는 API 활성 항목과 해당 API Key를 사용할 IP 주소를 등록해야 합니다.</li>
<li>IP 주소는 최대 5개까지 등록 가능하며 등록한 IP 주소로 접속한 경우에만 해당 API Key를 사용할 수 있습니다.</li>
<li>API Key는 계정당 10개까지 발급 받을 수 있으며 API Key 발급이 완료된 이후에는 Secret key를 추가로 확인할 수 없습니다. Secret key는 발급 받은 이후 안전한 곳에 별도 보관해주시기 바랍니다.</li>
<li>발급 받은 API Key는 발급일 기준으로 1년 동안 사용 가능하며 기간 연장은 불가능합니다. 1년 경과 시 해당 API Key는 삭제 후 재발급 받아주시기 바랍니다.</li>
<li>API Key 발급, 수정, 삭제 시에는 2채널 추가 인증이 진행되며, API 활성 항목 변경이 필요한 경우 <a href="https://bithumb.com/react/api-support/management-api" target="_blank">API Key 관리</a>에서 해당 API Key를 삭제한 후 재발급 받아야 합니다.</li>

## **Response**

| 필드          | 설명      | 타입         |
| :---------- | :------ | :--------- |
| access\_key | API KEY | String     |
| expire\_at  | 만료일시    | DateString |

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
    "/api_keys": {
      "get": {
        "summary": "API 키 리스트 조회",
        "description": "API 키 리스트와 만료 일자를 조회합니다.",
        "operationId": "api-키-리스트-조회",
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "description": "Authorization token (JWT)",
            "required": true,
            "schema": {
              "type": "string"
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
                    "value": "[\n  {\n    \"access_key\": \"59683c90185742d69fd8fa1bc0cf27785c392afaa56ece\",\n    \"expire_at\": \"2025-06-11T09:00:00+09:00\"\n  },\n  {\n    \"access_key\": \"3e97926e9b75a6aeb637d2c172a292588502daccfb5cab\",\n    \"expire_at\": \"2025-06-12T09:00:00+09:00\"\n  },\n  {\n    \"access_key\": \"400e5bcb69440e7ace08fd7991340c271683f20dba9a6e\",\n    \"expire_at\": \"2025-06-12T09:00:00+09:00\"\n  }\n]"
                  }
                },
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "access_key": {
                        "type": "string",
                        "example": "59683c90185742d69fd8fa1bc0cf27785c392afaa56ece"
                      },
                      "expire_at": {
                        "type": "string",
                        "example": "2025-06-11T09:00:00+09:00"
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
              "code": "const jwt = require('jsonwebtoken');\nconst { v4: uuidv4 } = require('uuid');\nconst axios = require('axios')\n\nconst accessKey = '발급받은 API KEY'\nconst secretKey = '발급받은 SECRET KEY'\nconst apiUrl = 'https:/api.bithumb.com'\n\n// Generate access token\nconst payload = {\n    access_key: accessKey,\n    nonce: uuidv4(),\n    timestamp: Date.now()\n};\nconst jwtToken = jwt.sign(payload, secretKey)\nconst config = {\n    headers: {\n        Authorization: `Bearer ${jwtToken}`\n    }\n}\n\n// Call API\naxios.get(apiUrl + '/v1/api_keys', config)\n    .then((response) => {\n        // handle to success\n        console.log('status: ', response.status)\n        console.log('data: ', response.data)\n    })\n    .catch((error) => {\n        // handle to fail\n        console.log(error.response.status)\n        console.log(error.response.data)\n    });"
            },
            {
              "language": "python",
              "code": "# Python 3\n# pip3 installl pyJwt\nimport jwt \nimport uuid\nimport time\nimport requests\n\n# Set API parameters\naccessKey = '발급받은 API KEY'\nsecretKey = '발급받은 SECRET KEY'\napiUrl = 'https://api.bithumb.com'\n\n# Generate access token\npayload = {\n    'access_key': accessKey,\n    'nonce': str(uuid.uuid4()),\n    'timestamp': round(time.time() * 1000)\n}\njwt_token = jwt.encode(payload, secretKey)\nauthorization_token = 'Bearer {}'.format(jwt_token)\nheaders = {\n  'Authorization': authorization_token\n}\n\ntry:\n    # Call API\n    response = requests.get(apiUrl + '/v1/api_keys', headers=headers)\n    # handle to success or fail\n    print(response.status_code)\n    print(response.json())\nexcept Exception as err:\n    # handle exception\n    print(err)\n"
            },
            {
              "language": "java",
              "code": "package com.example.sample;\n\n// https://mvnrepository.com/artifact/com.auth0/java-jwt\nimport com.auth0.jwt.JWT;\nimport com.auth0.jwt.algorithms.Algorithm;\n// https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient\nimport org.apache.http.client.methods.CloseableHttpResponse;\nimport org.apache.http.client.methods.HttpGet;\nimport org.apache.http.impl.client.CloseableHttpClient;\nimport org.apache.http.impl.client.HttpClients;\nimport org.apache.http.util.EntityUtils;\n\nimport java.nio.charset.StandardCharsets;\nimport java.util.UUID;\n\npublic class GETNoArgs {\n\n    public static void main(String[] args) {\n        String accessKey = \"발급받은 API KEY\";\n        String secretKey = \"발급받은 SECRET KEY\";\n        String apiUrl = \"https://api.bithumb.com\";\n\n        // Generate access token\n        Algorithm algorithm = Algorithm.HMAC256(secretKey);\n        String jwtToken = JWT.create()\n                .withClaim(\"access_key\", accessKey)\n                .withClaim(\"nonce\", UUID.randomUUID().toString())\n                .withClaim(\"timestamp\", System.currentTimeMillis())\n                .sign(algorithm);\n        String authenticationToken = \"Bearer \" + jwtToken;\n\n        // Call API\n        final HttpGet httpRequest = new HttpGet(apiUrl + \"/v1/api_keys\");\n        httpRequest.addHeader(\"Authorization\", authenticationToken);\n\n        try (CloseableHttpClient client = HttpClients.createDefault();\n             CloseableHttpResponse response = client.execute(httpRequest)) {\n            // handle to response\n            int httpStatus = response.getStatusLine().getStatusCode();\n            String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);\n            System.out.println(httpStatus);\n            System.out.println(responseBody);\n        } catch (Exception e) {\n            throw new RuntimeException(e);\n        }\n    }\n}\n"
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
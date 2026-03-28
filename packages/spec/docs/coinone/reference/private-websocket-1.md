# Private 웹소켓

Private 웹소켓 이용 안내

Private 웹소켓은 인증을 해야만 수신이 가능합니다. 제공하는 데이터는 아래와 같습니다.

* 내 주문 변동 (MYORDER)
* 내 자산 변동 (MYASSET)

## Private 웹소켓 기본 정보

**웹소켓 커넥션**

* URI : wss\://stream.coinone.co.kr/v1/private

**메세지 포맷**

* 코인원 웹소켓을 통해 주고받는 메시지는 JSON 포맷입니다.

**지원하는 거래쌍**

* 거래지원중인 모든 마켓에 대해 지원 합니다.

**제약사항**

* 계정 당 최대 20개의 연결을 허용합니다.
  * 20개의 연결을 초과할 경우 4290 Close Code 와 함께 연결이 자동 종료됩니다.
* 인증과정에 문제가 발생하는 경우 4280 Close Code 와 함께 연결이 자동 종료됩니다.
* request\_type / channel / format 의 값은 대문자로 정확하게 입력되어야 합니다.
* 서버는 마지막 PING 요청 이후 30분이 지났을 경우 유휴연결로 판단해 연결을 종료합니다. 연결종료를 방지하기 위해 PING 요청을 주기적으로 서버에 송신해야 합니다.
* 웹소켓에 업데이트가 있을 경우 기존 연결이 종료될 수 있습니다. 연결이 종료될 경우 재 연결을 할 수 있도록 고려해야 합니다.

***

## Private 웹소켓 연결 방법

```python
import base64
import hashlib
import hmac
import json
import uuid
import asyncio
import websockets
import time
from typing import Dict, Any

ACCESS_TOKEN = '5a3e35e4-0778-4619-a117-7c60740b22a2' # 실제 발급받은 ACCESS_KEY
SECRET_KEY = bytes('9974e540-9451-4898-bdd6-4e6c7872a86a', 'utf-8') # 실제 발급받은 SECRET_KEY

WS_URL = 'wss://stream.coinone.co.kr/v1/private'

def get_encoded_payload(payload: Dict[str, Any]) -> str:
    payload['nonce'] = str(uuid.uuid4())
    payload['timestamp'] = int(time.time() * 1000)  # milliseconds
    
    dumped_json = json.dumps(payload)
    encoded_bytes = base64.b64encode(dumped_json.encode('utf-8'))
    return encoded_bytes.decode('utf-8')

def get_signature(encoded_payload: str) -> str:
    payload_bytes = encoded_payload.encode('utf-8')
    signature = hmac.new(SECRET_KEY, payload_bytes, hashlib.sha512)
    return signature.hexdigest()

async def connect_websocket():
    payload = {
        "access_token": ACCESS_TOKEN
    }

    encoded_payload = get_encoded_payload(payload)
    signature = get_signature(encoded_payload)

    headers = {
        'X-COINONE-PAYLOAD': encoded_payload,
        'X-COINONE-SIGNATURE': signature
    }

    websocket = await websockets.connect(WS_URL, additional_headers=headers)

    if websocket:
        try:
            await asyncio.gather(
                handle_messages(websocket),
                maintain_ping(websocket)
            )
        finally:
            await websocket.close()
```
```kotlin
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.util.Base64
import java.util.UUID
import java.util.concurrent.TimeUnit
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener

class WebSocketClient {
    companion object {
        private const val ACCESS_TOKEN = "5a3e35e4-0778-4619-a117-7c60740b22a2"
        private const val SECRET_KEY = "9974e540-9451-4898-bdd6-4e6c7872a86a"
        private const val WS_URL = "wss://stream.coinone.co.kr/v1/private"

        private val objectMapper = jacksonObjectMapper()
    }

    private lateinit var webSocket: WebSocket
    private val client = OkHttpClient.Builder()
        .pingInterval(30, TimeUnit.SECONDS)
        .build()

    fun getEncodedPayload(payload: MutableMap<String, Any>): String {
        payload["nonce"] = UUID.randomUUID().toString()
        payload["timestamp"] = System.currentTimeMillis()

        val jsonString = objectMapper.writeValueAsString(payload)
        val encodedBytes = Base64.getEncoder().encode(jsonString.toByteArray(Charsets.UTF_8))
        return String(encodedBytes, Charsets.UTF_8)
    }

    fun getSignature(encodedPayload: String): String {
        val keySpec = SecretKeySpec(SECRET_KEY.toByteArray(Charsets.UTF_8), "HmacSHA512")
        val mac = Mac.getInstance("HmacSHA512")
        mac.init(keySpec)

        val payloadBytes = encodedPayload.toByteArray(Charsets.UTF_8)
        val signatureBytes = mac.doFinal(payloadBytes)

        return signatureBytes.joinToString("") { "%02x".format(it) }
    }

    fun connectWebSocket() {
        val payload = mutableMapOf<String, Any>(
            "access_token" to ACCESS_TOKEN
        )

        val encodedPayload = getEncodedPayload(payload)
        val signature = getSignature(encodedPayload)

        val request = Request.Builder()
            .url(WS_URL)
            .header("X-COINONE-PAYLOAD", encodedPayload)
            .header("X-COINONE-SIGNATURE", signature)
            .build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                TODO("subscribe channels")
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                TODO("handle received message")
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                TODO("handle failure")
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                TODO("handle closed session")
            }
        })
    }
}

```

<br />

## Private 웹소켓 요청 방법

### Request

| Fields        | Type                | Description                                           |
| :------------ | :------------------ | :---------------------------------------------------- |
| request\_type | string              | 실행할 요청 종류: SUBSCRIBE / UNSUBSCRIBE / PING             |
| channel       | string \| null      | 구독 채널명:  MYORDER / MYASSET                            |
| topic         | jsonObject  \| null | quote\_currency, target\_currency 등의 정보를 JSON 형식으로 입력 |
| format        | string \| null      | 단축 변수명으로 구독 원하는 경우 SHORT 입력(기본값 : DEFAULT)            |

#### 웹소켓 연결 예시 - wscat 이용

```javascript Shell
wscat -c wss://stream.coinone.co.kr/private

Connected (press CTRL+C to quit)
< {"response_type":"CONNECTED","data":{"session_id":"57a97041-a6ee-aa86-fb6d-6f51f626dc4c"}}
```

### Error Message

| Code   | Massage                         | Description               |
| :----- | :------------------------------ | :------------------------ |
| 160010 | Invalid Request                 | 올바르지 않은 양식으로 요청한 경우       |
| 160011 | Invalid Type : {invalid\_field} | 잘못 입력한 필드가 있을 경우          |
| 160012 | Invalid Topic                   | 구독 요청한 Topic 이 올바르지 않을 경우 |

#### Error Response

에러 발생시 다음과 같은 형태로 에러 메세지가 전달됩니다.

```json
{
  "response_type":"ERROR",
  "error_code":160012,
  "message":"Invalid Topic"
}
```
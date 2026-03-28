# Public 웹소켓

Public 웹소켓 이용 안내

Public 웹소켓은 별도의 인증 없이 수신이 가능합니다. 제공하는 데이터는 아래와 같습니다.

* 오더북 응답 (ORDERBOOK)
* 티커 응답 (TICKER)
* 체결정보 응답 (TRADE)

## Public 웹소켓 기본 정보

**웹소켓 커넥션**

* URI : wss\://stream.coinone.co.kr

**메세지 포맷**

* 코인원 웹소켓을 통해 주고받는 메시지는 JSON 포맷입니다.

**지원하는 거래쌍**

* 거래지원중인 모든 마켓에 대해 지원 합니다.

**제약사항**

* IP 당 최대 20개의 연결을 허용합니다.
  * 20개의 연결을 초과할 경우 4290 Close Code 와 함께 연결이 자동 종료됩니다.
* request\_type / channel / format 의 값은 대문자로 정확하게 입력되어야 합니다.
* 서버는 마지막 PING 요청 이후 30분이 지났을 경우 유휴연결로 판단해 연결을 종료합니다. 연결종료를 방지하기 위해 PING 요청을 주기적으로 서버에 송신해야 합니다.
* 웹소켓에 업데이트가 있을 경우 기존 연결이 종료될 수 있습니다. 연결이 종료될 경우 재 연결을 할 수 있도록 고려해야 합니다.

***

## Public 웹소켓 요청 방법

### Request

| Fields        | Type   | Required        | Description                                           |
| :------------ | :----- | :-------------- | :---------------------------------------------------- |
| request\_type | string | O               | 실행할 요청 종류: SUBSCRIBE / UNSUBSCRIBE / PING             |
| channel       | string | O (PING일 경우 생략) | 구독 채널명:  ORDERBOOK / TICKER / TRADE                   |
| topic         | json   | O (PING일 경우 생략) | quote\_currency, target\_currency 등의 정보를 JSON 형식으로 입력 |
| format        | string | X (PING일 경우 생략) | 단축 변수명으로 구독 원하는 경우 SHORT 입력(기본값 : DEFAULT)            |

#### 웹소켓 연결 예시 - wscat 이용

```javascript Shell
wscat -c wss://stream.coinone.co.kr

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
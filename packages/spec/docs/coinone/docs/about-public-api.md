# API 소개 및 요청방법

Public API와 Private API를 요청하는 방법과 제한 사항을 확인

코인원 Open API는 코인원의 다양한 서비스를 개발자와 사용자들이 다양한 어플리케이션에 활용할 수 있도록 제공하는 서비스 입니다.

* Public API는 시세 조회, 오더북 정보 조회 등 계정과 연관되지 않은 마켓정보를 위한 API를 제공합니다.
* Private API는 코인원 계정과 관련된 잔고, 고객정보, 거래내역 및 매수/매도 거래를 위한 API를 제공합니다.

# Public API 요청하기

Public API는 GET 메서드로 구성되어 있고, 아래와 같은 방식으로 호출이 가능합니다.

```curl
curl --request GET \
     --url https://api.coinone.co.kr/public/v2/range_units \
		 --header 'accept: application/json'
```

```curl
curl --request GET \
     --url 'https://api.coinone.co.kr/public/v2/orderbook/KRW/target_currency?size=15' \
     --header 'accept: application/json'
```

<br />

***

# Private API 요청하기

Private API 요청을 위해서는 API Key 발급을 받아야 합니다. '코인원 웹사이트 > footer > Open API > 통합 API 관리 > 개인용 API' 섹션에서 \[새로운 키 발급] 버튼을 통해 발급 받을 수 있습니다.

<a href="https://coinone.co.kr/user/api/management" target="_blank">\[개인용 API Key 발급 받으러 가기]</a>

API Key 생성 시 목적에 맞는 권한을 설정할 수 있으며, 각 권한에 대한 카테고리는 아래와 같습니다.

* 잔고 조회: 보유한 가상자산 및 원화 잔고를 조회할 수 있습니다.
* 고객 정보: 고객정보, 가상계좌 정보, 가상자산 지갑 주소 등의 정보를 조회 할 수 있습니다.
* 입출금 조회: 가상자산 입/출금 내역, 원화 입/출금 내역을 조회 할 수 있습니다.
* 주문 조회: 등록된 주문 및 주문 내역, 체결 내역 등을 조회 할 수 있습니다.
* 주문 권한: 매수/매도 주문을 등록하거나 취소할 수 있습니다.
* 출금 권한 : 가상자산 출금을 할 수 있습니다. (대표 포트폴리오만 사용 가능)

## API 요청을 위한 준비

API Key 생성을 하게되면 Access Token과 Secret Key가 발급됩니다. 발급된 Access Token과 Secret Key를 통해 API 사용이 가능합니다.

#### API 요청 예시

```python
import base64
import hashlib
import hmac
import json
import uuid
import httplib2

ACCESS_TOKEN = '5a3e35e4-0778-4619-a117-7c60740b22a2'
SECRET_KEY = bytes('9974e540-9451-4898-bdd6-4e6c7872a86a', 'utf-8')


def get_encoded_payload(payload):
    payload['nonce'] = str(uuid.uuid4())

    dumped_json = json.dumps(payload)
    encoded_json = base64.b64encode(bytes(dumped_json, 'utf-8'))
    return encoded_json


def get_signature(encoded_payload):
    signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512)
    return signature.hexdigest()


def get_response(action, payload):
    url = '{}{}'.format('https://api.coinone.co.kr', action)

    encoded_payload = get_encoded_payload(payload)

    headers = {
        'Content-type': 'application/json',
        'X-COINONE-PAYLOAD': encoded_payload,
        'X-COINONE-SIGNATURE': get_signature(encoded_payload),
    }

    http = httplib2.Http()
    response, content = http.request(url, 'POST', headers=headers)

    return content


print(get_response(action='/v2.1/order', payload={
    'access_token': ACCESS_TOKEN,
    'order_id': 'd85cc6af-b131-4398-b269-ddbafa760a39',
    'quote_currency': 'KRW',
    'target_currency': 'BTC',
  	'type': 'LIMIT',
  	'side': 'BUY',
  	'qty': '1',
  	'price': '38000000',
  	'post_only': true
}))
```

* **Nonce**
  * **V2.1 API** 요청 시 논스는 UUID 버전4 포맷의 무작위 문자열입니다. Replay Attack을 방지하기 위해서, 사용자는 매 요청마다  별개의 논스를 사용해야 합니다.
  * **V2.0 API** 요청 시 논스는 유닉스 타임스탬프처럼 양의 정수입니다. Replay Attack을 방지하기 위해서, 사용자는 매 요청마다 이전 요청에 사용했던 논스 값보다 큰 값을 사용해야 합니다.
* **HTTP Method**: POST 메서드로 구성되어 있습니다.
* **HTTP Content-Type**: 콘텐츠 타입은 json입니다. 'application/json'
* **HTTP Header**: 헤더는 X-COINONE-PAYLOAD 와 X-COINONE-SIGNATURE로 구성되며, 이 두가지 값은 모든 요청에서 반드시 필요합니다.
* **표기법**
  * V2.1의 요청과 응답은 모두 snake\_case 입니다.
  * V2의 요청은 snake\_case 응답은 camelCase 입니다.
* **API 호출 시 Timezone 입력**
  * UTC 기준의 시간 입력
    * 예) [원화 입출금 조회 API](https://coinone.readme.io/v1.0/reference/krw-transaction-history)의 from\_ts, to\_ts에 입력하는 timestamp 값은 UTC 기준

### 헤더의 X-COINONE-PAYLOAD 생성하기

먼저 Request Body 객체를 JSON 문자열로 변환합니다. 그리고 변환한 문자열을 Base64 인코딩 합니다.

#### V2.1 API 요청 시 JSON 문자열 변환 (논스 값 포함)

```python
import simplejson as json  
import uuid

param = {  
  'access_token': ACCESS_TOKEN,  
  'price': 500000,  
  'qty': 1.1234,  
  'nonce': str(uuid.uuid4())  
}

# to json
json_param = json.dumps(param)
```

#### V2.0 API 요청 시 JSON 문자열 변환 (논스 값 포함)

```python
import simplejson as json  
import time

param = {  
  'access_token': ACCESS_TOKEN,  
  'price': 500000,  
  'qty': 1.1234,  
  'nonce': int(time.time()*1000)
}

# to json
json_param = json.dumps(param)
```

#### 변환된 JSON 문자열을 Base64 인코딩

```python
import base64

# X-COINONE-PAYLOAD
payload = base64.b64encode(bytes(json_param, 'utf-8'))
```

### 헤더의 X-COINONE-SIGNATURE 생성하기

먼저 만들었던 X-COINONE-PAYLOAD 와 사전에 발급한 API Key를 사용하여 SHA512 알고리즘을 통해서 해시 기반 메세지 인증코드(HMAC)를  생성합니다.

```python
import hashlib  
import hmac

# X-COINONE-SIGNATURE
SECRET_KEY = bytes(SECRET_KEY, 'utf-8')  
signature = hmac.new(SECRET_KEY, encoded_payload, hashlib.sha512).hexdigest()
```

### HTTP Request

Request body JSON 을 문자열로 변환하고 Base64로 인코딩한 값이 X-COINONE-PAYLOAD 헤더 값입니다.

```python
import httplib2

headers = {  
    'Content-type': 'application/json',  
    'X-COINONE-PAYLOAD': encoded_payload,  
    'X-COINONE-SIGNATURE': get_signature(encoded_payload),  
}

http = httplib2.Http()  
response, content = http.request(url, 'POST', body=encoded_payload, headers=headers)
```
# 커넥션 관리 (PING)

연결 상태를 체크하고, 세션 만료시간을 갱신

최초 접속 후 30분 이내에 요청이 없으면 자동으로 세션을 종료합니다. 모든 세션은 인증된 요청 이후 30분 동안 유지됩니다. 따라서 특정 채널을 구독하면서 세션을 유지하고 싶으면 PING 요청을 통해 세션 만료시간을 지속적으로 갱신해주어야 합니다.

### PING 요청 예시

#### PING Request

```json
{
  "request_type":"PING"
}
```

#### PING Response

```json
{
  "response_type":"PONG"
}
```

#### Stream - 없음
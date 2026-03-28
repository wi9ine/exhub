# 업비트 어시스턴트 이용 가이드

"업비트 어시스턴트"는 업비트 Open API 개발 문서를 보다 빠르고 효율적으로 탐색하고, 편리하게 이용할 수 있도록 지원합니다.

## 업비트 어시스턴트(Upbit Assistant) 소개

[block:html]
{
  "html": "<div><i class=\"fa-duotone fa-solid fa-seal-exclamation\"></i><strong> 서비스 목적</strong></div>"
}
[/block]

업비트 어시스턴트는 개발자의 편의 향상과 학습 보조를 목적으로 제공됩니다. **법적, 재정적, 투자적 자문이나 조언을 제공하는 서비스가 아니며, 특정 디지털 자산(종목)에 대한 추정, 권유 또는 추천으로 해석될 수 없습니다.**

[block:html]
{
  "html": "<div><i class=\"fa-duotone fa-solid fa-message-check\"  style=\"--fa-primary-color: #005F23; --fa-secondary-color: #3BE70C;\"></i><strong> 지원 범위</strong></div>"
}
[/block]

* 업비트 Open API 관련 질의 및 기본 사용 예시 안내
* API 응답, 에러 코드, WebSocket, 인증 등 문서 검색
* 개발자센터 내 가이드 문서, 용어집, 예제 코드 확인
  * FAQ( 업비트 API Key 발급 가이드, 주요 에러 코드 등)
  * 튜토리얼 콘텐츠 (시세조회, 지표 산출, 주문 생성 및 관리 등)
  * 개발 문서 예제 및 응답 코드
  * 개발자 센터 문서를 기반으로 작성된 예제 코드의 누락이나 간단한 오류 검증

[block:html]
{
  "html": "<div><i class=\"fa-duotone fa-solid fa-message-xmark\" style=\"--fa-primary-color: #ee3f3f; --fa-secondary-color: #ee3f3f;\"></i><strong> 답변 불가 범위</strong></div>"
}
[/block]

* 업비트 개발자 센터에서 지원하지 않는 문서에 대한 내용 (ex : 비공식 서드파티 서비스)
* 사용자 맞춤형 코드 생성 요청
* 개발 문서와 직접적인 관련이 없는 일반적 혹은 비기술적 질문

## 이용 방법

1. 업비트 개발자 센터 우축 하단에 있는 아이콘을 클릭합니다.
2. Open API 사용 방법, 엔드포인트, 응답 구조, 예시 등 궁금한 내용을 자연어로 입력합니다.
   1. “주문 API에서 `uuid`는 어떤 용도로 사용되나요?”
   2. “WebSocket 체결 데이터 예시 보여줘.”
   3. “Access Key 인증 방식이 궁금합니다.”
3. 답변 내 문서 링크를 클릭하면 해당 가이드 페이지로 이동할 수 있습니다.

[block:html]
{
  "html": "<div class=\"callout-section\">\n  <div class=\"callout-title\">\n    <i class=\"fa-duotone fa-solid fa-circle-exclamation\" style=\"--fa-primary-color: #ee3f3f; --fa-secondary-color: #ee3f3f;\"></i>\n    <strong style=\"color: #ee3f3f;\">이용 시 유의사항</strong>\n  </div>\n\n  <ul>\n    <li>\n      업비트 어시스턴트의 답변은 참고용으로만 활용해주시기 바랍니다. \n      서비스화·상업적 활용·재배포는 \n      <a href=\"https://upbit.com/open_api_agreement\" target=\"_blank\">Open API 이용약관</a>에 위반될 수 있습니다.\n    </li>\n    <li>\n      질문 시 API Key, 토큰, 계정 정보 등 민감한 데이터는 절대 입력하지 마세요. \n      해당 정보는 보안상 수집되지 않으며, 입력 시 노출 위험이 발생할 수 있습니다.\n    </li>\n  </ul>\n\n  <p>\n    자세한 내용은 \n    <a href=\"https://docs.upbit.com/kr/page/upbit-assistant-disclaimer\" target=\"_blank\">\n      업비트 어시스턴트 유의사항\n    </a>\n    을 참고하시기 바랍니다.\n  </p>\n</div>\n"
}
[/block]

업비트 어시스턴트는 현재 베타(Beta) 버전으로 제공되며, 이후 점진적으로 기능 개선과 문서 범위 확대가 예정되어 있습니다. 업비트 개발자 센터의 변화에 많은 관심 부탁드립니다.
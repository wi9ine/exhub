# AGENTS.md

exhub는 다음을 위한 프로젝트 이다.

- 가상자산 거래소의 OPEN API들을 사용하기 쉽도록 typescript로 래핑해서 제공한다.
- 각 가상자산 거래소의 OPEN API를 공용화 한다.

## Critical Rule

- specs 폴더의 각 거래소별 spec 파일은 공식 문서를 기반으로 작성한다.
- specs 폴더의 각 spec이 전체 프로젝트의 SSOT이다. 즉, 스펙 변경이 필요한 경우 specs 폴더의 spec을 먼저 변경하고 이를 기반으로 작업을 진행한다.

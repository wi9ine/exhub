# API 주요 에러 코드

<HTMLBlock>
  {`
  <iframe width="100%" height="340"
      frameborder=0 framespacing=0 marginheight=0 marginwidth=0 scrolling=no vspace=0
      src="https://content.bithumb.com/apidocs/support.html">
  </iframe>
  `}
</HTMLBlock>

## **개요**

API 요청값이 유효하지 않거나 처리 중 오류가 발생한 경우, HTTP 상태 코드와 함께 다음과 같은 형태의 JSON body가 리턴됩니다.

<pre>
  <code>
    {`
                          "error": {
                            "message": "<오류에 대한 설명>",
                            "name": "<오류 코드>"
                          }
                        `}
  </code>
</pre>

주요 오류 코드는 다음과 같습니다.

## **400 Bad Request**

<HTMLBlock>
  {`
  <table>
     <colgroup>
        <col width="35%">
        <col width="65%">
     </colgroup>
     <thead>
        <tr>
           <th scope="col">코드</th>
           <th scope="col">설명</th>
        </tr>
     </thead>
     <tbody>
        <tr>
           <td>invalid_parameter</td>
           <td>잘못된 파라미터 입니다.</td>
       </tr>
       <tr>
           <td>invalid_price</td>
           <td>주문가격 단위를 잘못 입력하셨습니다. 확인 후 시도해주세요.</td>
       </tr>
       <tr>
           <td>under_price_limit_ask<br>under_price_limit_bid</td>
           <td>주문가격은 최소 %s 이상으로 주문 가능합니다.</td>
       </tr>
       <tr>
           <td>invalid_price_ask<br>invalid_price_bid</td>
           <td>주문가격 단위를 잘못 입력하셨습니다. 확인 후 시도해주세요.</td>
       </tr>
       <tr>
           <td>bank_account_required</td>
           <td>실명확인 입출금 계좌 등록 후 이용가능합니다.</td>
       </tr>     
       <tr>
           <td>two_factor_auth_required</td>
           <td>유효한 인증채널을 입력하세요.</td>
       </tr>
       <tr>
           <td>currency does not have a valid value</td>
           <td>빗썸에서 지원하지 않는 코인 입니다.</td>
       </tr>
       <tr>
           <td>cross_trading</td>
           <td>제출하신 주문은 귀하가 기존에 제출하신 주문과 체결될 수 있어 취소되었습니다.</td>
       </tr>
       <tr>
         	 <td>withdraw_insufficient_balance</td>
           <td>출금 최대 한도가 초과 되었습니다.</td>
       </tr>
     </tbody>
  </table>
  `}
</HTMLBlock>

<br />

## **401 Unauthorized**

401 Unauthorized 오류는 대부분 JWT 서명이 올바르게 되지 않았을 때 발생합니다.  <a href="https://apidocs.bithumb.com/v2.1.0/docs/%EC%9D%B8%EC%A6%9D-%ED%97%A4%EB%8D%94-%EB%A7%8C%EB%93%A4%EA%B8%B0" target="_blank">인증 헤더 만들기</a> 문서를 참조하시어 서명이 올바르게 되었는지 확인해주세요.

<HTMLBlock>
  {`
  <table>
     <colgroup>
        <col width="35%">
        <col width="65%">
     </colgroup>
     <thead>
        <tr>
           <th scope="col">코드</th>
           <th scope="col">설명</th>
        </tr>
     </thead>
     <tbody>
       <tr>
           <td>invalid_query_payload</td>
           <td>Jwt의 query를 검증하는데 실패하였습니다.</td>
       </tr>
        <tr>
           <td>jwt_verification</td>
           <td>Jwt 토큰 검증에 실패했습니다.</td>
       </tr>
       <tr>
           <td>expired_jwt</td>
           <td>Jwt가 만료되었습니다.</td>
       </tr>

       <tr>
           <td>NotAllowIP</td>
           <td>not allowed client IP</td>
       </tr>
       <tr>
           <td>out_of_scope</td>
           <td>권한이 부족합니다.</td>
       </tr>
     </tbody>
  </table>
  `}
</HTMLBlock>

<br />

## **403 Forbidden**

403 Forbidden 오류는 대부분 접근 권한이 없거나, 운영 정책에 따라 제한된 기능일 수 있습니다. 더 궁금하신 점은 고객센터로 문의해주세요.

<HTMLBlock>
  {`
  <table>
     <colgroup>
        <col width="35%">
        <col width="65%">
     </colgroup>
     <thead>
        <tr>
           <th scope="col">코드</th>
           <th scope="col">설명</th>
        </tr>
     </thead>
     <tbody>
       <tr>
           <td>blocked_member_id</td>
           <td>Service usage has been restricted in accordance with our operational policy.</td>
       </tr>
     </tbody>
  </table>
  `}
</HTMLBlock>

<br />

## **404 Not Found**

<HTMLBlock>
  {`
  <table>
     <colgroup>
        <col width="35%">
        <col width="65%">
     </colgroup>
     <thead>
        <tr>
           <th scope="col">코드</th>
           <th scope="col">설명</th>
        </tr>
     </thead>
     <tbody>
       <tr>
           <td>order_not_found</td>
           <td>주문을 찾지 못했습니다.</td>
       </tr>
       <tr>
           <td>deposit_not_found<br>withdraw_not_found</td>
           <td>입출금 정보를 찾지 못했습니다.</td>
       </tr>
     </tbody>
  </table>
  `}
</HTMLBlock>

<br />

## **422 UNPROCESSABLE\_ENTITY**

<HTMLBlock>
  {`
  <table>
     <colgroup>
        <col width="35%">
        <col width="65%">
     </colgroup>
     <thead>
        <tr>
           <th scope="col">코드</th>
           <th scope="col">설명</th>
        </tr>
     </thead>
     <tbody>
       <tr>
           <td>order_not_ready</td>
           <td>주문 접수 처리 중입니다. 잠시 후 다시 시도해주세요.</td>
       </tr>
     </tbody>
  </table>
  `}
</HTMLBlock>

<br />

## **500 Internal Server Error**

500 Internal Server Error는 요청에는 문제가 없으나, 서버에서 데이터를 처리하는 과정에서 일시적인 이슈(예: 응답 지연)가 발생했을 때 나타납니다. 잠시 후 다시 시도해주시기 바랍니다.

<HTMLBlock>
  {`
  <table>
     <colgroup>
        <col width="35%">
        <col width="65%">
     </colgroup>
     <thead>
        <tr>
           <th scope="col">코드</th>
           <th scope="col">설명</th>
        </tr>
     </thead>
     <tbody>
       <tr>
           <td>server_error</td>
           <td>시스템이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.</td>
       </tr>
     </tbody>
  </table>
  `}
</HTMLBlock>

<br />
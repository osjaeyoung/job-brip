import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";

export default function TermsPage() {

  return (
    <Main className="subWrap bg">

      <div className="termsBox">
        <Container className="lnbContainer">
          <div className="termsContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice">
                  <span>
                    공지사항
                  </span>
                </Link>
                <Link to="/faq"><span>FAQ</span></Link>
                <Link to="/inquiry"><span>1:1 문의</span></Link>
                <Link to="/terms" className="active"><span>이용약관</span></Link>
                <Link to="/policy"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content">

                <h4>
                  이용약관
                </h4>

                <h5>제1장 총칙</h5>

                <h6>
                  제 1조 (목적)
                </h6>
                <p>
                  이 이용약관(이하 '약관')은 스마트항만물류사업단(이하 회사라 합니다)과 이용 고객(이하 '회원')간에 회사가 제공하는 서비스의 가입조건 및 이용에 관한 제반 사항과 기타 필요한 사항을 구체적으로 규정함을 목적으로 합니다.
                </p>

                <h6>
                  제2조 (약관의 효력 및 변경)
                </h6>
                <ul className="depth01">
                  <li>1. 이 약관은 본 회사에 가입된 고객을 포함하여 서비스를 이용하고자 하는 모든 이용자에 대하여 서비스 메뉴 및 회사에 게시하여 공시하거나 기타의 방법으로 고객에게 공지함으로써 그 효력을 발생합니다. 약관의 게시는 사이트에서 확인 할 수 있습니다.</li>
                  <li>2. 회사는 합리적인 사유가 발생될 경우에는 이 약관을 변경할 수 있으며, 약관을 변경할 경우에는 지체 없이 이를 사전에 공시합니다.</li>
                </ul>

                <h6>
                  제 3 조 (약관외 준칙)
                </h6>
                <p>
                  서비스 이용에 관하여는 이 약관을 적용하며 이 약관에 명시되지 아니한 사항에 대하여는 전기통신기본법, 전기통신사업법,정보통신망 이용촉진등에 관한 법률 및 기타 관계법령의 규정에 의합니다.
                </p>

                <h6>
                  제 4 조 (용어의 설명)
                </h6>

                <ul className="depth01">
                  <li>
                    1. 이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
                    <ul className="depth02">
                      <li>a. '이용고객'이라 함은 회원제로 운영하는 서비스를 이용하는 이용자를 의미합니다.</li>
                      <li>b. '이용계약'이라 함은 서비스 이용과 관련하여 회사와 이용고객 간에 체결 하는 계약을 말합니다.</li>
                      <li>c. '이용자번호(ID)'라 함은 회원식별과 회원의 서비스 이용을 위하여 회원이 선정하고 회사가 승인하는 영문자와 숫자의 조합을 말합니다.</li>
                      <li>d. '비밀번호'라 함은 이용고객이 부여 받은 이용자번호와 일치된 이용고객 임을 확인하고 이용고객의 권익보호를 위하여 이용고객이 선정한 문자와 숫자의 조합을 말합니다.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}
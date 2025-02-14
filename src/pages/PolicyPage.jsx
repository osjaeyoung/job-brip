import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";

export default function PolicyPage() {

  return (
    <Main className="subWrap bg">

      <div className="policyBox">
        <Container className="lnbContainer">
          <div className="policyContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice"><span>공지사항</span></Link>
                <Link to="/faq"><span>FAQ</span></Link>
                <Link to="/inquiry"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy" className="active"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content">

                <h4>
                  개인정보처리방침
                </h4>

                <h5>
                  개인정보처리방침
                </h5>

                <p>
                  ('https://brip-spl.kr/'이하 '스마트항만물류사업단')은(는) 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다
                </p>

                <p>
                  ('스마트항만물류사업단') 은(는) 회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.
                </p>

                <p>
                  ○ 본 방침은부터 2016년 12월 1일부터 시행됩니다.
                </p>

                <ul className="depth01">
                  <li>
                    1. 개인정보의 처리 목적 ('https://brip-spl.kr/'이하 '스마트항만물류사업단')은(는) 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.
                    <ul className="depth02">
                      <li>
                        가. 홈페이지 회원가입 및 관리 <br />
                        회원 가입의사 확인, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.
                      </li>
                      <li>
                        나. 재화 또는 서비스 제공 <br />
                        서비스 제공, 콘텐츠 제공 등을 목적으로 개인정보를 처리합니다.
                      </li>
                    </ul>
                  </li>
                </ul>

                <ul className="depth01">
                  <li>
                    2. 개인정보 파일 현황
                    <ul className="depth02">
                      <li>
                        1. 개인정보 파일명 : 스마트항만물류사업단
                        <ul className="depth03">
                          <li>- 개인정보 항목 : 이메일, 휴대전화번호, 학회지 받을주소, 자택전화번호, 로그인ID, 이름</li>
                          <li>- 수집방법 : 홈페이지 </li>
                          <li>- 보유근거 : 회원정보관리 </li>
                          <li>- 보유기간 : 회원탈퇴 후 3년 이내</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  )

}
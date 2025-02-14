import { Link } from "react-router-dom"
import Container from "../Container"
import style from "./Footer.module.css"
import FooterLogo from "../../assets/images/common/Footer_Logo.svg";

export default function Footer() {

  return (
    <footer id={style.footerBox}>
      <Container>
        <div className={style.footerContent}>
          <ul className={style.footerLinkList}>
            <li>
              <Link to="#">
                <span>사업단소개</span>
              </Link>
            </li>
            <li>
              <Link to="/terms">
                <span>이용약관</span>
              </Link>
            </li>
            <li>
              <Link to="/policy">
                <span>개인정보처리방침</span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <span>앱 다운로드</span>
              </Link>
            </li>
          </ul>

          <div className={style.footerBottom}>
            <div className={style.footerLogo}>
              <Link to="#">
                <img src={FooterLogo} alt="BRIP 부산지역혁신플랫폼 스마트항만물류사업단 Smart Port Logisics Group" />
              </Link>
            </div>

            <address>
              부산광역시 영도구 해양로 435-1(동삼동) 해양물류산업센터 1층 105호 TEL : 051-405-6746 FAX : 051-405-6748 <br />
              Copyright @ BRIP SMART PORT LOGISTICS GROUP ALL RIGHTS RESERVED.
            </address>
          </div>

        </div>
      </Container>
    </footer>
  )

}
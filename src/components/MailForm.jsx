import { Link } from "react-router-dom";
import style from "./MailForm.module.css";
import Logo from "../assets/images/common/logo.svg"

export default function MailForm() {
  return (
    <div className={style.mailFormWrap}>
      <div className={style.mailFormContainer}>
        <header className={style.mailFormHeader}>
          <div className={style.logoBox}>
            <h1>
              <Link to="/" />
              <img src={Logo} alt="BRIP" />
              <Link />
            </h1>
          </div>
        </header>
        <section className={style.mailFormSection}>
          <div className={style.logoBox}>
            <h2>
              <Link to="#" />
              <img src={Logo} alt="BRIP" />
              <Link />
            </h2>
          </div>

          <p className={style.infoText01}>
            이메일 인증코드 발송 드립니다!
          </p>

          <p className={style.codeNumber}>
            334565
          </p>

          <p className={style.infoText02}>
            인증코드 입력 후 비밀번호를 재설정해주세요.
          </p>

        </section>
        <footer className={style.mailFormFooter}>
          <p className={style.infoText01}>
            본 메일은 발신전용 입니다. <br />
            더 궁금하신 사항은 문의주시면 성심껏 답변 드리겠습니다.
          </p>
          <p className={style.infoText02}>
            P. 02-1234-1234 F. 02-1234-1234 E.  admin@000.co.kr
          </p>
          <p className={style.infoText03}>
            Copyright ATOZE Co., Ltd. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}
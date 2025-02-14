import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import "../../styles/login.css";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import Button from "../../components/Button";
import style from "./PwFindPage.module.css";
import Input from "../../components/Input";

export default function PwFindPage() {

  return (
    <>
      <Main className="subWrap bg">
        <div className="signinBox">
          <Container>
            <div className={`signinContent ${style.signinContent}`}>

              <h3 className={style.title}>
                비밀번호 찾기
              </h3>

              <p className={style.subText}>
                비밀번호를 재설정할 수 있는 인증코드를 보내드려요.
              </p>

              <div className="container">
                <form>

                  <div className={style.inputWrap}>
                    <div className="inputBox">
                      <Input
                        label="이메일"
                        id="email"
                        value="asdfd1234@naver.com"
                        type="text"
                        className="mb-15"
                      />
                    </div>
                  </div>

                  <div className="inputBox">
                    <Input
                      className="blind"
                      label="비밀번호 재설정 인증코드"
                      id="password"
                      type="text"
                    />
                  </div>

                  <div className={style.codeBox}>
                    <span>
                      인증코드가 오지 않나요?
                    </span>
                    <button className={style.codeBtn} type="button">
                      인증코드 재전송
                    </button>
                  </div>

                  <Button text="확인" />

                </form>
              </div>

              <div className="linkBox">
                <ArrowPrevButton href="/signin" hiddenText="로그인 화면으로 이동" />
              </div>

            </div>
          </Container>
        </div >
      </Main >
    </>
  )

}
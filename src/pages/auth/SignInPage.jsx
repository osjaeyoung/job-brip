import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import "../../styles/login.css";
import LoginImg from "../../assets/images/login/Login_Img.svg";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import style from "./SignInPage.module.css";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import { userData } from "../data/userData"

export default function SignInPage() {
  const [disabled, setDisabled] = useState(true); // 버튼 비활성화 상태
  const [email, setEmail] = useState(''); // 이메일 입력 상태
  const [password, setPassword] = useState(''); // 비밀번호 입력 상태
  const [error, setError] = useState(''); // 이메일, 비밀번호 오류 메세지
  const [emailError, setEmailError] = useState(''); // 이메일 오류 메세지
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 오류 메세지
  const [isRemembered, setIsRemembered] = useState(false); // 아이디 저장 체크 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  const validEmail = userData.email;
  const validPassword = userData.password;

  // 이메일 형식 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 로그인 페이지가 렌더링될 때 이미 로그인된 상태라면, 홈 페이지로 리디렉션
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/"); // 이미 로그인된 상태라면 홈 페이지로 리디렉션
    }
  }, [navigate]);

  // 이메일 유효성 검사
  function handleEmailChange(e) {
    const emailValue = e.target.value;
    setEmail(emailValue);

    setError('');
    setEmailError(''); // 이메일 오류 초기화

    if (!emailValue) {
      setEmailError('이메일을 확인해주세요.');
    } else if (!emailRegex.test(emailValue)) {
      setEmailError('유효한 이메일 형식을 입력해주세요.');
    }

    // 이메일 유효성 검사 후 버튼 상태 체크
    checkButtonEnable(emailValue, password, emailError, passwordError);
  }

  // 비밀번호 유효성 검사
  function handlePasswordChange(e) {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    setError('');
    setPasswordError(''); // 비밀번호 오류 초기화

    if (!passwordValue) {
      setPasswordError('비밀번호를 입력해주세요.');
    }

    // 비밀번호 유효성 검사 후 버튼 상태 체크
    checkButtonEnable(email, passwordValue, emailError, passwordError);
  }

  // 버튼 활성화/비활성화 체크
  function checkButtonEnable(emailValue, passwordValue, emailError, passwordError) {
    // 이메일과 비밀번호 모두 유효한지, 오류가 없을 때만 버튼 활성화
    if (emailRegex.test(emailValue) && passwordValue && !emailError && !passwordError) {
      setDisabled(false); // 조건이 맞으면 버튼 활성화
    } else {
      setDisabled(true); // 조건이 맞지 않으면 버튼 비활성화
    }
  }

  // 로그인 처리 함수
  function handleSubmit(e) {
    e.preventDefault();

    // 로컬스토리지에서 사용자 정보를 가져옴
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // 이메일과 비밀번호 비교
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      localStorage.setItem("authToken", "dummyToken_12345");  // 인증 토큰 저장
      if (isRemembered) {
        localStorage.setItem("savedEmail", email); // 아이디 저장 체크된 경우 이메일 저장
      }
      navigate("/");  // 로그인 후 홈 화면으로 이동
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  }

  // 컴포넌트가 마운트될 때 저장된 이메일을 불러옵니다.
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsRemembered(true); // "아이디 저장" 체크 상태를 true로 설정
    }
  }, []);

  // 아이디 저장 체크박스 상태 변화
  function handleRememberMeChange(e) {
    setIsRemembered(e.target.checked);
  }

  return (
    <>
      <Main className="subWrap bg">
        <div className="signinBox">
          <Container>
            <div className={`signinContent ${style.signinContent}`}>

              <h3 className={style.title}>로그인</h3>

              <div className={style.imgBox}>
                <img src={LoginImg} alt="" />
              </div>

              <form onSubmit={handleSubmit}>
                <div className={style.inputBox}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일 입력"
                    hiddenText="이메일 입력"
                    onChange={handleEmailChange}
                    value={email}
                  />
                  {emailError && <p className="errorMessage">{emailError}</p>}
                </div>

                <div className={style.inputBox}>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호 입력"
                    hiddenText="비밀번호 입력"
                    onChange={handlePasswordChange}
                  />
                  {passwordError && <p className="errorMessage">{passwordError}</p>}
                </div>

                <div className={style.signinFindBox}>
                  <div className={style.inputChkBox}>
                    <input
                      id="loginIdSave"
                      type="checkbox"
                      checked={isRemembered}
                      onChange={handleRememberMeChange}
                    />
                    <label htmlFor="loginIdSave">아이디저장</label>
                  </div>
                  <Link to="/passwordfind" className={style.pwFindLink}>
                    비밀번호를 잊어버리셨나요?
                  </Link>
                </div>

                {error && <p className="errorMessage">{error}</p>}

                <Button
                  text="로그인"
                  customClass={style.btn}
                  disabled={disabled}
                />
              </form>

              <div className={style.snsListBox}>
                <ul className={style.snsList}>
                  <li>
                    <Link to="/" className={style.naverLogin}>
                      <span className="blind">네이버 로그인</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className={style.kakaoLogin}>
                      <span className="blind">카카오 로그인</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className={style.googleLogin}>
                      <span className="blind">구글 로그인</span>
                    </Link>
                  </li>
                </ul>

                <div className={style.easySignInBox}>
                  3초 간편로그인
                </div>
              </div>

              <div className={style.signupLinkBox}>
                <span>아직 계정이 없으신가요?</span>
                <Link to="/signup">회원가입</Link>
              </div>

            </div>
          </Container>
        </div>
      </Main>
    </>
  );
}

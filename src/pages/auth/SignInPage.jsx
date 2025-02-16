import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import "../../styles/login.css";
import LoginImg from "../../assets/images/login/Login_Img.svg";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import style from "./SignInPage.module.css";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import { useAuthStore } from '../../store/useAuthStore';
import { login } from "../../api/auth";

export default function SignInPage() {

  // 활성화, 비활성화 상태관리
  const [disabled, setDisabled] = useState(true);

  // 페이지 이동을 위한 hook
  const navigate = useNavigate();

  // 상태 관리 함수
  const { setAuthData } = useAuthStore();

  // 이메일 입력 상태관리
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // 이메일 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 비밀번호 입력 상태관리
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 아이디 저장 체크 상태관리
  const [isRemembered, setIsRemembered] = useState(false);

  //이메일 유효성 검사
  function handleEmailChange(e) {
    const emailValue = e.target.value;

    // 이메일 상태 업데이트
    setEmail(emailValue);
    if (!emailValue) {
      setEmailError('이메일을 입력해주세요.');
      return;
    } else if (!emailRegex.test(emailValue)) {
      setEmailError('유효한 이메일 형식을 입력해주세요.');
      return;
    } else {
      setEmailError('');
    }

  }

  //비밀번호 유효성 검사
  function handlePasswordChange(e) {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (!passwordValue) {
      setPasswordError('비밀번호를 입력해주세요.');
      return;
    } else {
      setPasswordError('');
    }

  }

  // 아이디 저장 체크박스 상태 변화
  function handleRememberMeChange(e) {
    setIsRemembered(e.target.checked);
  }

  // 컴포넌트 마운트 시 로컬 스토리지에서 저장된 아이디 가져오기
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {

      // 로컬 스토리지에서 아이디가 있으면 그 값을 입력
      setEmail(savedEmail);

      // 체크박스도 ON으로 설정
      setIsRemembered(true);

    }
  }, []);

  // 버튼 활성화/비활성화 체크
  useEffect(() => {
    // 이메일과 비밀번호가 유효한지, 오류가 없을 때만 버튼 활성화
    if (emailRegex.test(email) && password && !emailError && !passwordError) {
      setDisabled(false); // 조건이 맞으면 버튼 활성화
    } else {
      setDisabled(true); // 조건이 맞지 않으면 버튼 비활성화
    }
  }, [email, password, emailError, passwordError]); // 이메일과 비밀번호 상태가 변경될 때마다 실행

  //Form 전송
  async function handleSubmit(e) {
    e.preventDefault();

    try {

      const response = await login(email, password);

      if (isRemembered) {
        // 아이디 저장
        localStorage.setItem('savedEmail', email);
      } else {
        // 아이디 저장하지 않음
        localStorage.removeItem('savedEmail');
      }

      setAuthData({
        token: response.token,
        email: response.email,
        nickname: response.nickname,
        cuid: response.cuid,
      });

      navigate('/');

    } catch (error) {
      console.error('로그인 실패:', error);
    }

  };

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
                    error={emailError}
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
                    error={passwordError}
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

                {/* {error && <p className="errorMessage">{error}</p>} */}

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

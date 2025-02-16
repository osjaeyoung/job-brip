import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import { Link, useNavigate } from "react-router-dom";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import Button from "../../components/Button";
import style from "./SignUpPage.module.css";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { useState, useEffect } from "react";
import { checkNickname } from "../../api/auth";
import MailForm from "../../components/MailForm";

export default function SignUpPage() {

  const navigate = useNavigate();

  //이름 상태관리
  const [name, setName] = useState("");

  //닉네임 상태관리
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState(""); // 닉네임 오류 메시지
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(""); // 중복 확인 메시지 상태
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false); // 닉네임 사용 가능 여부

  //닉네임 검사
  const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,12}$/;

  //이메일 상태 관리
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");

  //비밀번호 상태 관리
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //비밀번호 검사
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,14}$/;

  //비밀번호 확인 상태 관리
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  // 폼 유효성
  const [isFormValid, setIsFormValid] = useState(false);

  // 닉네임 입력 처리
  function handleNicknameChange(e) {
    const nicknameValue = e.target.value;
    setNickname(nicknameValue);

    if (!nicknameValue) {
      setNicknameError("닉네임을 입력해주세요.")
      return;
    } else if (!nicknameRegex.test(nicknameValue)) {
      setNicknameError("닉네임은 2~12자, 특수문자 및 공백을 포함할 수 없습니다.");
      return;
    } else {
      setNicknameError("");
    }
  }

  // 중복 확인 버튼 클릭 시
  async function handleNicknameCheck() {
    if (!nickname) {
      setNicknameError("닉네임을 입력해주세요.")
      return;
    } else if (!nicknameRegex.test(nickname)) {
      setNicknameError("닉네임은 2~12자, 특수문자 및 공백을 포함할 수 없습니다.");
      return;
    }

    // 중복 확인을 API로 요청
    const isNicknameTaken = await checkNickname(nickname);

    if (!isNicknameTaken) {
      setNicknameError("이미 존재하는 닉네임입니다.");
    } else {
      setNicknameError("사용가능한 닉네임입니다.");
    }
  }

  // 비밀번호 유효성 검사
  function handlePasswordChange(e) {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (!passwordValue) {
      setPasswordError("비밀번호를 입력해주세요");
      return;
    } else if (!passwordRegex.test(passwordValue)) {
      setPasswordError("영문+숫자+특수문자 혼합 6~14자 입력 (대문자 사용불가)");
      return;
    } else {
      setPasswordError("");
    }
  }

  // 비밀번호 확인
  function handlePasswordCheck(e) {
    const passwordCheckValue = e.target.value;
    setPasswordCheck(passwordCheckValue);

    if (password !== passwordCheckValue) {
      setIsPasswordMatch(false);
    } else {
      setIsPasswordMatch(true);
    }
  }

  // 동의 항목을 객체로 관리
  const [agreements, setAgreements] = useState({
    agreeAll: false,
    agreeAge: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  // 개별 동의 항목 상태 변경 함수
  const handleAgreementChange = (e, type) => {
    const { checked } = e.target;
    setAgreements((prev) => ({
      ...prev,
      [type]: checked,
    }));
  };

  // "모두 동의" 체크 상태 업데이트 함수
  const handleAgreeAllChange = (e) => {
    const isChecked = e.target.checked;
    setAgreements({
      agreeAll: isChecked,
      agreeAge: isChecked,
      agreeTerms: isChecked,
      agreePrivacy: isChecked,
      agreeMarketing: isChecked,
    });
  };

  // "모두 동의" 체크 상태 업데이트 (필수 항목들이 모두 체크되어야만)
  useEffect(() => {
    const { agreeAge, agreeTerms, agreePrivacy } = agreements;
    setAgreements((prev) => ({
      ...prev,
      agreeAll: agreeAge && agreeTerms && agreePrivacy,
    }));
  }, [agreements.agreeAge, agreements.agreeTerms, agreements.agreePrivacy]);

  // 입력값 검증 함수
  function validateForm() {
    // 각 필드가 모두 유효한지 체크
    const isValid =
      name !== "" &&
      nickname !== "" &&
      !nicknameError &&
      email !== "" &&
      emailDomain !== "" &&
      password !== "" &&
      !passwordError &&
      isPasswordMatch &&
      (agreements.agreeAge && agreements.agreeTerms && agreements.agreePrivacy);

    setIsFormValid(isValid);  // 유효성에 맞게 버튼 활성화 여부 업데이트
  }

  useEffect(() => {
    // 폼 변경시마다 유효성 검사
    validateForm();
  }, [name, nickname, email, emailDomain, password, passwordCheck, nicknameError, passwordError, isPasswordMatch, agreements]);

  // 회원가입 처리 시 닉네임을 로컬 스토리지에 추가
  async function handleSignUp(e) {
    e.preventDefault();

    try {
      const response = await signUp({ name, nickname, email, password })
      navigate("/");

    } catch (error) {
      console.error("회원가입 실패:", error);
    }

  }

  return (
    <Main className="subWrap bg">
      <div className="signinBox">
        <Container>
          <div className={`signinContent ${style.signinContent}`}>
            <h3 className={style.title}>회원가입</h3>
            <div className="container">
              <form>
                {/* 이름 입력 */}
                <div className="inputWrap">
                  <div className="inputBox">
                    <Input
                      id="name"
                      label="이름"
                      placeholder="이름 입력"
                      className="mb-15"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* 닉네임 입력 */}
                <div className="inputWrap">
                  <label className="mb-15">닉네임</label>
                  <div className={`${style.inputNicknameBox}`}>
                    <Input
                      type="text"
                      placeholder="닉네임 입력"
                      value={nickname}
                      onChange={handleNicknameChange}
                    />
                    <button
                      className={style.duplicateChkBtn}
                      type="button"
                      onClick={handleNicknameCheck}
                      disabled={!nickname || nicknameError}
                    >
                      중복확인
                    </button>
                  </div>
                  {nicknameError && <p className="errorMessage">{nicknameError}</p>}
                  {/* {nicknameCheckMessage && (
                    <p className="infoMessage">{nicknameCheckMessage}</p>
                  )} */}
                </div>

                {/* 이메일 입력 */}
                <div className="inputWrap">
                  <label className="mb-15">이메일</label>
                  <div className={style.layoutBox}>
                    <div className={`inputBox ${style.inputEmailBox}`}>
                      <Input
                        id="emailId"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      @
                      <Input
                        id="emailDomain"
                        type="text"
                        value={emailDomain}
                        onChange={(e) => setEmailDomain(e.target.value)}
                      />
                    </div>
                    <Select
                      className={style.select}
                      id="emailSelect"
                      options={["gmail.com", "naver.com", "daum.net"]}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      hiddenText="이메일 선택"
                    />
                  </div>
                </div>

                {/* 비밀번호 입력 */}
                <div className="inputWrap">
                  <label htmlFor="password" className="mb-15">비밀번호</label>
                  <div className="inputBox">
                    <Input
                      id="password"
                      type="password"
                      placeholder="비밀번호 입력"
                      value={password}
                      onChange={handlePasswordChange}
                      error={passwordError}
                    />
                  </div>
                  {passwordError && <p className="errorMessage">{passwordError}</p>}
                </div>

                {/* 비밀번호 확인 */}
                <div className="inputWrap">
                  <label htmlFor="passwordCheck" className="mb-15">비밀번호 확인</label>
                  <div className="inputBox">
                    <Input
                      id="passwordCheck"
                      type="password"
                      placeholder="비밀번호 확인 입력"
                      value={passwordCheck}
                      onChange={handlePasswordCheck}
                      error={!isPasswordMatch}
                    />
                  </div>
                  {!isPasswordMatch && <p className="errorMessage">비밀번호가 일치하지 않습니다.</p>}
                </div>

                {/* 약관 동의 */}
                <div className={style.agreeChkBox}>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk01"
                      type="checkbox"
                      checked={agreements.agreeAll}
                      onChange={handleAgreeAllChange}
                      className="blind"
                    />
                    <label htmlFor="agreeChk01" className="allChk">모두 동의</label>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk02"
                      type="checkbox"
                      checked={agreements.agreeAge}
                      onChange={(e) => handleAgreementChange(e, "agreeAge")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk02">만 14세 이상 가입 동의 (필수)</label>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk03"
                      type="checkbox"
                      checked={agreements.agreeTerms}
                      onChange={(e) => handleAgreementChange(e, "agreeTerms")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk03">서비스 이용약관 동의 (필수)</label>
                    <Link to="/terms">약관보기</Link>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk04"
                      type="checkbox"
                      checked={agreements.agreePrivacy}
                      onChange={(e) => handleAgreementChange(e, "agreePrivacy")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk04">개인정보처리방침 동의 (필수)</label>
                    <Link to="/policy">약관보기</Link>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk05"
                      type="checkbox"
                      checked={agreements.agreeMarketing}
                      onChange={(e) => handleAgreementChange(e, "agreeMarketing")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk05">마케팅 정보 수진 동의 (선택)</label>
                    <Link to="/terms">약관보기</Link>
                  </div>
                </div>

                <Button
                  text="회원가입"
                  onClick={handleSignUp}
                  disabled={!isFormValid}
                />

              </form>
            </div>

            <div className="linkBox">
              <ArrowPrevButton href="/signin" hiddenText="로그인 화면으로 이동" />
            </div>
          </div>
        </Container>
      </div>
      <MailForm/>
    </Main>
  );
}

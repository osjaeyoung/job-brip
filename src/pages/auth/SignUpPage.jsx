import Container from "../components/Container";
import Main from "../components/layout/Main";
import { Link, useNavigate } from "react-router-dom";
import ArrowPrevButton from "../components/ArrowPrevButton";
import Button from "../components/Button";
import style from "./SignUpPage.module.css";
import Input from "../components/Input";
import Select from "../components/Select";
import { useState, useEffect } from "react";

export default function SignUpPage() {

  const navigate = useNavigate();

  const [name, setName] = useState(""); //이름 입력값
  const [nickname, setNickname] = useState(""); // 닉네임 입력값
  const [nicknameError, setNicknameError] = useState(""); // 닉네임 오류 메시지
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(""); // 중복 확인 메시지 상태
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false); // 닉네임 사용 가능 여부
  const [email, setEmail] = useState(""); // 이메일 아이디
  const [emailDomain, setEmailDomain] = useState(""); // 이메일 도메인
  const [password, setPassword] = useState(""); // 비밀번호
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 유효성 오류
  const [passwordCheck, setPasswordCheck] = useState(""); // 비밀번호 확인
  const [isPasswordMatch, setIsPasswordMatch] = useState(true); // 비밀번호 확인 일치 여부

  const [agreeAll, setAgreeAll] = useState(false); // 전체 동의
  const [agreeAge, setAgreeAge] = useState(false); // 만 14세 이상 동의
  const [agreeTerms, setAgreeTerms] = useState(false); // 서비스 이용약관 동의
  const [agreePrivacy, setAgreePrivacy] = useState(false); // 개인정보처리방침 동의
  const [agreeMarketing, setAgreeMarketing] = useState(false); // 마케팅 정보 동의

  const [isFormValid, setIsFormValid] = useState(false); // 폼 유효성

  const existingNicknames = JSON.parse(localStorage.getItem("nicknames")) || [];

  // 닉네임 유효성 검사
  function validateNickname(nicknameValue) {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,12}$/;
    return nicknameRegex.test(nicknameValue);
  }

  // 비밀번호 유효성 검사
  function validatePassword(passwordValue) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,14}$/;
    return passwordRegex.test(passwordValue);
  }

  // 닉네임 입력 처리
  function handleNicknameChange(e) {
    const nicknameValue = e.target.value;
    setNickname(nicknameValue);
    setNicknameError("");
    setNicknameCheckMessage("");

    if (!validateNickname(nicknameValue)) {
      setNicknameError("닉네임은 2~12자, 특수문자 및 공백을 포함할 수 없습니다.");
      setIsNicknameAvailable(false);
    } else {
      setNicknameError("");
      setIsNicknameAvailable(false); // 중복 확인 전까지는 사용 불가
    }
  }

  // 중복 확인 버튼 클릭 시
  function handleNicknameCheck() {
    if (!validateNickname(nickname)) {
      setNicknameError("닉네임은 2~12자, 특수문자 및 공백을 포함할 수 없습니다.");
      setIsNicknameAvailable(false);
      return;
    }

    if (existingNicknames.includes(nickname)) {
      setNicknameCheckMessage("이미 존재하는 닉네임입니다.");
      setIsNicknameAvailable(false);
    } else {
      setNicknameCheckMessage("사용가능한 닉네임입니다.");
      setIsNicknameAvailable(true);
    }
  }

  // 비밀번호 입력 처리
  function handlePasswordChange(e) {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (!validatePassword(passwordValue)) {
      setPasswordError("영문+숫자+특수문자 혼합 6~14자 입력 (대문자 사용불가)");
    } else {
      setPasswordError("");
    }
  }

  // 비밀번호 확인 필드 실시간 체크
  function handlePasswordCheck(e) {
    const passwordCheckValue = e.target.value;
    setPasswordCheck(passwordCheckValue);

    if (password !== passwordCheckValue) {
      setIsPasswordMatch(false);
    } else {
      setIsPasswordMatch(true);
    }
  }

  // 이메일 도메인 선택 처리
  function handleEmailDomainChange(e) {
    setEmailDomain(e.target.value);
  }

  // 전체 동의 처리
  function handleAgreeAllChange() {
    const newAgreeAll = !agreeAll;

    // "모두 동의"가 체크되면 모든 항목을 체크, 해제되면 모든 항목을 해제
    setAgreeAll(newAgreeAll);
    setAgreeAge(newAgreeAll);
    setAgreeTerms(newAgreeAll);
    setAgreePrivacy(newAgreeAll);
    setAgreeMarketing(newAgreeAll);
  }

  // 개별 약관 동의 처리
  function handleIndividualAgreementChange(e, type) {
    const isChecked = e.target.checked;
    switch (type) {
      case "agreeAge":
        setAgreeAge(isChecked);
        break;
      case "agreeTerms":
        setAgreeTerms(isChecked);
        break;
      case "agreePrivacy":
        setAgreePrivacy(isChecked);
        break;
      case "agreeMarketing":
        setAgreeMarketing(isChecked);
        break;
      default:
        break;
    }
  }

  // "모두 동의" 체크 상태 업데이트 함수
  useEffect(() => {
    // "모두 동의"가 체크되려면 필수 항목 모두 체크되어야 함
    if (agreeAge && agreeTerms && agreePrivacy) {
      setAgreeAll(true);
    } else {
      setAgreeAll(false);
    }
  }, [agreeAge, agreeTerms, agreePrivacy, agreeMarketing]);

  // 폼 유효성 검사
  useEffect(() => {
    if (
      nickname &&
      isNicknameAvailable &&
      email &&
      emailDomain &&
      password &&
      isPasswordMatch &&
      agreeAll
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    nickname,
    isNicknameAvailable,
    email,
    emailDomain,
    password,
    isPasswordMatch,
    agreeAll,
  ]);

  // 회원가입 처리 시 닉네임을 로컬 스토리지에 추가
  function handleSignUp() {
    if (isNicknameAvailable) {
      const updatedNicknames = [...existingNicknames, nickname];
      localStorage.setItem("nicknames", JSON.stringify(updatedNicknames));

      // 회원가입 후 사용자 정보 저장
      const user = {
        name: name,
        nickname: nickname,
        email: email + "@" + emailDomain,
        password: password,
      };

      // 로컬스토리지에 사용자 정보 저장
      localStorage.setItem("user", JSON.stringify(user));

      // 로그인 후 인증 토큰 생성
      localStorage.setItem("authToken", "dummyToken_12345");

      alert("회원가입이 완료되었습니다.");
      navigate("/"); // 홈 화면으로 이동 (로그인 없이 바로 메인 페이지로 이동)
    } else {
      alert("닉네임이 유효하지 않거나 중복되었습니다.");
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
                  {nicknameCheckMessage && (
                    <p className="infoMessage">{nicknameCheckMessage}</p>
                  )}
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
                        onChange={handleEmailDomainChange}
                      />
                    </div>
                    <Select
                      className={style.select}
                      id="emailSelect"
                      options={["gmail.com", "naver.com", "daum.net"]}
                      onChange={handleEmailDomainChange}
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
                      checked={agreeAll}
                      onChange={handleAgreeAllChange}
                      className="blind"
                    />
                    <label htmlFor="agreeChk01" className="allChk">모두 동의</label>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk02"
                      type="checkbox"
                      checked={agreeAge}
                      onChange={(e) => handleIndividualAgreementChange(e, "agreeAge")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk02">만 14세 이상 가입 동의 (필수)</label>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk03"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => handleIndividualAgreementChange(e, "agreeTerms")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk03">서비스 이용약관 동의 (필수)</label>
                    <Link to="#">약관보기</Link>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk04"
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => handleIndividualAgreementChange(e, "agreePrivacy")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk04">개인정보처리방침 동의 (필수)</label>
                    <Link to="#">약관보기</Link>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk05"
                      type="checkbox"
                      checked={agreeMarketing}
                      onChange={(e) => handleIndividualAgreementChange(e, "agreeMarketing")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk05">마케팅 정보 수진 동의 (선택)</label>
                    <Link to="#">약관보기</Link>
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
    </Main>
  );
}

import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import kakao from "../assets/images/login/Kakao_Img.svg";
import naver from "../assets/images/login/Naver_Img.svg";
import style from "./MyPage.module.css";
import Input from "../components/Input";
import { usePopup } from "../context/PopupProvider";
import { UserContext } from "../context/UserProvider";
import { useContext, useEffect, useState } from "react";
import CompletePopup from "../components/CompletePopup";

export default function MyPage() {
  const navigate = useNavigate();

  // UserContext에서 user와 loading 상태 가져오기
  const { user, loading, updateUser } = useContext(UserContext);

  const { isPopupOpen, openPopup, closePopup } = usePopup();

  // 버튼 활성화, 비활성화 상태 관리
  const [disabled, setDisabled] = useState(true);

  // nickname 상태 추가
  const [nickname, setNickname] = useState(user?.nickname || "");

  // Input의 값이 변경될 때 상태 업데이트
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setDisabled(false); // 입력이 있으면 완료 버튼 활성화
    setError(""); // 에러 초기화
  };

  // 닉네임 완료 버튼 클릭 시 동작하는 함수
  const handleNicknameSubmit = () => {
    // 로컬스토리지에서 저장된 닉네임들 가져오기
    const allNicknames = JSON.parse(localStorage.getItem("nicknames")) || [];

    // 중복 체크
    if (allNicknames.includes(nickname)) {
      openPopup();
      return;
    }

    // 이전 닉네임이 있다면 삭제
    if (user?.nickname) {
      // 이전 닉네임을 삭제
      const updatedNicknames = allNicknames.filter((nick) => nick !== user.nickname);

      // 변경된 nicknames 배열을 로컬스토리지에 저장
      localStorage.setItem("nicknames", JSON.stringify(updatedNicknames));
    }

    // 새로운 닉네임을 배열에 추가
    const updatedNicknames = [...allNicknames, nickname];  // 기존 배열에 새로운 닉네임 추가
    localStorage.setItem("nicknames", JSON.stringify(updatedNicknames));  // 변경된 배열을 로컬스토리지에 저장

    // 사용자 정보 업데이트 (UserContext에 반영)
    if (updateUser) {
      const updatedUser = { ...user, nickname };  // 새로운 닉네임 반영한 사용자 정보
      updateUser(updatedUser);  // UserContext의 updateUser 함수 호출하여 닉네임 업데이트
    }
    setDisabled(true);
    openPopup();
  };

  // 사용자 정보가 없으면 로그인 페이지로 리디렉션
  useEffect(() => {
    if (loading) {
      return;  // 로딩 중이면 아무것도 하지 않음
    }

    if (!user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  // 페이지 새로 고침 후 로컬스토리지에서 최신 값 가져오기
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setNickname(storedUser.nickname || user?.nickname || "");
  }, [user?.nickname]);

  return (
    <Main className="subWrap bg">
      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">
            <div className={`lnbLayoutBox ${style.lnbLayoutBox}`}>
              <aside>
                <Link to="/mypage" className="active">
                  <span>프로필</span>
                </Link>
                <Link to="/interest"><span>관심공고</span></Link>
                <Link to="/resume"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className={`content ${style.content}`}>
                <div className={style.box}>
                  <h4 className={`title ${style.title}`}>프로필</h4>
                  <form>
                    <div className="inputWrap">
                      <div className="inputBox">
                        <Input
                          id="name"
                          type="text"
                          value={user?.name || ""}
                          label="이름"
                          className="mb-15"
                        />
                      </div>
                    </div>

                    <div className="inputWrap">
                      <label htmlFor="nickname" className="mb-15">
                        닉네임
                      </label>
                      <div className={`inputBox ${style.inputNicknameBox}`}>
                        <Input
                          id="nickname"
                          type="text"
                          value={nickname}
                          onChange={handleNicknameChange}
                        />
                        {/* 완료 버튼 */}
                        <button
                          className={style.duplicateChkBtn}
                          type="button"
                          disabled={disabled}
                          onClick={handleNicknameSubmit}
                        >
                          완료
                        </button>
                      </div>
                      {/* {error && <span className="errorMessage">{error}</span>} */}
                    </div>

                    <div className="inputWrap">
                      <label htmlFor="number" className="mb-15">
                        휴대폰번호
                      </label>
                      <div className="inputBox">
                        <Input
                          id="number"
                          type="text"
                          value={user?.phone || ""}
                        />
                        <button className={style.changeBtn} type="button">
                          변경
                        </button>
                      </div>
                    </div>

                    <div className="inputWrap">
                      <label htmlFor="email" className="mb-15">
                        이메일
                      </label>
                      <div className="inputBox">
                        <Input
                          id="email"
                          type="text"
                          value={user?.email || ""}
                        />
                        <button className={style.changeBtn} type="button">
                          변경
                        </button>
                      </div>
                    </div>

                    <div className="inputWrap">
                      <div className="inputBox">
                        <Input
                          id="birthdate"
                          type="text"
                          value={user?.birthdate || ""}
                          label="생년월일"
                          className="mb-15"
                        />
                      </div>
                    </div>

                  </form>

                  <div className={style.snsSignInBox}>
                    <h5>SNS 로그인 연결</h5>
                    <ul className={style.snsSignInList}>
                      <li>
                        <div className={style.imgBox}>
                          <img src={naver} alt="네이버로그인" />
                        </div>
                        <span className={style.snsText}>네이버 로그인</span>
                        <button className={style.connectBtn}>연결</button>
                      </li>
                      <li className={style.kakao}>
                        <div className={style.imgBox}>
                          <img src={kakao} alt="카카오로그인" />
                        </div>
                        <span className={style.snsText}>카카오 로그인</span>
                        <button className={style.connectBtn}>연결</button>
                      </li>
                    </ul>
                  </div>

                  <button className={style.terminationBtn}>
                    서비스 해지
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {
        isPopupOpen &&
        <CompletePopup
          message="사용 가능한 닉네임입니다."
          onCancel={() => closePopup()}
          isOpen={isPopupOpen}
        />
      }
    </Main>
  );
}

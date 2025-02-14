import { useState, useEffect, useContext } from "react";
import Table from "../components/Table";
import { UserContext } from "../context/UserProvider";
import { usePopup } from "../context/PopupProvider";
import style from "./InquiryPage.module.css";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import ConfirmPopup from "../components/ConfirmPopup";

export default function InquiryPage() {
  const [data, setData] = useState([]);
  const { user } = useContext(UserContext);
  const { isPopupOpen, openPopup, closePopup } = usePopup();

  useEffect(() => {
    const storedData = localStorage.getItem("inquiryData");
    if (storedData) {
      setData(JSON.parse(storedData)); // 로컬스토리지에서 데이터를 불러와서 상태에 저장
    }

    if (!user) {
      openPopup(); // 사용자가 로그인하지 않았다면 팝업을 연다
    }
  }, [user]);

  const sortedData = data.sort((a, b) => {
    return new Date(b.date) - new Date(a.date); // 최신순 정렬
  });

  return (
    <Main className="subWrap bg">
      <div className="inquiryBox">
        <Container className="lnbContainer">
          <div className="inquiryContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice"><span>공지사항</span></Link>
                <Link to="/faq"><span>FAQ</span></Link>
                <Link to="/inquiry" className="active"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content flexColumn">
                <h4>1:1문의</h4>
                <p className={style.inquiryInfoText}>
                  문의량이 많을 시 답변이 지연될 수 있습니다. <br />
                  답변은 평일 9:30 ~ 17:00 에 등록되며, 가능한 빨리 답변드릴 수 있도록 노력하겠습니다.
                </p>

                {sortedData.length === 0 ? (
                  "등록한 문의가 없습니다."
                ) : (
                  <Table
                    caption="1:1문의하기"
                    href="/inquirydetail"
                    filteredData={sortedData}
                    className="textLeft ellipsisText"
                    showStatus={true}
                    columns={["NO.", "구분", "제목", "처리상태", "등록일"]}
                    colgroup={
                      <>
                        <col style={{ width: "90px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "150px" }} />
                      </>
                    }
                  />
                )}

                {user && (
                  <Button
                    href="/inquiryreg"
                    text="1:1문의 등록"
                    customClass={style.btn}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 팝업을 열기 위한 상태가 true일 때 */}
      {isPopupOpen && (
        <ConfirmPopup
          message="로그인이 필요한 서비스 입니다."
          subMessage="로그인 하시겠습니까?"
          confirmText="로그인"
          cancelText="취소"
          onConfirm={() => {
            window.location.href = "/signin"; // 로그인 페이지로 이동
            closePopup(); // 팝업 닫기
          }}
          onCancel={() => closePopup()} // 취소 클릭 시 팝업 닫기
          isOpen={isPopupOpen} // 팝업 열기/닫기 상태 전달
        />
      )}
    </Main>
  );
}

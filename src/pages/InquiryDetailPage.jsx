import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import style from "./InquiryDetailPage.module.css";

export default function InquiryDetailPage() {
  const { id } = useParams();
  const [inquiryData, setInquiryData] = useState([]);
  const [inquiry, setInquiry] = useState(null);

  useEffect(() => {
    // 로컬스토리지에서 inquiryData 불러오기
    const storedData = localStorage.getItem("inquiryData");
    if (storedData) {
      setInquiryData(JSON.parse(storedData));  // 로컬스토리지에서 데이터를 불러와서 상태에 저장
    }
  }, []);

  useEffect(() => {
    // id가 변경되거나 inquiryData가 변경될 때마다 해당 id에 맞는 문의를 찾아서 상태 업데이트
    if (inquiryData.length > 0 && id) {
      const foundInquiry = inquiryData.find((data) => data.id === Number(id));
      setInquiry(foundInquiry);  // 해당 id의 문의 정보를 찾음
    }
  }, [id, inquiryData]);

  // inquiry가 없으면 "문의 없음" 메시지를 표시
  if (!inquiry) {
    return (
      <Main className="subWrap bg">
        <div className="inquiryBox">
          <Container className="lnbContainer">
            <div className="inquiryContent">
              <div className="lnbLayoutBox">
                <div className="content">
                  <h4>1:1 문의 상세</h4>
                  <p>해당 문의를 찾을 수 없습니다.</p>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </Main>
    );
  }

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
                <h4>1:1 문의 상세</h4>

                <div className={style.inquiryQuestionWrap}>
                  <div className={style.inquiryQuestionBox}>
                    <div className={style.topBox}>
                      <p className={style.title}>{inquiry.title}</p>
                      <div className={style.box}>
                        <span className={style.category}>{inquiry.category}</span>
                        <span className={style.date}>{inquiry.date}</span>
                        <span className={style.status}>{inquiry.status}</span>
                      </div>
                    </div>

                    <div className={style.inquiryQuestionContent}>
                      <p>{inquiry.content}</p>
                    </div>
                  </div>

                  <div className={style.inquiryAnswerBox}>
                    <div className={style.topBox}>
                      <p className={style.title}>{inquiry.status}</p>
                      {/* <span className={style.date}>{inquiry.responseDate || "답변없음"}</span> */}
                    </div>
                    {/* <div className={style.inquiryAnswerContent}>
                      <p>{inquiry.response || "답변이 아직 없습니다."}</p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import Button from "../components/Button";
import style from "./InquiryRegisterPage.module.css";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import FileUpload from "../components/FileUpload";

export default function InquiryRegisterPage() {

  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null); // 파일 업로드 상태 관리
  const [inquiryData, setInquiryData] = useState([]); // 로컬스토리지에서 가져온 데이터를 저장할 상태

  const navigate = useNavigate(); // useNavigate 훅 사용

  // 컴포넌트가 마운트될 때 로컬스토리지에서 데이터를 불러옵니다.
  useEffect(() => {
    const storedData = localStorage.getItem("inquiryData");
    if (storedData) {
      setInquiryData(JSON.parse(storedData)); // 로컬스토리지에서 가져온 데이터를 상태에 저장
    }
  }, []);

  // inquiryData가 변경될 때마다 로컬스토리지에 저장합니다.
  useEffect(() => {
    if (inquiryData.length > 0) {
      localStorage.setItem("inquiryData", JSON.stringify(inquiryData)); // 데이터를 로컬스토리지에 저장
    }
  }, [inquiryData]);

  const handleFileChange = (newFile) => {
    setFile(newFile); // 파일 상태 관리
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategory || !content) {
      alert("카테고리와 내용을 모두 입력해 주세요.");
      return;
    }

    // 로컬스토리지에서 마지막 id 가져오기
    const lastInquiry = inquiryData[inquiryData.length - 1];
    const newId = lastInquiry ? lastInquiry.id + 1 : 1;  // 첫 등록 시 id는 1로 시작

    const newInquiry = {
      id: newId,
      category: selectedCategory,
      title: "문의드립니다.",
      content: content,
      status: "답변예정",
      date: new Date().toISOString().split("T")[0],
      response: null,
      responseDate: null,
      file: file ? file : null,
    };

    // 새로 등록된 문의를 inquiryData 배열에 추가
    setInquiryData((prevData) => [...prevData, newInquiry]);

    // 로컬스토리지에 데이터 저장
    localStorage.setItem("inquiryData", JSON.stringify([...inquiryData, newInquiry]));

    alert("문의가 등록되었습니다.");
    navigate("/inquiry");

    // 폼 초기화
    setSelectedCategory("");
    setContent("");
    setFile(null);
  };

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

              <div className="content">
                <h4>1:1 문의 등록</h4>
                <p className={style.inquiryInfoText}>
                  문의량이 많을 시 답변이 지연될 수 있습니다. <br />
                  답변은 평일 9:30 ~ 17:00 에 등록되며, 가능한 빨리 답변드리겠습니다.
                </p>

                <form className={style.form} onSubmit={handleSubmit}>
                  <div className={style.selectBox}>
                    <Select
                      className={style.select}
                      id="selectCategory"
                      hiddenText="카테고리 선택"
                      options={["서비스관련", "채용관련"]}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    />
                  </div>

                  <div className={style.textareaBox}>
                    <Textarea
                      hiddenText="내용입력"
                      placeholder="내용을 입력해주세요"
                      className={style.textarea}
                      value={content}
                      onChange={handleContentChange}
                    />
                  </div>

                  <FileUpload onChange={handleFileChange} /> {/* 파일 업로드 컴포넌트 */}

                  <Button
                    text="등록"
                    customClass={style.btn}
                    type="submit"
                  />
                </form>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}

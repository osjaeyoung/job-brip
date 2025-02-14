// ResumeRegpage.js

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import style from "./ResumeRegpage.module.css";
import Button from "../components/Button";
import Input from "../components/Input";
import FileImg from "../assets/images/sub/file_img.svg";
import PlusIcon from "../assets/images/sub/plus_icon02.svg";
import ArrowPrevButton from "../components/ArrowPrevButton";
import { useResume } from "../context/ResumeProvider";  // Assuming this hook handles resume data

const ResumeField = ({ label, value, readOnly, onChange, placeholder }) => (
  <div className={`${style.regBox} ${value ? "" : style.error}`}>
    <label>{label}</label>
    <Input
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  </div>
);

export default function ResumeRegpage() {
  const { user } = useContext(UserContext);
  const { addResume, resumeList, setResumeList } = useResume();  // Context hook to add and manage resumes
  const { id } = useParams();  // Get resume ID from URL
  const navigate = useNavigate();

  const [resumeTitle, setResumeTitle] = useState("");
  const [isAccordionOpen, setAccordionOpen] = useState({
    education: false,
    language: false,
    certificate: false,
    activity: false,
    experience: false,
    portfolio: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    resumeTitle: false,
    userName: false,
    userPhone: false,
    userEmail: false,
  });

  // 수정할 이력서를 찾는 useEffect
  useEffect(() => {
    if (id && resumeList.length > 0) {
      const resumeToEdit = resumeList.find((resume) => resume.id === parseInt(id));
      if (resumeToEdit) {
        setResumeTitle(resumeToEdit.name); // 기존 이력서 제목을 불러옴
      }
    }
  }, [id, resumeList]);

  const handleTitleChange = (e) => setResumeTitle(e.target.value);

  const handleAccordionToggle = (section) => {
    setAccordionOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    if (!file) return;
    if (!allowedFormats.includes(file.type)) {
      setImageError("허용된 이미지 형식이 아닙니다.");
      setImagePreview(null);
      return;
    }
    if (file.size > maxSize) {
      setImageError("파일 크기가 너무 큽니다. 5MB 이하로 업로드해주세요.");
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageError(null);
    };
    reader.readAsDataURL(file);
  };

  // 제출 버튼 클릭 시, 이력서를 추가하거나 수정
  const handleSubmit = () => {
    const errors = {
      resumeTitle: !resumeTitle,
      userName: !user?.name,
      userEmail: !user?.email,
    };

    setFormErrors(errors);

    if (Object.values(errors).includes(true)) {
      alert("필수 입력 필드가 누락되었습니다.");
      return;
    }

    const newResume = {
      id: id ? parseInt(id) : Date.now(),  // ID가 있을 경우 수정, 없으면 새로운 ID를 생성
      name: resumeTitle,
      isDefault: false, // 기본 이력서 여부
    };

    if (id) {
      // 수정 시, 해당 이력서 업데이트
      const updatedResume = { id: parseInt(id), name: resumeTitle };
      updateResume(updatedResume);  // 수정된 이력서를 updateResume로 업데이트
    } else {
      // 새 이력서 추가
      addResume(newResume);  // addResume으로 새 이력서 추가
    }

    alert("이력서가 저장되었습니다.");
    navigate("/resume");
  };



  return (
    <Main className="subWrap bg">
      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage"><span>프로필</span></Link>
                <Link to="/interest"><span>관심공고</span></Link>
                <Link to="/resume" className="active"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className={`content ${style.content} flexColumn`}>
                {user && (
                  <h4 className={`title ${style.userGreeting}`}>
                    {user.name}님의  <br />
                    이력서를 완성해주세요.
                  </h4>
                )}

                <div className={style.imgFileBox}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className={style.fileLabel}>
                    <img src={FileImg} alt="" />
                  </label>
                  {imagePreview && <img src={imagePreview} alt="preview" className={style.imagePreview} />}
                  {imageError && <div className={style.errorMessage}>{imageError}</div>}
                  <img src={PlusIcon} alt="" />
                </div>

                <ResumeField
                  label="이력서 제목"
                  value={resumeTitle}
                  onChange={handleTitleChange}
                  placeholder="나를 대표할 한 줄 제목을 입력해주세요."
                />

                <ResumeField
                  label="이름"
                  value={user?.name}
                  readOnly={true}
                />

                <ResumeField
                  label="휴대폰번호"
                  value={user?.phone || "010-1234-1234"}
                  readOnly={true}
                />

                <ResumeField
                  label="이메일"
                  value={user?.email}
                  readOnly={true}
                />

                <ResumeField
                  label="생년월일"
                  value={user?.birth || "1990-01-01"}
                  readOnly={true}
                />

                <div className={style.accordionSection}>
                  {["학력", "언어능력", "자격증", "활동", "경력", "포트폴리오"].map((section) => (
                    <div key={section} className={style.accordionItem}>
                      <button
                        className={`${style.button} ${isAccordionOpen[section] ? style.active : ""}`}
                        onClick={() => handleAccordionToggle(section)}
                      >
                        {section}
                      </button>
                      {isAccordionOpen[section] && (
                        <div className={style.accordionContent}>
                          <Input placeholder={`${section}을 입력하세요`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  text="작성완료"
                  customClass={style.btn}
                  onClick={handleSubmit}
                />

                <ArrowPrevButton
                  customClass={style.arrowPrevBtn}
                  href="/resume"
                  hiddenText="커리어탐색 화면으로 이동"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}

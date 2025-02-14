import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import style from "./ResumePage.module.css";
import Button from "../components/Button";
import { useState } from "react";
import { mockResumes } from "../data/mockResumes";
import ViewButton from "../components/ViewButton";

export default function ResumePage() {

  const [resumeList, setResumeList] = useState(mockResumes);
  const navigate = useNavigate();  // useNavigate 훅을 사용하여 페이지 이동

  // 이력서 항목의 액션을 토글하는 함수
  function handleToggle(id) {
    setResumeList((prevList) =>
      prevList.map((resume) =>
        resume.id === id
          ? { ...resume, isActionsVisible: !resume.isActionsVisible }
          : resume
      )
    );
  }

  // 이력서 삭제 함수
  function deleteResume(id) {
    setResumeList((prevList) =>
      prevList.filter((resume) => resume.id !== id)
    );
  }

  // 이력서 수정 함수
  function updateResume(updatedResume) {
    setResumeList((prevList) =>
      prevList.map((resume) =>
        resume.id === updatedResume.id ? updatedResume : resume
      )
    );
  }

  return (
    <Main className="subWrap bg">
      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage">
                  <span>프로필</span>
                </Link>
                <Link to="/interest"><span>관심공고</span></Link>
                <Link to="/resume" className="active"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className={`content ${style.content} flexColumn`}>
                <h4 className="title">이력서 관리</h4>
                <p className="subTitle">효율적인 이력서 관리로 커리어 목표를 달성하세요</p>

                <ul className={style.resumeList}>
                  {resumeList.map((data) => (
                    <li key={data.id}>
                      {data.isDefault && (
                        <span className={style.basicResume}>
                          기본이력서
                        </span>
                      )}
                      <h5>
                        <Link to="/resumereg">
                          {data.name}
                        </Link>
                      </h5>
                      <span className={style.date}>{data.date}</span>
                      <ViewButton
                        className={`${style.viewBox}`}
                        handleToggle={handleToggle}
                        data={data}
                        onEdit={(id) => {
                          // 수정 버튼 클릭 시, URL에 이력서 ID를 포함시켜서 ResumeRegpage로 이동
                          navigate(`/resumeupdate/${id}`);
                        }}
                        deleteResume={deleteResume} // 삭제 함수 전달
                        updateResume={updateResume}
                      />
                    </li>
                  ))}
                </ul>

                <Button
                  text="이력서작성"
                  href="/resumereg" // 동적으로 이력서 작성 페이지로 이동
                  customClass={style.btn}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}

import ArrowPrevButton from "../components/ArrowPrevButton";
import Card from "../components/Card";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import style from "./EmploymentDetailPage.module.css";
import CardImg02 from "../assets/images/main/Card_Img02.png";
import CardImg03 from "../assets/images/main/Card_Img03.png";
import DetailImg from "../assets/images/sub/Detail_Img.png";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import CompletePopup from "../components/CompletePopup";  // Import the CompletePopup component

export default function EmploymentDetailPage() {

  const [isResumeVisible, setIsResumeVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  // State to control the popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // State for the popup message and error flag
  const [popupMessage, setPopupMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Function to handle the "제출하기" button click
  const handleSubmit = () => {
    // Set your popup message and show the popup
    setPopupMessage("이력서 제출이 완료되었습니다.");
    setIsError(false);  // Set error state to false if the submission is successful
    setIsPopupOpen(true);  // Show the popup
  };

  // Function to close the popup
  const handlePopupCancel = () => {
    setIsPopupOpen(false);  // Hide the popup
  };

  return (
    <Main className="subWrap">
      <div className={`employmentBox ${style.employmentDetailBox}`}>
        <Container className="container">
          <div className="employmentContent">
            <div className={style.employmentDetailTop}>
              <div className={style.imgBox}>
                <img src={DetailImg} alt="" />
              </div>
              <div className={style.textBox}>
                <span className={style.company}>
                  (주)국토해양환경기술단
                </span>
                <div className={style.titleBox}>
                  <h3>
                    해양생태계분야(해조류/해초류)직원채용공고
                  </h3>
                  <span className={style.dDAY}>
                    D-12
                  </span>
                </div>
                <p className={style.condition}>
                  신입·경력  대졸↑  정규직  경기 수원시
                </p>
                <button className={style.likeBtn}>
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </div>
              <ArrowPrevButton
                customClass={style.arrowPrevBtn}
                href="/employment"
                hiddenText="채용공고 화면으로 이동"
              />
            </div>

            <div className={style.employmentDetailContent}>
              <div className={style.employmentDetailLeft}>
                <div className={style.employmentDetail}>
                  <h4>
                    상세요강
                  </h4>

                  <ul className={style.detailContentList}>
                    <li>
                      <span>[교용형태]</span>
                      <em>
                        정규직
                      </em>
                    </li>
                    <li>
                      <span>[구분]</span>
                      <em>
                        관련 경력 5년 이상
                      </em>
                    </li>
                    <li>
                      <span>[조직소개]</span>
                      <em>
                        CyberLogtiec은 세상의 시간과 공간을 더욱 가치있게 만들자는 슬로건을 가지고, 해운,항만 물류 분야의 세계 유명 Container Shipping Liner 에 B2B IT 솔루션을 제공하고 있습니다 <br /><br />
                        CyberLogtitec 에서는 Global Container Shipping Liner (해운선사) 의 모든 비즈니스 프로세스를 담고 있는 OPUS Container의 차세대 제품 프로젝트 (이름 : Chorus)를 진행하고 있습니다.
                      </em>
                    </li>

                    {/* Conditionally render additional list item */}
                    {isDetailVisible && (
                      <li>
                        <span>[기타]</span>
                        <em>
                          추가된 상세 정보
                        </em>
                      </li>
                    )}
                  </ul>

                  {/* Toggle button to show more details */}
                  <button
                    className={style.detailView}
                    onClick={() => setIsDetailVisible(!isDetailVisible)}
                  >
                    {isDetailVisible ? "상세정보 숨기기" : "상세정보 더보기"}
                  </button>

                </div>

                <div className={style.employmentDetail}>
                  <h4>
                    기술스택
                  </h4>

                  <ul className={style.techStack}>
                    <li>
                      Github
                    </li>
                    <li>
                      React
                    </li>
                    <li>
                      JavaScript
                    </li>
                    <li>
                      Node.js
                    </li>
                  </ul>
                </div>

                <div className={style.employmentDetail}>
                  <h4>
                    마감일
                  </h4>
                  <span className={style.deadlineText}>
                    2024.12.22
                  </span>
                </div>

                <div className={style.employmentDetail}>
                  <h4>
                    기업정보
                  </h4>

                  <div className={style.corporateInfo}>
                    기업정보영역
                  </div>
                </div>

                <div className={style.employmentDetail}>
                  <h4>
                    근무위치
                  </h4>

                  <address>
                    경기 수원시 영통구 덕영대로 1556번길 15
                  </address>

                  <div className={style.mapBox}>
                    지도영역
                  </div>
                </div>
              </div>

              <div className={style.employmentDetailRight}>
                {
                  isResumeVisible && (
                    <div className={style.applyBox}>
                      <h4>
                        지원하기
                      </h4>

                      <div className={style.selectBox}>
                        <label htmlFor="select" className="blind">
                          지원분야 선택
                        </label>
                        <select id="select" className={style.select}>
                          <option value="">지원분야선택</option>
                        </select>
                      </div>

                      <ul className={style.resumeList}>
                        <li>
                          <div className={style.resumeBox}>
                            <div className={style.resumeInfoList}>
                              <span className={style.basic}>기본이력서</span>
                            </div>

                            <div className={style.titleBox}>
                              <h5>
                                <input
                                  type="radio"
                                  name="resumeRadio"
                                  id="resumeRadio01"
                                  className="blind"
                                />
                                <label htmlFor="resumeRadio01">
                                  홍길동의 이력서
                                </label>
                              </h5>
                            </div>

                            <span className={style.date}>
                              2024-12-12
                            </span>

                            <Link
                              to="/resumereg"
                              className={style.viewBtn}>
                              보기
                            </Link>

                          </div>
                        </li>
                        <li>
                          <div className={style.resumeBox}>
                            <div className={style.titleBox}>
                              <h5>
                                <input
                                  type="radio"
                                  name="resumeRadio"
                                  id="resumeRadio02"
                                  className="blind"
                                />
                                <label htmlFor="resumeRadio02">
                                  홍길동의 이력서2
                                </label>
                              </h5>
                            </div>

                            <span className={style.date}>
                              2024-12-12
                            </span>

                            <Link
                              to="/resumereg"
                              className={style.viewBtn}>
                              보기
                            </Link>

                          </div>
                        </li>
                      </ul>

                      <Link to="/resumereg">
                        <button className={style.writeBtn}>
                          <span>
                            새 이력서 작성
                          </span>
                        </button>
                      </Link>

                      <Button
                        text="제출하기"
                        customClass={style.btn}
                        onClick={handleSubmit} // Trigger handleSubmit on button click
                      />

                      <Link className={style.link} to="/employment">
                        <span className="blind">채용공고 화면으로 이동</span>
                      </Link>

                    </div>
                  )
                }

                {/* Button to toggle resume section visibility */}
                {!isResumeVisible && (
                  <Button
                    text="이력서 작성"
                    customClass={style.btn}
                    onClick={() => setIsResumeVisible(true)}
                  />
                )}

                <div className={style.aiInfoBox}>
                  <p>
                    이력서를 작성하면 <br />
                    AI가 <strong>채용공고를 추천</strong>해줘요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <CompletePopup
          isOpen={isPopupOpen}
          message={popupMessage}
          error={isError}
          onCancel={handlePopupCancel}
        />
      </div>
    </Main>
  )
}

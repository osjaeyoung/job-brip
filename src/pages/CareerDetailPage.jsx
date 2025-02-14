import ArrowPrevButton from "../components/ArrowPrevButton";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import Career_Img01 from "../assets/images/sub/Career_Img01.jpg";
import InstructorImg from "../assets/images/sub/instructor_img.png";
import style from "./CareerDetailPage.module.css";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function CareerDetailPage() {

  return (
    <Main className="subWrap">

      <div className={`careerBox ${style.careerDetailBox}`}>
        <Container className="container">
          <div className="careerContent">
            <div className={style.careerDetailTop}>
              <div className={style.imgBox}>
                <img src={Career_Img01} alt="" />
              </div>
              <p className={style.infoText}>
                해양기술교육센터   |   직무/직군
              </p>
              <h3>
                선박 엔지니어 기초과정
                <span>
                  온라인
                </span>
              </h3>
              <span className={style.date}>
                2024.01.15 ~ 2024. 02.14
              </span>
              <ArrowPrevButton
                customClass={style.arrowPrevBtn}
                href="/career"
                hiddenText="커리어교육 화면으로 이동"
              />
            </div>

            <div className={style.layoutBox}>
              <div className={style.careerDetailContent}>
                <div className={`${style.box} ${style.procedureBox}`}>

                  <h4>
                    과정소개
                  </h4>

                  <p className={style.procedureDes}>
                    『Offshore Oil Gas Plant』은 해양플랜트의 기본적이 구성과 요소를 개념 중심으로 나열하며 선박과 해양플랜트 업종간의 차이점을 중점적으로 언급하고 있어 업무 전환자, 플랜트기자재 개발 종사자, 조선해양공학을 전공하는 학생들에게 많은 도움을 주는 강의입니다. <br /> <br />

                    선박 엔지니어로서의 첫걸음을 위한 기초 과정입니다. 선박 엔진 및 전기 시스템의 기본 구조와 작동 원리를 학습합니다.
                  </p>

                  <h5>
                    강의가 제공하는 <strong>주요 혜택</strong>
                  </h5>

                  <ul className={style.procedureList}>
                    <li>
                      선박 엔지니어를 준비하는 취업 준비생 및 초급 실무자
                    </li>
                    <li>
                      선박 엔진의 기본 구조를 이해하고 설명 가능
                    </li>
                    <li>
                      전기 시스템 기초 지식을 습득
                    </li>
                    <li>
                      유지보수 실습 경험을 통해 실무 준비
                    </li>
                  </ul>

                </div>

                <div className={`${style.box} ${style.instructorBox}`}>
                  <h4>
                    강사소개
                  </h4>
                  <div className={style.instructorDetailbox}>
                    <div className={style.top}>
                      <div className={style.textBox}>
                        <h5>
                          이재훈 강사
                        </h5>
                        <ul className={style.historyList}>
                          <li>
                            해양기계공학 학사 (한국해양대학교)
                          </li>
                          <li>
                            선박엔지니어링 석사 (울산과학기술원, UNIST)
                          </li>
                        </ul>
                      </div>
                      <div className={style.imgBox}>
                        <img src={InstructorImg} alt="" />
                      </div>
                    </div>

                    <ul className={style.historyDetailList01}>
                      <li>
                        해양기술연구소 선임 연구원 (2010~2015)
                        <ul className={style.historyDetailList02}>
                          <li>
                            선박 엔진 설계 및 효율 최적화 연구 수행.
                          </li>
                          <li>
                            친환경 연료 시스템 개발 프로젝트 주도.
                          </li>
                        </ul>
                      </li>
                      <li>
                        글로벌 해운사 기술팀장 (2015~2022)
                        <ul className={style.historyDetailList02}>
                          <li>
                            선박 유지보수 및 고장 진단 솔루션 도입.
                          </li>
                          <li>
                            국제 항로에서의 선박 운영 효율 개선.
                          </li>
                        </ul>
                      </li>
                      <li>
                        현재:
                        <ul className={style.historyDetailList02}>
                          <li>
                            해양기술교육센터 전임 강사
                            <ul className={style.historyDetailList02}>
                              <li>선박 엔지니어링 기초 및 친환경 기술 강의.</li>
                              <li>취업 준비생과 실무자를 위한 커리큘럼 설계</li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>

                  </div>
                </div>

                <div className={`${style.box} ${style.curriculumBox}`}>
                  <h4>
                    커리큘럼
                  </h4>

                  <ul className={style.curriculumList}>
                    <li>
                      <span>
                        1강
                      </span>
                      <h5>
                        선박 엔진의 기본 구조와 작동 원리 이해
                      </h5>
                      <em className={style.time}>
                        21:26
                      </em>
                    </li>
                    <li>
                      <span>
                        2강
                      </span>
                      <h5>
                        연료 및 윤활 시스템의 역할과 유지 관리
                      </h5>
                      <em className={style.time}>
                        21:26
                      </em>
                    </li>
                    <li>
                      <span>
                        3강
                      </span>
                      <h5>
                        전기 시스템 및 회로의 기초 이해
                      </h5>
                      <em className={style.time}>
                        21:26
                      </em>
                    </li>
                    <li>
                      <span>
                        4강
                      </span>
                      <h5>
                        선박 유지보수 매뉴얼 읽기와 실습
                      </h5>
                      <em className={style.time}>
                        21:26
                      </em>
                    </li>
                    <li>
                      <span>
                        5강
                      </span>
                      <h5>
                        고장 진단 프로세스 및 사례 분석
                      </h5>
                      <em className={style.time}>
                        21:26
                      </em>
                    </li>
                    <li>
                      <span>
                        6강
                      </span>
                      <h5>
                        선박 안전 관리 및 국제 규정 기초
                      </h5>
                      <em className={style.time}>
                        21:26
                      </em>
                    </li>
                    <li>
                      <span>
                        7강
                      </span>
                      <h5>
                        친환경 기술 개요: LNG 및 하이브리드 시스템
                      </h5>
                      <em className={style.time}>
                        21:26
                      </em>
                    </li>
                    <li>
                      <span>
                        8강
                      </span>
                      <h5>
                        기본 도구 사용법 및 엔진 점검 실습
                      </h5>
                      <em className={style.time}>
                        21:26
                      </em>
                    </li>
                    <li>
                      <span>
                        9강
                      </span>
                      <h5>
                        팀 협업과 작업 보고서 작성 실습
                      </h5>
                      <em className={style.time}>
                        21:26
                      </em>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={style.linkBox}>
                <Button
                  customClass={style.button}
                  text="강의바로가기"
                />
                <Link to="#" className={style.aiInfoBox}>
                  <p>
                    이력서를 작성하면 <br />
                    AI가 <strong>채용공고를 추천</strong>해줘요!
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}
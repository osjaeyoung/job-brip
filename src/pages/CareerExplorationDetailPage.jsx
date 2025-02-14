import { useState } from "react";
import ArrowPrevButton from "../components/ArrowPrevButton";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import { Link } from "react-router-dom";
import Career_Img01 from "../assets/images/sub/Career_Img01.jpg";
import Story_Img from "../assets/images/sub/Story_Img.png";
import style from "./CareerExplorationDetailPage.module.css";

export default function CareerExplorationDetailPage() {
  const [activeTab, setActiveTab] = useState("직무정보");
  const [targetActiveTab, setTargetActiveTab] = useState("단기목표");

  const handleTargetTabClick = (tab) => {
    setTargetActiveTab(tab);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 직무정보 내용 (여기서 공통 내용 정의)
  const commonContent = (
    <>
      <div className={style.box}>
        <h4>직무 정의</h4>
        <ul className={style.list}>
          <li>
            선박 엔지니어는 선박의 기계 및 전기 시스템을 설계, 유지보수, 수리하며, 선박이 안전하고 효율적으로 작동하도록 관리하는 역할을 맡습니다.
          </li>
          <li>
            주로 해운회사, 조선소, 선박 유지보수 회사에서 근무하며, 선박 엔진, 추진 시스템, 전기 시스템 등 복잡한 설비를 다룹니다.
          </li>
        </ul>
      </div>

      <div className={style.box}>
        <h4>주요 역할 및 책임</h4>
        <h5 className={style.subTitle}>설계 및 기술 지원</h5>
        <ul className={style.list}>
          <li>선박의 기계 및 전기 시스템 설계 및 최적화</li>
          <li>국제 규정 및 기술 표준에 맞는 설계 작업 수행</li>
        </ul>
        <h5 className={style.subTitle}>유지보수 및 수리</h5>
        <ul className={style.list}>
          <li>선박의 정기적인 점검 및 유지보수 작업 수행</li>
          <li>엔진, 발전기, 냉각 시스템 등 주요 설비 문제 해결</li>
        </ul>
        <h5 className={style.subTitle}>안전 및 품질 관리</h5>
        <ul className={style.list}>
          <li>선박 안전 기준 준수 및 품질 관리</li>
          <li>해상 안전 규정(ISM Code 등) 준수 확인</li>
        </ul>
        <h5 className={style.subTitle}>현장 감독 및 팀 관리</h5>
        <ul className={style.list}>
          <li>유지보수 및 수리 작업 감독</li>
          <li>작업팀과 협력하여 프로젝트를 실행</li>
        </ul>
      </div>

      <div className={style.box}>
        <h4>필수 역량</h4>
        <ul className={style.list}>
          <li>기계 및 전기 시스템 설계 및 분석 능력</li>
          <li>문제 해결 및 고장 진단 능력</li>
          <li>협업 및 커뮤니케이션 능력</li>
          <li>국제 규정(IMO, SOLAS) 및 기술 표준에 대한 이해</li>
        </ul>
      </div>

      <div className={style.box}>
        <h4>평균 연봉 및 시장 전망</h4>
        <h5 className={style.subTitle}>평균 연봉:</h5>
        <ul className={style.list}>
          <li>초급: 3,000만 원~4,000만 원</li>
          <li>중급: 5,000만 원~6,500만 원</li>
          <li>고급: 7,000만 원 이상</li>
        </ul>
        <h5 className={style.subTitle}>시장 전망:</h5>
        <ul className={style.list}>
          <li>해운 산업의 디지털 전환 및 친환경 선박 기술 수요 증가로 인해 선박 엔지니어의 역할은 더욱 중요해질 전망</li>
          <li>탄소 중립 및 지속 가능성 프로젝트로 인해 고급 엔지니어 수요가 꾸준히 증가</li>
        </ul>
      </div>

      <div className={style.box}>
        <h4>경력 단계별 가이드</h4>
        <select>
          <option>초급단계</option>
        </select>

        <ul className={style.guideList}>
          <li>
            <h4>필요한 역량과 스킬</h4>
            <ul className={style.list}>
              <li>기초 기계 공학 및 전기 공학 지식</li>
              <li>기초 설계 도구 활용 능력(AutoCAD, SolidWorks)</li>
              <li>문제 해결 및 데이터 분석 기초</li>
            </ul>
          </li>
          <li>
            <h4>수행업무</h4>
            <ul className={style.list}>
              <li>유지보수 작업 보조</li>
              <li>선박 기계 장치의 점검 및 기록</li>
              <li>기초 설계 및 보고서 작성</li>
            </ul>
          </li>
          <li>
            <h4>추천 교육 과정</h4>
            <ul className={style.list}>
              <li>기초 선박 공학 과정</li>
              <li>AutoCAD, SolidWorks 등 설계 소프트웨어 교육</li>
              <li>IMO 규정 및 SOLAS 기초 과정</li>
            </ul>
          </li>
          <li>
            <h4>마일스톤 목표</h4>
            <ul className={style.list}>
              <li>선박 기본 설계 프로젝트 참여</li>
              <li>설계 도구 자격증 취득</li>
              <li>정기 점검 작업에 능숙해지기</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className={style.box}>
        <h4>경력 로드맵과 마일스톤</h4>
        <ul className={`roadMapTab ${style.roadMapTab}`}>
          <li>
            <Link
              to="#"
              onClick={() => handleTargetTabClick("단기목표")}
              className={targetActiveTab === "단기목표" ? "active" : ""}
            >
              단기목표
            </Link>
          </li>
          <li>
            <Link to="#"
              onClick={() => handleTargetTabClick("중기목표")}
              className={targetActiveTab === "중기목표" ? "active" : ""}
            >중기목표</Link>
          </li>
          <li>
            <Link to="#"
              onClick={() => handleTargetTabClick("장기목표")}
              className={targetActiveTab === "장기목표" ? "active" : ""}
            >장기목표</Link>
          </li>
        </ul>

        {
          targetActiveTab === "단기목표" && (
            <>
              <h3 style={{ marginBottom: "30px" }}>
                단기목표
              </h3>
              <ul className={`roadmapList01 ${style.roadmapList01}`}>
                <li>
                  <Link to="/">초급</Link>
                  <ul className={`roadmapList02 ${style.roadmapList02}`}>
                    <li>
                      <Link to="/">기술학습</Link>
                      <ul className={style.roadmapList03}>
                        <li>설계 도구 자격증 취득(AutoCAD Certified User 등)</li>
                        <li>선박 엔진과 전기 시스템 기본 구조 이해</li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/">실무경험</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/">중급</Link>
                </li>
                <li>
                  <Link to="/">고급</Link>
                </li>
              </ul>
            </>
          )
        }

        {
          targetActiveTab === "중기목표" && (
            <>
              <h3 style={{ marginBottom: "30px" }}>
                중기목표
              </h3>
              <ul className={`roadmapList01 ${style.roadmapList01}`}>
                <li>
                  <Link to="/">초급</Link>
                  <ul className={`roadmapList02 ${style.roadmapList02}`}>
                    <li>
                      <Link to="/">기술학습</Link>
                      <ul className={style.roadmapList03}>
                        <li>설계 도구 자격증 취득(AutoCAD Certified User 등)</li>
                        <li>선박 엔진과 전기 시스템 기본 구조 이해</li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/">실무경험</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/">중급</Link>
                </li>
                <li>
                  <Link to="/">고급</Link>
                </li>
              </ul>
            </>
          )
        }

        {
          targetActiveTab === "장기목표" && (
            <>
              <h3 style={{ marginBottom: "30px" }}>
                장기목표
              </h3>
              <ul className={`roadmapList01 ${style.roadmapList01}`}>
                <li>
                  <Link to="/">초급</Link>
                  <ul className={`roadmapList02 ${style.roadmapList02}`}>
                    <li>
                      <Link to="/">기술학습</Link>
                      <ul className={style.roadmapList03}>
                        <li>설계 도구 자격증 취득(AutoCAD Certified User 등)</li>
                        <li>선박 엔진과 전기 시스템 기본 구조 이해</li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/">실무경험</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/">중급</Link>
                </li>
                <li>
                  <Link to="/">고급</Link>
                </li>
              </ul>
            </>
          )
        }

      </div>

      <div className={style.box}>
        <div className={style.story}>
          <h4>성공사례</h4>
          <img src={Story_Img} alt="" />
          <h5>선박엔지니어 김현우님의 성공이야기</h5>
          <p>
            김현우님(35)은 대학 시절 기계공학을 전공하며 막연히 자동차나 항공 분야에 진출할 것을 꿈꿨습니다. 하지만 졸업 직전, 해운 산업에 대해 배우게 되면서 선박의 기계와 전기 시스템을 설계하는 일에 흥미를 느끼게 됩니다. “친환경 선박 기술이 각광받고 있다는 걸 알게 된 게 결정적이었어요. 앞으로 중요한 산업이 될 거라고 확신했습니다.” <br />
            그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다.
            입사 초기, 그는 선박 유지보수 팀에 배치되어 주로 소형 화물선의 엔진 설계 보조와 정기 점검 업무를 맡았습니다. "당시엔 모든 게 새로웠고, 선박 시스템의 복잡함에 매일 놀랐죠." 현우님은 주어진 작업을 수행하며 AutoCAD와 SolidWorks 같은 설계 도구를 익히고, 유지보수 프로세스의 기초를 배웠습니다. <br />
            첫 프로젝트는 노후 선박의 엔진 효율 개선 작업이었습니다. 설계 보조 역할을 맡은 그는 베테랑 팀원들의 지도 아래, 효율적인 냉각 시스템 설계에 성공적으로 기여했습니다. “작은 역할이었지만, 제 아이디어가 실제로 선박 개선에 쓰이는 걸 보고 큰 자부심을 느꼈어요.” <br />
            이후 그는 선박 기초 설계와 유지보수 점검 업무에서 3년간 경험을 쌓으며, 기본적인 역량을 다지는 데 집중했습니다.
          </p>
        </div>
      </div>
    </>
  );

  // 탭별 제목 설정
  const renderTabTitle = () => {
    if (activeTab === "직무정보") return <h3 style={{ marginBottom : "30px"}}>직무정의</h3>;
    if (activeTab === "경력단계") return <h3 style={{ marginBottom : "30px"}}>경력단계</h3>;
    if (activeTab === "로드맵") return <h3 style={{ marginBottom : "30px"}}>로드맵</h3>;
    if (activeTab === "성공사례") return <h3 style={{ marginBottom : "30px"}}>성공사례</h3>;
  };

  return (
    <Main className="subWrap">
      <div className={`careerBox ${style.careerDetailBox}`}>
        <Container className="container">
          <div className="careerContent">
            <div className={style.careerDetailTop}>
              <div className={style.imgBox}>
                <img src={Career_Img01} alt="" />
              </div>
              <h3>선박엔지니어</h3>
              <ArrowPrevButton
                customClass={style.arrowPrevBtn}
                href="/career"
                hiddenText="커리어탐색 화면으로 이동"
              />
            </div>

            <div className={style.layoutBox}>
              <ul className={style.careerDetailTab}>
                <li>
                  <Link
                    to="#"
                    className={activeTab === "직무정보" ? style.active : ""}
                    onClick={() => handleTabClick("직무정보")}
                  >
                    직무정의
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className={activeTab === "경력단계" ? style.active : ""}
                    onClick={() => handleTabClick("경력단계")}
                  >
                    경력단계
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className={activeTab === "로드맵" ? style.active : ""}
                    onClick={() => handleTabClick("로드맵")}
                  >
                    로드맵
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className={activeTab === "성공사례" ? style.active : ""}
                    onClick={() => handleTabClick("성공사례")}
                  >
                    성공사례
                  </Link>
                </li>
              </ul>

              <div className={style.careerDetailContent}>
                {renderTabTitle()}
                {commonContent}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}

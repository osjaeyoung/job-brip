import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import { useState } from "react";
import SubSearch from "../components/SubSearch";
import { employmentTabData } from "../data/employmentTabData";
import { jobPostingsData } from "../data/jobPostingsData";

export default function EmploymentPage() {
  const [activeTab, setActiveTab] = useState("지역별");
  const [activeRegion, setActiveRegion] = useState(null); // 대지역 선택 상태
  const [activeSubRegions, setActiveSubRegions] = useState([]); // 소지역 선택 상태
  const [selectedFilters, setSelectedFilters] = useState({
    지역별: [],
    직무별: [],
    경력별: [],
    근무형태: [],
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [searchTerm, setSearchTerm] = useState(""); // 직무 검색어 상태

  // 탭 클릭 시 필터 변경 (지역 상태 유지)
  const handleTabClick = (tab) => {
    if (tab !== "지역별") {
      setActiveTab(tab); // 다른 탭 선택 시 activeTab만 변경
    } else {
      setActiveTab(tab); // "지역별" 탭으로 돌아오면 activeTab만 변경
      // activeRegion과 activeSubRegions는 초기화하지 않음
    }
  };


  // 대지역 클릭 시 해당 소지역 표시
  const handleRegionClick = (region) => {
    setActiveRegion(region);
    setActiveSubRegions([]); // 대지역 클릭 시 소지역 초기화
  };

  // 소지역 선택/해제
  const handleSubRegionSelection = (subRegion) => {
    setActiveSubRegions((prev) =>
      prev.includes(subRegion)
        ? prev.filter((item) => item !== subRegion) // 선택 해제
        : [...prev, subRegion] // 선택
    );
  };

  // 선택된 필터 항목을 상태에 반영
  const handleFilterSelection = (filterType, filterId) => {
    setSelectedFilters((prev) => {
      const newFilters = prev[filterType].includes(filterId)
        ? prev[filterType].filter((id) => id !== filterId) // 이미 선택되었으면 해제
        : [...prev[filterType], filterId]; // 선택되지 않았다면 추가
      return { ...prev, [filterType]: newFilters };
    });
  };

  // activeTab에 맞는 데이터 제공
  function getFilterData() {
    const tabData = employmentTabData.find((tab) => tab.id === activeTab);
    return tabData ? tabData.data : [];
  }

  // 검색어 상태 변경 함수
  const handleSearch = (term) => {
    setSearchTerm(term); // 검색어 상태 업데이트
  };

  // 필터링된 데이터 (지역별, 직무별, 경력별, 근무형태 모두 고려)
  const filteredJobPostings = jobPostingsData.filter((posting) => {
    // 지역 필터링
    const matchesRegion =
      selectedFilters.지역별.length === 0 ||
      selectedFilters.지역별.some((region) => posting.location.includes(region));

    // 직무 필터링
    const matchesJobType =
      selectedFilters.직무별.length === 0 ||
      selectedFilters.직무별.some((job) => posting.title.toLowerCase().includes(job.toLowerCase()));

    // 경력 필터링
    const matchesExperience =
      selectedFilters.경력별.length === 0 ||
      selectedFilters.경력별.some((experience) => {
        return posting.experience && posting.experience.toLowerCase().includes(experience.toLowerCase());
      });

    // 근무형태 필터링
    const matchesEmploymentType =
      selectedFilters.근무형태.length === 0 ||
      selectedFilters.근무형태.some((employmentType) => posting.employmentType.toLowerCase().includes(employmentType.toLowerCase()));

    // 직무 검색어 매칭
    const matchesSearchTerm =
      searchTerm === "" || posting.title.toLowerCase().includes(searchTerm.toLowerCase());

    // 모든 조건이 맞으면 true 반환
    return (
      matchesRegion &&
      matchesJobType &&
      matchesExperience &&
      matchesEmploymentType &&
      matchesSearchTerm
    );
  });

  // 지역 필터링
  const applyRegionFilter = (posting) => {
    if (activeRegion) {
      const regionMatch = posting.location.includes(activeRegion.name);
      const subRegionMatch = activeSubRegions.some((subRegion) =>
        posting.location.includes(subRegion)
      );
      return regionMatch && (activeSubRegions.length === 0 || subRegionMatch);
    }
    return true;
  };

  // 필터된 채용공고
  const jobPostingsToDisplay = filteredJobPostings.filter((posting) => {
    return applyRegionFilter(posting);
  });

  // 선택 초기화 함수
  const handelReset = () => {
    setActiveRegion(null); // 대지역 초기화
    setActiveSubRegions([]); // 소지역 초기화
    setSelectedFilters({
      지역별: [],
      직무별: [],
      경력별: [],
      근무형태: [],
    }); // 모든 필터 초기화
    setSearchTerm(""); // 직무 검색어 초기화
  };

  console.log("Filtered Job Postings:", jobPostingsToDisplay); // 필터링된 채용공고 확인

  return (
    <Main className="subWrap">
      <div className="employmentBox">
        <div className="subBox">
          <h3>채용공고</h3>
          <p>최신 채용공고와 맞춤 커리어</p>
        </div>

        <div className="employmentContent">
          <Container className="container">
            <SubSearch onSearch={handleSearch} />

            <div className="employmentInfoList">
              <div className="tabContainer">
                <div className="tabBox">
                  {employmentTabData.map((tab) => (
                    <div className="box" key={tab.id}>
                      <button
                        className={`tabBtn ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => handleTabClick(tab.id)}
                      >
                        {tab.id}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="tabContentBox">

                  {activeTab === "지역별" && (
                    <div className="tabContent">
                      <div className="regionBox">
                        <div className="regionList">
                          {getFilterData().map((region) => (
                            <button
                              key={region.id}
                              className={`button ${activeRegion === region ? "active" : ""}`}
                              onClick={() => handleRegionClick(region)}
                            >
                              {region.name}
                            </button>
                          ))}
                        </div>

                        {activeRegion && (
                          <div className="subRegionList">
                            {activeRegion.subLocations.map((subRegion) => (
                              <div key={subRegion.id} className="subRegionBox">
                                <button
                                  className={`button ${activeSubRegions.includes(subRegion.id) ? "active" : ""}`}
                                  onClick={() => handleSubRegionSelection(subRegion.id)}
                                >
                                  {subRegion.name}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "직무별" && (
                    <div className="tabContent">
                      <div className="box">
                        {getFilterData().map((jobType) => (
                          <button
                            key={jobType.id}
                            className={`button ${selectedFilters.직무별.includes(jobType.id) ? "active" : ""}`}
                            onClick={() => handleFilterSelection("직무별", jobType.id)}
                          >
                            {jobType.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "경력별" && (
                    <div className="tabContent">
                      <div className="box">
                        {getFilterData().map((experience) => (
                          <button
                            key={experience.id}
                            className={`button ${selectedFilters.경력별.includes(experience.id) ? "active" : ""}`}
                            onClick={() => handleFilterSelection("경력별", experience.id)}
                          >
                            {experience.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "근무형태" && (
                    <div className="tabContent">
                      <div className="box">
                        {getFilterData().map((employmentType) => (
                          <button
                            key={employmentType.id}
                            className={`button ${selectedFilters.근무형태.includes(employmentType.id) ? "active" : ""}`}
                            onClick={() => handleFilterSelection("근무형태", employmentType.id)}
                          >
                            {employmentType.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              <div className="resetBtnBox">
                <button className="resetBtn" onClick={handelReset}>
                  <span>선택 초기화</span>
                </button>
              </div>

              {/* 필터링된 채용 공고 리스트 출력 */}
              <div className="employmentList">
                {jobPostingsToDisplay.length > 0 ? (
                  jobPostingsToDisplay.map((posting) => (
                    <div className="box" key={posting.id}>
                      <div className="companyBox">{posting.company}</div>
                      <div className="titleBox">
                        <Link to="/employmentdetail">
                          <h4>{posting.title}</h4>
                        </Link>
                        <ul className="infoList">
                          <li>{posting.experience}</li>
                          <li>{posting.education}</li>
                          <li>{posting.employmentType}</li>
                          <li>{posting.location}</li>
                          <li>{posting.deadline}</li>
                        </ul>
                      </div>

                      {isLoggedIn && (
                        <>
                          <button>{posting.isLiked ? "좋아요 취소" : "좋아요"}</button>
                          <button>{posting.isApplied ? "지원완료" : "즉시지원"}</button>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>검색된 채용공고가 없습니다.</p>
                )}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </Main>
  );
}

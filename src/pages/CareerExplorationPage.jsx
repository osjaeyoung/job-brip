import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Main from "../components/layout/Main";
import Container from "../components/Container";
import Pagination from "../components/Pagination";
import SubSearch from "../components/SubSearch";
import style from "./CareerExplorationPage.module.css";
import { shippingIndustryData } from "../data/shippingIndustryData";

export default function CareerExplorationPage() {
  const [activeTab, setActiveTab] = useState("해운산업");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [sortOption, setSortOption] = useState("가나다순");
  const [jobsPerPage, setJobsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드 상태

  // 탭 클릭 시 해당 탭 활성화
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 직무 선택 시 active 클래스 추가/삭제
  const handleSelectActive = (jobId) => {
    setSelectedJobs((prevSelectedJobs) => {
      if (prevSelectedJobs.includes(jobId)) {
        return prevSelectedJobs.filter((id) => id !== jobId);
      }
      return [...prevSelectedJobs, jobId];
    });
  };

  // 선택된 산업의 데이터 찾기
  const selectedIndustryData = shippingIndustryData.find(
    (industry) => industry.id === activeTab
  );

  // 선택 초기화
  const handleResetSelection = () => {
    setSelectedJobs([]);
  };

  // 정렬 옵션 변경 시 처리
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // 페이지 수 조정 시 처리
  const handleJobsPerPageChange = (e) => {
    setJobsPerPage(Number(e.target.value));
    setCurrentPage(1); // 페이지 수 변경 시 첫 페이지로 이동
  };

  // 페이지 변경 시 처리
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 검색어 상태 변경
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 직무 목록 정렬
  const sortJobs = (jobs) => {
    let sortedJobs = [...jobs];
    if (sortOption === "가나다순") {
      sortedJobs.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "연봉높은순") {
      sortedJobs.sort((a, b) => b.avgSalary - a.avgSalary);
    } else if (sortOption === "연봉낮은순") {
      sortedJobs.sort((a, b) => a.avgSalary - b.avgSalary);
    }
    return sortedJobs;
  };

  // 직무 데이터 필터링 및 정렬
  useEffect(() => {
    if (selectedIndustryData) {
      let jobs = selectedIndustryData.jobs;

      // 검색어로 필터링
      if (searchKeyword.trim() !== "") {
        jobs = jobs.filter((job) =>
          job.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      // 필터링 후 정렬
      jobs = sortJobs(jobs);

      setFilteredJobs(jobs);
      setTotalJobs(jobs.length);
    }
  }, [activeTab, selectedIndustryData, sortOption, searchKeyword]);

  // 페이지네이션 처리
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <Main className="subWrap">
      <div className="careerBox">
        <div className="subBox">
          <h3>커리어탐색</h3>
          <p>커리어 성장을 위한 직무 정보와 맞춤형 가이드</p>
        </div>

        <Container className="container">
          <div className="careerBoxContent">
            {/* 검색 입력 필드 */}
            <SubSearch onSearch={handleSearch} />

            {/* 탭 메뉴 */}
            <div className="tabContainer">
              <div className="tabBox">
                {shippingIndustryData.map((tab) => (
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

              {/* 탭 콘텐츠 */}
              <div className="tabContentBox">
                {selectedIndustryData && (
                  <div className="tabContent">
                    <div className="box">
                      {selectedIndustryData.jobs.map((job) => (
                        <button
                          key={job.id}
                          className={`button ${selectedJobs.includes(job.id) ? "active" : ""}`}
                          onClick={() => handleSelectActive(job.id)}
                        >
                          {job.name} {/* 직무 이름 */}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 선택 초기화 버튼 */}
            <div className="resetBtnBox">
              <button className="resetBtn" onClick={handleResetSelection}>
                <span>선택 초기화</span>
              </button>
            </div>

            {/* 리스트 건수 표시 */}
            <div className={style.selectBox}>
              <span className={style.length}>총 {totalJobs}건</span>
              <label htmlFor="select" className="blind">
                정렬
              </label>
              <select id="select" className={style.select} onChange={handleSortChange} value={sortOption}>
                <option value="가나다순">가나다순</option>
                <option value="연봉높은순">연봉 높은 순</option>
                <option value="연봉낮은순">연봉 낮은 순</option>
              </select>
            </div>

            {/* 직무 정보 테이블 */}
            {
              filteredJobs.length > 0 ? (<div className={style.tableBox}>
                <table className={style.table}>
                  <caption className="blind">직무정보</caption>
                  <colgroup>
                    <col style={{ width: "70px" }} />
                    <col style={{ width: "90px" }} />
                    <col style={{ width: "180px" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "100px" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>산업</th>
                      <th>직무명</th>
                      <th>직무정보</th>
                      <th>평균연봉</th>
                      <th>시장전망</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentJobs.map((job, index) => (
                      <tr key={job.id}>
                        <td>{index + 1}</td>
                        <td>{activeTab}</td>
                        <td>{job.name}</td>
                        <td className="textLeft title">
                          <Link to="/careerexplorationdetail">{job.description}</Link>
                        </td>
                        <td>{job.avgSalary}</td>
                        <td>
                          <span className={job.marketOutlook === "매우좋음" ? "veryGood" : job.marketOutlook === "좋음" ? "good" : "commonly"}>
                            {job.marketOutlook}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>) : (
                <div className={style.tableBox}>
                  <table className={style.table}>
                    <caption className="blind">직무정보</caption>
                    <colgroup>
                      <col style={{ width: "70px" }} />
                      <col style={{ width: "90px" }} />
                      <col style={{ width: "180px" }} />
                      <col style={{ width: "auto" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "100px" }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>NO</th>
                        <th>산업</th>
                        <th>직무명</th>
                        <th>직무정보</th>
                        <th>평균연봉</th>
                        <th>시장전망</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6}>
                          검색결과가 없습니다
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            }


            {/* 페이지 수 조정 드롭다운 */}
            <div className={style.pageSelectBox}>
              <label htmlFor="pageSelect" className="blind">
                페이지수 조정
              </label>
              <select id="pageSelect" className={style.pageSelect} onChange={handleJobsPerPageChange} value={jobsPerPage}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          {/* 페이지네이션 */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Container>
      </div>
    </Main>
  );
}

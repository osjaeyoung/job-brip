import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../assets/images/sub/Calendar_Icon.svg";
import { supportStatus } from "../data/supportStatus.js";  // 데이터를 불러옵니다.

import style from "./ApplyPage.module.css";

export default function ApplyPage() {

  // 날짜 상태 설정 (2025.01.01 ~ 2025.02.28)
  const [startDate, setStartDate] = useState(new Date("2025-01-01"));
  const [endDate, setEndDate] = useState(new Date("2025-02-28"));
  const [filteredList, setFilteredList] = useState([]);  // 필터링된 리스트
  const [stats, setStats] = useState({
    completed: 0,   // 지원완료
    viewed: 0,      // 열람
    notViewed: 0,   // 미열람
    cancelled: 0,   // 지원취소
  });  // 상태 통계

  // 날짜 범위에 맞는 데이터 필터링 (2개만 나오게 필터링)
  useEffect(() => {
    const filtered = supportStatus.applicationList.filter((item) => {
      const applicationDate = new Date(item.applicationDate);

      // 시작일과 종료일을 00:00:00으로 설정하여 비교
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);  // 시작일: 시간 부분을 00:00:00으로 설정

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);  // 종료일: 시간 부분을 23:59:59로 설정

      return applicationDate >= start && applicationDate <= end;
    });

    // 날짜 필터링 후 2개만 출력
    setFilteredList(filtered.slice(0, 2));
  }, [startDate, endDate]);

  // 지원 상태별 카운트 계산
  useEffect(() => {
    const counts = { completed: 0, viewed: 0, notViewed: 0, cancelled: 0 };

    // 필터링된 리스트를 순차적으로 돌면서 상태를 카운트합니다.
    filteredList.forEach((item) => {
      switch (item.applicationStatus) {
        case "지원완료":
          counts.completed++;
          break;
        case "열람":
          counts.viewed++;
          break;
        case "미열람":
          counts.notViewed++;
          break;
        case "지원취소":
          counts.cancelled++;
          break;
        default:
          break;
      }
    });

    setStats(counts);
  }, [filteredList]);

  // 지원내역삭제 처리
  const handleRemoveApplication = (itemIndex) => {
    const confirmed = window.confirm("해당 지원 내역을 삭제하시겠습니까?");
    if (confirmed) {
      const updatedList = filteredList.filter((_, index) => index !== itemIndex);
      setFilteredList(updatedList);
    }
  };

  // 지원취소 처리
  const handleCancelApplication = (itemIndex) => {
    const confirmed = window.confirm("지원 취소 확인. 취소하시겠습니까?");
    if (confirmed) {
      const updatedList = [...filteredList];
      updatedList[itemIndex].applicationStatus = "지원취소"; // 상태를 '지원취소'로 업데이트
      setFilteredList(updatedList);
    }
  };

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
                <Link to="/interest">
                  <span>관심공고</span>
                </Link>
                <Link to="/resume">
                  <span>이력서관리</span>
                </Link>
                <Link to="/apply" className="active">
                  <span>지원현황</span>
                </Link>
                <Link to="/activity">
                  <span>내 활동</span>
                </Link>
              </aside>

              <div className="content">
                <h4 className="title">지원현황</h4>
                <p className="subTitle">내가 지원한 채용 공고의 진행 상황을 한눈에 확인하세요</p>

                <div className="datepickerBox">
                  <div className="box">
                    <label htmlFor="datepicker01">
                      <DatePicker
                        id="datepicker01"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                      <img src={CalendarIcon} alt="달력아이콘" />
                    </label>
                  </div>
                  <span>~</span>
                  <div className="box">
                    <label htmlFor="datepicker02">
                      <DatePicker
                        id="datepicker02"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                      />
                      <img src={CalendarIcon} alt="달력아이콘" />
                    </label>
                  </div>
                </div>

                <ul className={style.infoList}>
                  <li>
                    <span>지원완료</span>
                    <em>{stats.completed}</em>
                  </li>
                  <li>
                    <span>열람</span>
                    <em>{stats.viewed}</em>
                  </li>
                  <li>
                    <span>미열람</span>
                    <em>{stats.notViewed}</em>
                  </li>
                  <li>
                    <span>지원취소</span>
                    <em>{stats.cancelled}</em>
                  </li>
                </ul>

                <ul className={style.applyList}>
                  {filteredList.map((item, index) => (
                    <li key={index}>
                      <Link to="/employmentdetail" className={style.topBox}>
                        <span className={style.receipt}>접수마감</span>
                        <div className={style.textBox}>
                          <em>{item.companyName}</em>
                          <h5>{item.jobTitle}</h5>
                        </div>
                      </Link>
                      <div className={style.dateBox}>
                        <span>지원일</span>
                        <em className={style.date}>{item.applicationDate}</em>
                        <span className={style.viewingDate}>
                          {item.viewDate ? `열람 ${item.viewDate}` : "열람 안함"}
                        </span>
                      </div>

                      {/* 지원내역 삭제 버튼 */}
                      {(item.applicationStatus === "열람" || item.applicationStatus === "지원취소") && (
                        <button className={style.delBtn} onClick={() => handleRemoveApplication(index)}>
                          지원내역삭제
                        </button>
                      )}

                      {/* 지원취소 버튼 */}
                      {item.applicationStatus === "미열람" && (
                        <button className={style.delBtn} onClick={() => handleCancelApplication(index)}>
                          지원취소
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}

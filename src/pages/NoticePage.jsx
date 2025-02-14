import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import Table from "../components/Table";
import { noticeData } from "../data/noticeData";
import { useState } from "react";
import style from "./NoticePage.module.css";

export default function NoticePage() {

  const [data] = useState(noticeData);
  const [sortOrder, setSortOrder] = useState("최신순");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const filteredData = data.filter((filterData) => {
    const titleMatches = filterData.title
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    const contentMatches = filterData.content
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());

    return titleMatches || contentMatches;
  });

  const handleChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === "최신순") {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  return (
    <Main className="subWrap bg">
      <div className="noticeBox">
        <Container className="lnbContainer">
          <div className="noticeContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice" className="active">
                  <span>공지사항</span>
                </Link>
                <Link to="/faq">
                  <span>FAQ</span>
                </Link>
                <Link to="/inquiry">
                  <span>1:1 문의</span>
                </Link>
                <Link to="/terms">
                  <span>이용약관</span>
                </Link>
                <Link to="/policy">
                  <span>개인정보처리방침</span>
                </Link>
              </aside>

              <div className="content">
                <div className="topBox">
                  <h4>공지사항</h4>
                  <div className="searchBox">
                    <div className="search">
                      <label htmlFor="search" className="blind">
                        검색
                      </label>
                      <input
                        id="search"
                        placeholder="키워드를 검색해주세요."
                        value={searchKeyword}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div className="selectBox">
                      <label htmlFor="select" className="blind">
                        최신순, 오래된 순 선택
                      </label>
                      <select
                        id="select"
                        className="select"
                        value={sortOrder}
                        onChange={handleChange}
                      >
                        <option value="최신순">최신순</option>
                        <option value="오래된 순">오래된 순</option>
                      </select>
                    </div>
                  </div>
                </div>

                {sortedData.length === 0 ? (
                  "검색결과가 없습니다."
                ) : (
                  <Table
                    href="/noticedetail"
                    filteredData={sortedData}
                    className={`${style.tableBox}`}
                    textClassName="textLeft ellipsisText"
                    columns={["NO.", "구분", "제목", "등록일"]}
                    colgroup={(
                      <>
                        <col style={{ width: "90px" }} />
                        <col style={{ width: "100px" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "150px" }} />
                      </>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}

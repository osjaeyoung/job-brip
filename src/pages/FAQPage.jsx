import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import { faqData } from "../data/faqData";
import { useState } from "react";
import style from "./FAQPage.module.css";

export default function FAQPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("전체");
  const [openedFaqs, setOpenedFaqs] = useState({});

  function handleTabClick(category) {
    setActiveTab(category);
  };

  function toggleAnswer(id) {
    setOpenedFaqs((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  function handleSearchChange(e) {
    setSearchKeyword(e.target.value);
  }

  // 필터링된 FAQ 데이터
  const filteredData = Object.keys(faqData).reduce((result, category) => {
    // "전체" 카테고리일 경우 모든 카테고리에서 검색
    if (activeTab === "전체" || activeTab === category) {
      const filteredFaqs = faqData[category].filter((faq) => {
        const questionFilter = faq.question
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        const answerFilter = faq.answer
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        return questionFilter || answerFilter;
      });

      if (filteredFaqs.length > 0) {
        result[category] = filteredFaqs;
      }
    }
    return result;
  }, {});

  return (
    <Main className="subWrap bg">
      <div className="faqBox">
        <Container className="lnbContainer">
          <div className="fqaContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice">
                  <span>공지사항</span>
                </Link>
                <Link to="/faq" className="active">
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
                  <h4>FAQ</h4>
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
                  </div>
                </div>

                <div className={style.faqTabBox}>
                  {/* "전체" 탭 추가 */}
                  <button
                    key="전체"
                    className={activeTab === "전체" ? `${style.active}` : ""}
                    onClick={() => handleTabClick("전체")}
                  >
                    전체
                  </button>
                  {/* "전체" 제외하고 카테고리 출력 */}
                  {Object.keys(faqData).map((category) => category !== "전체" && (
                    <button
                      key={category}
                      className={activeTab === category ? `${style.active}` : ""}
                      onClick={() => handleTabClick(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className={style.faqContentBox}>
                  {
                    Object.keys(filteredData).length === 0 ? "검색결과가 없습니다." : (
                      Object.keys(filteredData).map((category) => (
                        <div key={category}>
                          <h3 className={style.categoryTitle}>{category}</h3>
                          {filteredData[category].map((faq) => (
                            <div key={faq.id} className={style.faqContent}>
                              <h4>
                                <button
                                  className={`${style.btn} ${openedFaqs[faq.id] ? `${style.active}` : ""}`}
                                  onClick={() => toggleAnswer(faq.id)}
                                >
                                  {faq.question}
                                </button>
                              </h4>
                              {openedFaqs[faq.id] && <p>{faq.answer}</p>}
                            </div>
                          ))}
                        </div>
                      ))
                    )
                  }

                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}

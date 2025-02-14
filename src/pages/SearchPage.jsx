import Card from "../components/Card";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import style from "./SearchPage.module.css";
import "../styles/style.css";
import Guide02 from "../assets/images/main/Guide_Icon02.svg";
import Guide03 from "../assets/images/main/Guide_Icon03.svg";
import Guide04 from "../assets/images/main/Guide_Icon04.svg";
import CardImg02 from "../assets/images/main/Card_Img02.png";
import CardImg03 from "../assets/images/main/Card_Img03.png";
import CardImg06 from "../assets/images/main/Card_Img06.png";
import CardImg07 from "../assets/images/main/Card_Img07.png";
import BgCard from "../components/BgCard";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchPage() {

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');  // 쿼리 파라미터에서 searchQuery 가져오기
    if (query) {
      setSearchQuery(query);  // 검색어가 있으면 상태 업데이트
    }
  }, [location.search]);  // location.search가 변경될 때마다 실행

  return (
    <>
      <Main className="subWrap">

        <div className={style.searchBox}>
          <Container>
            <div className={style.searchContent}>
              <div className={style.searchTop}>
                <h3>
                  검색결과
                </h3>
                <p>
                  <strong>"{searchQuery}"</strong>에 대한 검색결과입니다.
                </p>
              </div>

              <div className={style.searchResultBox}>
                <em className={style.searchResultText}>
                  채용 <span>23</span>
                </em>

                <div className={`cardContainer ${style.searchResultList}`}>
                  <Card
                    className="cardType"
                    text="씨아이지해운(주)"
                    title="해운항만물류 실무와 사례
                특강"
                    imgSrc={CardImg02}
                    subText="~01.15(수)"
                  >
                  </Card>

                  <Card
                    className="cardType"
                    text="씨아이지해운(주)"
                    title="해운항만물류 실무와 사례
                특강"
                    imgSrc={CardImg03}
                    subText="~01.15(수)"
                  >
                  </Card>

                  <Card
                    className="cardType"
                    text="씨아이지해운(주)"
                    title="해운항만물류 실무와 사례
                특강"
                    imgSrc={CardImg02}
                    subText="~01.15(수)"
                  >
                  </Card>

                  <Card
                    className="cardType"
                    text="씨아이지해운(주)"
                    title="해운항만물류 실무와 사례
                특강"
                    imgSrc={CardImg03}
                    subText="~01.15(수)"
                  >
                  </Card>

                </div>

              </div>

              <div className={style.searchResultBox}>
                <em className={style.searchResultText}>
                  커리어 <span>23</span>
                </em>

                <div className={`cardContainer ${style.searchResultList}`}>
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례 특강"
                    imgSrc={CardImg06}
                    subText="데이터리안"
                  />
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례 특강"
                    imgSrc={CardImg07}
                    subText="데이터리안"
                  />
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례 특강"
                    imgSrc={CardImg07}
                    subText="데이터리안"
                  />
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례 특강"
                    imgSrc={CardImg07}
                    subText="데이터리안"
                  />
                </div>

              </div>

              <div className={style.searchResultBox}>
                <em className={style.searchResultText}>
                  직무<span>23</span>
                </em>
                <div className={`cardContainer cardContainerSt ${style.searchResultList}`}>
                  <BgCard
                    bg={{ backgroundColor: '#FFD3EB' }}
                    imgBg={{ backgroundColor: '#CCE7FE' }}
                    imgSrc={Guide03}
                    title="해상 여객운송 관리자"
                  />
                  <BgCard
                    bg={{ backgroundColor: '#CCE7FE' }}
                    imgBg={{ backgroundColor: '#F6F0B3' }}
                    imgSrc={Guide02}
                    title="해상 여객운송 관리자"
                  />
                  <BgCard
                    bg={{ backgroundColor: '#FFD3EB' }}
                    imgBg={{ backgroundColor: '#CCE7FE' }}
                    imgSrc={Guide03}
                    title="해상 여객운송 관리자"
                  />
                  <BgCard
                    bg={{ backgroundColor: '#FFEEA6' }}
                    imgBg={{ backgroundColor: '#5E5C5C' }}
                    imgSrc={Guide04}
                    title="해상 여객운송 관리자"
                  />
                </div>
              </div>

            </div>
          </Container>
        </div>

      </Main>
    </>
  )

}
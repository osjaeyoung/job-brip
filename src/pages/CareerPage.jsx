import Main from "../components/layout/Main";
import Container from "../components/Container";
import style from "./CareerPage.module.css";
import Slider from "react-slick";
import CareerImg from "../assets/images/sub/career_img.png";
import { educationData } from "../data/educationData";
import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "../components/Card";

export default function CareerPage() {

  const [activeTab, setActiveTab] = useState("직무/직군");

  const handleTabClick = (tab) => {
    setActiveTab(tab); // 클릭한 탭을 활성화
  };
  // 슬릭 설정
  const settings = {
    variableWidth: true,
    dots: false,  // 페이지네이션 표시 여부
    infinite: true,  // 무한 루프 여부
    slidesToShow: 1,  // 한 번에 보여줄 슬라이드 수
    slidesToScroll: 1,  // 한 번에 스크롤할 슬라이드 수
    centerMode: true,
    centerPadding: 0,
    autoPlay: true,  // 자동으로 슬라이드 이동
    autoplaySpeed: 2000,  // 2초마다 슬라이드 이동
    responsive: [
      {
        breakpoint: 767, // 화면 너비가 767px 이하일 때
        settings: {
          variableWidth: false,  // `767px` 이하에서 가변 너비를 해제
          centerMode: false,  // `767px` 이하에서 centerMode 해제
          slidesToShow: 1,  // 한 번에 보여줄 슬라이드 수를 1로 설정
        }
      }
    ]
  };

  return (
    <Main className="subWrap">
      <div className="careerBox">
        <div className="subBox">
          <h3>커리어 교육</h3>
          <p>직무에 필요한 필수 역량 교육</p>
        </div>

        <div className={style.careerSlideBox}>
          <Slider {...settings}>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
          </Slider>
        </div>


        <div className="careerBoxContent">

          <div className={style.tabBox}>
            {["직무/직군", "기술/역량", "전문과정", "자격증", "워크숍"].map((tab) => {
              return (
                <button
                  key={tab}
                  className={`${style.button} ${activeTab === tab ? style.active : ""}`}
                  onClick={() => handleTabClick(tab)}>
                  {tab}
                </button>
              )
            }
            )}
          </div>

          <div className={style.cardList}>
            {educationData[activeTab]?.map((data, index) => (

              <Card
                href="/careerdetail"
                key={index}
                text={activeTab}
                title={data.title}
                imgSrc={data.imgSrc}
                subText={data.subText}
                className="careerCardBox"
              />

            ))}
          </div>

        </div>







      </div>
    </Main>
  );
}

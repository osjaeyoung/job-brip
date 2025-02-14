import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import Card from "../components/Card";
import { announcementData } from "../data/announcementData";
import { useState } from "react";
import style from "./InterestPage.module.css";

export default function InterestPage() {

  const [announcements, setAnnouncements] = useState(announcementData);

  const handleLikeToggle = (id) => {
    setAnnouncements(prevAnnouncements =>
      prevAnnouncements.map(announcement =>
        announcement.id === id
          ? { ...announcement, isLiked: !announcement.isLiked }
          : announcement
      )
    );
  };

  return (
    <Main className="subWrap bg">

      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">

            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage">
                  <span>
                    프로필
                  </span>
                </Link>
                <Link to="/interest" className="active"><span>관심공고</span></Link>
                <Link to="/resume"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className="content">

                <h4 className="title">
                  나의공고
                </h4>

                <p className="subTitle">
                  저장한 채용 공고로 커리어 계획을 세워보세요
                </p>

                <div className={style.cardList}>
                  {
                    announcements.slice(0, 6).map((data) => {
                      return (
                        <Card
                          href="/employmentdetail"
                          key={data.id}
                          className="cardType"
                          text={data.text}
                          imgSrc={data.imgSrc}
                          title={data.title}
                          date={data.subText}
                          isLiked={data.isLiked}
                          handleLikeToggle={() => handleLikeToggle(data.id)}
                        />
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}
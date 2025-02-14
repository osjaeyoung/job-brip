import { Link, useParams } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import Button from "../components/Button";
import { noticeData } from "../data/noticeData";
import style from "./NoticeDetailPage.module.css";

export default function NoticeDetailPage() {

  const { id } = useParams();

  const notice = noticeData.find((data) => { return (data.id === parseInt(id)) })

  return (
    <Main className="subWrap bg">

      <div className="noticeBox">
        <Container className="lnbContainer">
          <div className="noticeContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice" className="active">
                  <span>
                    공지사항
                  </span>
                </Link>
                <Link to="/faq"><span>FAQ</span></Link>
                <Link to="/inquiry"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content flexColumn">
                <div className={`topBox ${style.topBox}`}>
                  <h4>
                    {notice.title}
                  </h4>
                  <div className={style.layoutBox}>
                    <span className={style.category}>
                      {notice.category}
                    </span>
                    <span className={style.data}>
                      {notice.date}
                    </span>
                  </div>
                </div>

                <p className={style.infoText}>
                  {notice.content}
                </p>

                <Button
                  customClass={style.btn}
                  text="목록으로"
                  href="/notice"
                />

              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}
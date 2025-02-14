import { Link } from "react-router-dom";
import style from "./Alarm.module.css"

export default function Alarm({ isalarmOpen, setIsAlarmOpen }) {

  return (
    <>
      <div className={`${style.alarmBox} ${isalarmOpen ? `${style.active}` : ""}`}>
        <h3>
          알림
        </h3>
        <div className={style.alarmListBox}>
          <ul className={style.alarmList}>
            <li>
              <Link to="/community" className={style.read}>
                <p className={style.title}>
                  선박운영관리자로 성공한 박성시씨
                </p>
                <p className={style.content}>
                  현직자들의 성공사례를 확인하세요!
                </p>
              </Link>
            </li>
            <li>
              <Link to="/policy" className={style.read}>
                <p className={style.title}>
                  개인정보처리방침 개정에 따른 이용약관
                </p>
                <p className={style.content}>
                  공지사항에서 확인해주세요.
                </p>
              </Link>
            </li>
            <li>
              <Link to="/activity">
                <p className={style.title}>
                  애기피부 님이 답글을 남겼습니다.
                </p>
                <p className={style.content}>
                  “에이 그건 아니지않나요? 제 생각에는 그건...”
                </p>
              </Link>
            </li>
          </ul>
        </div>

        <button className={style.alarmChk}>
          <span>
            모두읽음
          </span>
        </button>

        <button
          className={style.alarmClose}
          onClick={() => setIsAlarmOpen(false)}
        >
          <span className="blind">
            알림 닫기
          </span>
        </button>
      </div>
    </>
  )

}
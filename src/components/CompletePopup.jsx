import style from "./CompletePopup.module.css";
import CompleteIcon from "../assets/images/common/CompleteIcon.svg";
import ErrorIcon from "../assets/images/common/ErrorIcon.svg";
import { useEffect, useState } from "react";

export default function CompletePopup({ isOpen, message, error, onCancel }) {

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 팝업이 열리면 showPopup을 true로 설정하여 애니메이션 시작
      setShowPopup(true);
    } else {
      // 팝업이 닫힐 때 애니메이션 효과가 끝난 후 팝업을 숨깁니다.
      const timer = setTimeout(() => {
        setShowPopup(false); // 300ms 후 팝업 숨기기
      }, 300); // 애니메이션 시간(300ms)

      return () => clearTimeout(timer);
    }
  }, [isOpen]); // isOpen 상태가 변경될 때마다 effect가 실행됩니다.

  return (
    <div className={`${style.popupWrap} ${showPopup ? style.active : ""}`}>
      <div className={style.popupContent}>
        {
          error ?
            <div className={style.imgBox}>
              <img src={ErrorIcon} alt="" />
            </div>
            :
            <div className={style.imgBox}>
              <img src={CompleteIcon} alt="" />
            </div>
        }
        <p>
          {message}
        </p>
        <div className={style.btnBox}>
          <button className={style.btn} onClick={onCancel}>
            확인
          </button>
        </div>
      </div>
    </div>
  )

}
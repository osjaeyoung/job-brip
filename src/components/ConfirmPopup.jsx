import { useState, useEffect } from "react";
import style from "./ConfirmPopup.module.css";

export default function ConfirmPopup({
  message,
  subMessage,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isOpen
}) {
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
        <div className={style.popupTop}>
          <p className={style.title}>{message}</p>
          <p className={style.subText}>{subMessage}</p>
        </div>
        <div className={style.popupBottom}>
          <div className={style.btnBox}>
            <button className={style.btn} onClick={onCancel}>
              {cancelText}
            </button>
            <button
              className={`${style.btn} ${style.confirmBtn}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
        <button className={style.closeBtn} onClick={onCancel}>
          <span className="blind">팝업닫기</span>
        </button>
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useEffect } from "react";

const PopupContext = createContext();

export const usePopup = () => {
  return useContext(PopupContext);
};

export const PopupProvider = ({ children }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 sessionStorage에서 팝업 상태를 가져옵니다.
    const savedPopupState = sessionStorage.getItem("isPopupOpen");
    if (savedPopupState === "true") {
      setPopupOpen(true); // 팝업이 열려있으면 true로 설정
    }
  }, []);

  const openPopup = () => {
    setPopupOpen(true);
    sessionStorage.setItem("isPopupOpen", "true"); // 팝업을 열었으니 sessionStorage에 저장
  };

  const closePopup = () => {
    setPopupOpen(false);
    sessionStorage.setItem("isPopupOpen", "false"); // 팝업을 닫았으니 sessionStorage에 저장
  };

  return (
    <PopupContext.Provider value={{ isPopupOpen, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

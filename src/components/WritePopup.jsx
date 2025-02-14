import { useState } from "react";
import Button from "./Button";
import Select from "./Select";
import Textarea from "./Textarea";
import CompletePopup from "./CompletePopup"; // ✅ 완료 팝업 추가

export default function WritePopup({ closePopup }) {
  const [image, setImage] = useState(null); // 선택된 이미지 저장 상태
  const [isCompletePopupOpen, setIsCompletePopupOpen] = useState(false); // ✅ 완료 팝업 상태

  // 이미지 첨부 핸들러
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // 파일 선택
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // 이미지 미리보기 데이터 설정
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ 게시 버튼 클릭 핸들러
  const handlePost = () => {
    setIsCompletePopupOpen(true); // 완료 팝업 열기
  };

  // ✅ 완료 팝업 닫기 핸들러
  const handleCloseCompletePopup = () => {
    setIsCompletePopupOpen(false);
    closePopup(); // 팝업 닫기
  };

  return (
    <>
      {/* ✅ 완료 팝업이 열려 있지 않을 때만 WritePopup 표시 */}
      {!isCompletePopupOpen && (
        <div className="popupWrap">
          <div className="popupBox">
            <h3>커뮤니티 글쓰기</h3>
            <Select className="popupSelect" defaultOption="카테고리 선택" />

            {/* 커스터마이즈된 이미지 첨부 버튼 */}
            <div className="imageUpload">
              <div className="box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="upload"
                  className="blind"
                />
                <label htmlFor="upload" className="uploadButton">이미지 첨부</label>
                <p className="infoText">
                  운영정책에 어긋나는 <br />
                  이미지 등록 시 이용이 제한 <br />
                  될 수 있습니다.
                </p>
              </div>
              {image && (
                <div className="imagePreview">
                  <img src={image} alt="첨부된 이미지" className="previewImage" />
                </div>
              )}
            </div>

            <Textarea placeholder="내용을 입력해주세요." className="popupTextarea" />
            <Button text="게시" onClick={handlePost} />

            <button className="closeBtn" onClick={closePopup}>
              <span className="blind">팝업 닫기</span>
            </button>
          </div>
        </div>
      )}

      {/* ✅ 게시 완료 팝업 */}
      {isCompletePopupOpen && (
        <CompletePopup
          isOpen={isCompletePopupOpen}
          message="게시 완료되었습니다."
          error={false}
          onCancel={handleCloseCompletePopup}
        />
      )}
    </>
  );
}

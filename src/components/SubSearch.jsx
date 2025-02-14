import style from "./SubSearch.module.css";

export default function SubSearch({ onSearch }) {
  
  const handleInputChange = (event) => {
    onSearch(event.target.value); // 검색어 상태 변경
  };

  return (
    <div className={style.subSearchBox}>
      <form>
        <div className="inputBox">
          <label htmlFor="search" className="blind">
            검색
          </label>
          <input
            id="search"
            type="text"
            placeholder="직무를 검색해주세요."
            onChange={handleInputChange} // 입력값 변경 시 검색어 상태 업데이트
          />
        </div>
      </form>
    </div>
  );
}

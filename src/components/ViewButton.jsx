import style from "./ViewButton.module.css";

export default function ViewButton({ handleToggle, data, className, onEdit, deleteResume }) {
  return (
    <div className={`${className} ${style.viewBox}`}>
      <button
        className={style.viewBtn}
        onClick={() => handleToggle(data.id)} // 보기 버튼 클릭 시, 상태 토글
      >
        <span className="blind">
          수정, 삭제 더보기 버튼
        </span>
      </button>

      {data.isActionsVisible && (
        <div className={style.btnBox}>
          <button className={style.editBtn} onClick={() => onEdit(data.id)}>
            수정
          </button>
          <button className={style.delbtn} onClick={() => deleteResume(data.id)}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import style from "./Pagination.module.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page); // 페이지 변경 함수 호출
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1); // 이전 페이지로 이동
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1); // 다음 페이지로 이동
    }
  };

  return (
    <div className={style.paginationBox}>
      {/* 이전 페이지 버튼 */}
      <Link
        to="#"
        className={`${style.pageLink} ${style.pageLinkPrev}`}
        onClick={handlePrevPage}
      >
        <span className="blind">1페이지 뒤로 이동</span>
      </Link>

      {/* 페이지 번호 버튼들 */}
      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1;
        return (
          <Link
            key={pageNumber}
            to="#"
            className={`${style.pageLink} ${currentPage === pageNumber ? style.active : ""}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </Link>
        );
      })}

      {/* 다음 페이지 버튼 */}
      <Link
        to="#"
        className={`${style.pageLink} ${style.pageLinkNext} ${currentPage === totalPages ? style.disabled : ""}`}
        onClick={handleNextPage}
      >
        <span className="blind">1페이지 앞으로 이동</span>
      </Link>
    </div>
  );
}

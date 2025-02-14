import { Link } from "react-router-dom";
import style from "./Card.module.css";

export default function Card({ href, title, text, subText, className, handleLikeToggle, isLiked, imgSrc }) {

  return (
    <Link to={href} className={`cardBox ${className ? style[className] : ""} ${style.link}`}>
      <div className={style.imgBox}>
        <div className={style.img}>
          <img src={imgSrc} alt="" />
        </div>
      </div>
      <div className={style.textBox}>
        <span className={style.text01}>
          {text}
        </span>
        <h4>
          {title}
        </h4>
        <em className={style.text02}>
          {subText}
        </em>
        {handleLikeToggle && isLiked !== undefined && (
          <button
            className={`${style.linkBtn} ${isLiked ? `${style.active}` : ""}`}
            onClick={handleLikeToggle}
          >
            <span className="blind">
              {isLiked ? "좋아요 취소" : "좋아요"}
            </span>
          </button>
        )}
      </div>
    </Link>
  )

}
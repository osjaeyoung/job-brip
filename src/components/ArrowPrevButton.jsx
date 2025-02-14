import { Link } from "react-router-dom";
import style from "./ArrowPrevButton.module.css";

export default function ArrowPrevButton({ customClass, href, hiddenText }) {

  return (
    <>
      <Link to={href} className={`${style.linkbtn} ${customClass}`}>
        <span className="blind">
          {hiddenText}
        </span>
      </Link>
    </>
  )

}
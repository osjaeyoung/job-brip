import { FadeLoader } from "react-spinners";
import style from "./Loading.module.css";

export default function Loading({ fullScreen = false }) {
  return (
    <div className={`${style.loadingBox} ${fullScreen ? style.fullScreen : style.basicLoadingBox}`}>
      {/* <p className={style.loadingText}>
        잠시만 기다려주세요.
      </p> */}
      <FadeLoader color="#5A38D4" />
    </div>
  );
}

import Container from "../components/Container";
import Main from "../components/layout/Main";
import "../styles/style.css";
import Button from "../components/Button";
import RoadMapImg from "../assets/images/sub/RoadMap_Img.png";
import ArrowPrevButton from "../components/ArrowPrevButton";
import style from "./RoadMapInfoPage.module.css";

export default function RoadMapInfoPage() {

  return (
    <Main className="subWrap bg">

      <div className="roadMapBox">
        <Container>
          <div className={`roadMapContent ${style.roadMapContent}`}>
            <div className={`titleBox ${style.titleBox}`}>
              <h3>
                나만의 커리어 로드맵 설계
              </h3>
              <p>
                현재 상태를 분석하고, 부족한 역량을 채워줄   <br />
                로드맵을 설계해드려요!
              </p>
            </div>

            <div className={style.imgBox}>
              <img src={RoadMapImg} alt="" />
            </div>

            <p className={style.infotext}>
              로드맵 설계를 통해 이런 혜택을 얻을 수 있어요!
            </p>

            <ul className={style.roadMapInfoList}>
              <li>
                필요한 역량을 분석하여 개선 방향 제시
              </li>
              <li>
                단계별 커리어 목표와 성장 경로 제공
              </li>
              <li>
                맞춤형 교육과 채용 정보 추천
              </li>
            </ul>

            <p className={style.infotext02}>
              지금 바로 로드맵 설계를 시작해보세요!
            </p>

            <Button
              text="로드맵 설계 시작하기"
              href="/roadmapdesign"
            />

            <div className="linkBox">
              <ArrowPrevButton href="#" hiddenText="" />
            </div>

          </div>
        </Container>
      </div>

    </Main>
  )

}
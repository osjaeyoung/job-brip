import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import style from "./ActivityPage.module.css";
import { activityData } from "../data/activityData";
import { useState } from "react";
import AddPopup from "../components/AddPopup"; // AddPopup 컴포넌트 임포트

export default function ActivityPage() {
  const [activities, setActivities] = useState(activityData);
  const [isPopupVisible, setPopupVisible] = useState(false); // 팝업 상태 관리
  const [selectedActivity, setSelectedActivity] = useState(null); // 수정할 활동 저장

  // 좋아요 클릭 시 핸들러
  function handleLikeClick(id) {
    console.log("Like clicked for activity ID:", id);
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? { ...activity, likes: activity.likes + 1 }
          : activity
      )
    );
  }

  // 토글 버튼 클릭 시 핸들러
  function handleToggle(id) {
    console.log("Toggle clicked for activity ID:", id);
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? { ...activity, isActionsVisible: !activity.isActionsVisible }
          : activity
      )
    );
  }

  // 삭제 버튼 클릭 시 핸들러
  function handleDelete(id) {
    console.log("Deleting activity ID:", id);
    setActivities((prevActivities) =>
      prevActivities.filter((activity) => activity.id !== id)
    );
  }

  // 수정 버튼 클릭 시 팝업 띄우기
  function handleEdit(id) {
    console.log("Editing activity ID:", id);
    const activityToEdit = activities.find((activity) => activity.id === id);
    setSelectedActivity(activityToEdit); // 수정할 활동 정보 저장
    setPopupVisible(true); // 팝업 표시
  }

  // 팝업 닫기
  function closePopup() {
    setPopupVisible(false); // 팝업 숨기기
    setSelectedActivity(null); // 선택된 활동 초기화
  }

  return (
    <Main className="subWrap bg">
      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage">
                  <span>프로필</span>
                </Link>
                <Link to="/interest">
                  <span>관심공고</span>
                </Link>
                <Link to="/resume">
                  <span>이력서관리</span>
                </Link>
                <Link to="/apply">
                  <span>지원현황</span>
                </Link>
                <Link to="/activity" className="active">
                  <span>내 활동</span>
                </Link>
              </aside>

              <div className="content">
                <h4 className="title">내 활동</h4>
                <p className="subTitle">
                  커뮤니티에서 내가 쓴 글들을 한곳에서 확인할 수 있습니다.
                </p>

                <ul className={style.activityList}>
                  {activities.map((data) => (
                    <li key={data.id}>
                      <div className={style.topBox}>
                        <span className={style.name}>{data.nickname}</span>
                        <span className={style.date}>{data.date}</span>
                      </div>

                      <p className={style.content}>{data.content}</p>

                      <div className={style.btnWrap}>
                        <div className={style.btnBox}>
                          <button
                            className={style.likeBtn}
                            onClick={() => handleLikeClick(data.id)}
                          >
                            <span className="blind">좋아요</span>
                          </button>
                          <span className={style.number}>{data.likes}</span>
                        </div>

                        <div className={style.btnBox}>
                          <em className={style.comment}>
                            <span className="blind">댓글</span>
                          </em>
                          <span className={style.number}>{data.comments}</span>
                        </div>
                      </div>

                      <div className={style.viewBox}>
                        <button
                          className={style.viewBtn}
                          onClick={() => handleToggle(data.id)} // 버튼 클릭 시 토글 실행
                        >
                          <span className="blind">
                            수정, 삭제 더보기 버튼
                          </span>
                        </button>

                        {data.isActionsVisible && (
                          <div className={style.btnBox}>
                            <button
                              className={style.editBtn}
                              onClick={() => handleEdit(data.id)} // 수정 버튼 클릭 시 팝업 띄우기
                            >
                              수정
                            </button>
                            <button
                              className={style.delbtn}
                              onClick={() => handleDelete(data.id)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 수정 팝업 */}
      {isPopupVisible && <AddPopup closePopup={closePopup} />}
    </Main>
  );
}

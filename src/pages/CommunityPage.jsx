import { useContext, useState } from "react";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import { chatRoomsData } from "../data/chatRoomsData";
import { QAData } from "../data/QAData";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import ProfileImg from "../assets/images/common/Profile_Img.svg";
import WritePopup from "../components/WritePopup";
import AddPopup from "../components/AddPopup";

// 날짜를 "MM/DD HH:mm" 형식으로 변환하는 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');  // 01~12
  const day = String(date.getDate()).padStart(2, '0');        // 01~31
  const hours = String(date.getHours()).padStart(2, '0');      // 00~23
  const minutes = String(date.getMinutes()).padStart(2, '0');  // 00~59
  return `${month}/${day} ${hours}:${minutes}`;
};

export default function CommunityPage() {

  const { user } = useContext(UserContext);

  const [addPopupShowPopup, setAddPopupShowPopup] = useState(false); // 팝업 상태 관리
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 관리

  const [chatRooms] = useState(chatRoomsData);
  const [qaList] = useState(QAData)
  const [likes, setLikes] = useState({});     // 좋아요 상태
  const [comments, setComments] = useState({}); // 댓글 상태
  const [activeTab, setActiveTab] = useState("qa");
  const [reports, setReports] = useState({});  // 신고 상태

  // user가 null일 때는 로딩 중 메시지 출력
  if (!user) {
    return <p></p>;  // 유저 정보가 없으면 로딩 중 메시지
  }

  // 탭 클릭 시 활성화된 탭 상태 변경
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 좋아요 증가 핸들러
  const handleLike = (id) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: (prevLikes[id] || 0) + 1,
    }));
  };

  // 신고 증가 핸들러
  const handleReport = (id) => {
    setReports((prevReports) => ({
      ...prevReports,
      [id]: (prevReports[id] || 0) + 1,
    }));
  };

  function openAddPopup() {
    setAddPopupShowPopup(true)
  };

  function openWritePopup() {
    setShowPopup(true); 
  }

  const closePopup = () => {
    setShowPopup(false); 
    setAddPopupShowPopup(false)
  };

  return (
    <Main className="subWrap">
      <div className="communityBox communityQABox">
        <Container className="lnbContainer">
          <div className="communityContent">
            <div className="lnbLayoutBox">
              <aside>
                <div className="infoBox">
                  <div className="imgBox">
                    <img src={ProfileImg} alt="프로필이미지" />
                  </div>
                  <div className="textBox">
                    <p className="nickname">
                      {user.nickname}
                    </p>
                    <span className="name">
                      {user.name}
                    </span>
                  </div>
                </div>
                <div className="addBtnBox">
                  <button
                    className="addBtn"
                    onClick={openAddPopup}
                  >
                    <span>채팅방 생성</span>
                  </button>
                  <button
                    className="addBtn communityWrite"
                    onClick={openWritePopup}
                  >
                    <span>커뮤니티 글쓰기</span>
                  </button>
                </div>
              </aside>

              <div className="content">

                <ul className="communityTab">
                  <li>
                    <button
                      className={`tabBtn ${activeTab === "qa" ? "active" : ""}`}
                      onClick={() => handleTabClick("qa")}
                    >
                      노하우 Q&A
                    </button>
                  </li>
                  <li>
                    <button
                      className={`tabBtn ${activeTab === "realTimeChat" ? "active" : ""}`}
                      onClick={() => handleTabClick("realTimeChat")}
                    >
                      실시간 채팅
                    </button>
                  </li>
                  <li>
                    <button
                      className={`tabBtn ${activeTab === "industry" ? "active" : ""}`}
                      onClick={() => handleTabClick("industry")}
                    >
                      업종별/연차별
                    </button>
                  </li>
                  <li>
                    <button
                      className={`tabBtn ${activeTab === "infoShare" ? "active" : ""}`}
                      onClick={() => handleTabClick("infoShare")}
                    >
                      정보공유
                    </button>
                  </li>
                </ul>

                {activeTab === "qa" && (
                  <div className="qaContentBox">
                    <div className="shareBox">
                      <div className="imgBox">
                        <img src={ProfileImg} alt="프로필이미지" />
                      </div>
                      <p>나누고 싶은 이야기를 공유해보세요!</p>
                    </div>

                    {qaList.map((qa) => (
                      <div key={qa.id} className="qaContentList">
                        <div className="top">
                          <span className="name">{qa.nickname}</span>
                          <span className="date">{formatDate(qa.timestamp)}</span>
                        </div>

                        <Link to={`/qa/${qa.id}`} className="qaContent">{qa.content}</Link>

                        <div className="LikeBox">
                          <dlv className="btnBox">
                            <button className="likeBtn" onClick={() => handleLike(qa.id)}>
                              <span className="blind">좋아요</span>
                            </button>
                            <em>
                              {likes[qa.id] || qa.likes}
                            </em>
                          </dlv>
                          <div className="commentBox">
                            <span className="comment">
                              <span className="blind">
                                댓글
                              </span>
                            </span>
                            <em>
                              {comments[qa.id] || qa.comments}
                            </em>
                          </div>
                        </div>

                        <button
                          className="declarationBtn
" onClick={() => handleReport(qa.id)}
                        >
                          {reports[qa.id] || qa.reports} 신고
                        </button>

                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "realTimeChat" && (
                  <div className="chatRoomContentBox">
                    <div className="shareBox">
                      <div className="imgBox">
                        <img src={ProfileImg} alt="프로필이미지" />
                      </div>
                      <p>나누고 싶은 이야기를 공유해보세요!</p>
                    </div>

                    {chatRooms.map((room, index) => (
                      <Link to={`/chat/${room.id}`} key={index} className="chatRoomLink">
                        <div className="imgBox">
                          <img src={room.thumbnailImg} alt={room.roomName} />
                        </div>
                        <h4>{room.roomName}</h4>
                        <span className="number">{room.participants}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {activeTab === "industry" && (
                  <div className="industryContentBox">
                    <p className="infoText">현재 페이지 제작중입니다.</p>
                  </div>
                )}

                {activeTab === "infoShare" && (
                  <div className="infoShareContentBox">
                    <p className="infoText">현재 페이지 제작중입니다.</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </Container>
      </div >
      {
        showPopup && <WritePopup closePopup={closePopup} />
      }
      {
        addPopupShowPopup && <AddPopup closePopup={closePopup} />
      }
    </Main >
  );
}

import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";  // useState와 useEffect를 임포트
import Container from "../components/Container";
import Main from "../components/layout/Main";
import { QAData } from "../data/QAData";
import Message from "../components/Message";
import { UserContext } from "../context/UserProvider";
import { useContext } from "react";  // useContext를 임포트
import ProfileImg from "../assets/images/common/Profile_Img.svg";
import WritePopup from "../components/WritePopup";
import AddPopup from "../components/AddPopup";

export default function QADetailPage() {

  const { user } = useContext(UserContext);

  // 날짜를 "MM/DD HH:mm" 형식으로 변환하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');  // 01~12
    const day = String(date.getDate()).padStart(2, '0');        // 01~31
    const hours = String(date.getHours()).padStart(2, '0');      // 00~23
    const minutes = String(date.getMinutes()).padStart(2, '0');  // 00~59
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const { qaId } = useParams(); // URL에서 qaId를 가져옴
  const [qa, setQA] = useState(null);  // qa 객체를 상태로 설정
  const [reports, setReports] = useState(0); // 신고 횟수를 상태로 관리
  const [newMessage, setNewMessage] = useState("");

  const [addPopupShowPopup, setAddPopupShowPopup] = useState(false); // 팝업 상태 관리
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 관리

  // 해당 Q&A 데이터 가져오기
  useEffect(() => {
    const selectedQA = QAData.find((qa) => qa.id === parseInt(qaId));
    if (selectedQA) {
      setQA(selectedQA);  // 찾은 Q&A 항목을 상태에 설정
    }
  }, [qaId]); // qaId가 바뀔 때마다 실행

  // qa 데이터가 로딩되지 않았다면 로딩 중 메시지를 표시
  if (!qa) {
    return <p></p>;
  }

  // 신고 증가 핸들러
  const handleReport = () => {
    setReports((prevReports) => prevReports + 1);  // 신고 횟수 증가
  };

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      user: user.nickname, // 현재 사용자 닉네임
      text: newMessage,
      timestamp: new Date().toISOString(),
      thumbnailImg: user.profileImg, // 프로필 이미지 추가
    };

    setMessages([...messages, newMsg]); // 메시지 배열에 새로운 메시지 추가
    setNewMessage(""); // 입력 필드 초기화
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {  // shift + enter는 줄바꿈, 그냥 enter는 전송
      e.preventDefault();  // 기본 엔터키 동작 방지
      handleSendMessage();
    }
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
                    <img src={ProfileImg} alt="" />
                  </div>
                  <div className="textBox">
                    <p className="nickname">{user.nickname}</p>
                    <span className="name">{user.name}</span>
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

              <div className="content flexColumn">
                <div className="header">
                  <Link to="/community" className="link">
                    <span className="blind">
                      노하우Q&A리스트 화면으로 이동
                    </span>
                  </Link>
                  <h4>노하우 Q&A</h4>
                </div>
                <div className="qaContentList">
                  <div className="top">
                    <span className="name">{qa.nickname}</span>
                    <span className="date">{formatDate(qa.timestamp)}</span>
                  </div>

                  <p className="qaContent">{qa.content}</p>

                  <div className="LikeBox">
                    <dlv className="btnBox">
                      <button className="likeBtn" onClick={() => handleLike(qa.id)}>
                        <span className="blind">좋아요</span>
                      </button>
                      <em>
                        {qa.likes}
                      </em>
                    </dlv>
                    <div className="commentBox">
                      <span className="comment">
                        <span className="blind">
                          댓글
                        </span>
                      </span>
                      <em>
                        {qa.comments}
                      </em>
                    </div>
                  </div>

                  {/* 신고 버튼 추가 */}
                  <button className="declarationBtn" onClick={handleReport}>
                    신고 {reports > 0 && `(${reports})`} {/* 신고 횟수 표시 */}
                  </button>

                </div>

                <Message
                  id="message"
                  hiddenText="댓글입력"
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleKeyDown={handleKeyDown}
                  handleSendMessage={handleSendMessage}
                  placeholder="댓글을 남겨주세요."
                  user={user}
                />

              </div>
            </div>
          </div>
        </Container>
      </div>

      {
        showPopup && <WritePopup closePopup={closePopup} />
      }
      {
        addPopupShowPopup && <AddPopup closePopup={closePopup} />
      }

    </Main>
  );
}

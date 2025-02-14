import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { chatRoomsData } from "../data/chatRoomsData";
import Main from "../components/layout/Main";
import Container from "../components/Container";
import Message from "../components/Message";
import { UserContext } from "../context/UserProvider";
import ProfileImg from "../assets/images/common/Profile_Img.svg";

export default function ChatRoomDetailPage() {

  const { user } = useContext(UserContext);

  const [addPopupShowPopup, setAddPopupShowPopup] = useState(false); // 팝업 상태 관리
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 관리

  const { roomId } = useParams(); // URL에서 roomId를 가져옴
  const [chatRoom, setChatRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

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

  // 해당 채팅방 데이터 가져오기
  useEffect(() => {
    const room = chatRoomsData.find((room) => room.id === parseInt(roomId));
    if (room) {
      setChatRoom(room);
      setMessages(room.messages);
    }
  }, [roomId]);

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


  // 날짜 포맷 (년-월-일 형식)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 요일 계산
  const getDayOfWeek = (timestamp) => {
    const date = new Date(timestamp);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()];
  };

  // 대화 시작 날짜 (첫 번째 메시지 날짜 기준)
  const getChatStartDate = () => {
    const firstMessageTimestamp = messages.length > 0 ? messages[0].timestamp : new Date().toISOString();
    return formatDate(firstMessageTimestamp);
  };

  // 메시지에 날짜 구분을 넣기 위한 로직
  const groupedMessages = [];
  let currentDate = null;

  messages.forEach((msg) => {
    const messageDate = formatDate(msg.timestamp);
    if (messageDate !== currentDate) {
      groupedMessages.push({
        date: messageDate,
        weekday: getDayOfWeek(msg.timestamp),
        messages: [],
      });
      currentDate = messageDate;
    }
    groupedMessages[groupedMessages.length - 1].messages.push(msg);
  });


  if (!chatRoom) return <p></p>;

  return (
    <Main className="subWrap">
      <div className="communityBox communityChatBox">
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

              <div className="content flexColumn">
                <div className="header">
                  <Link to="/community" className="link">
                    <span className="blind">
                      채팅리스트 화면으로 이동
                    </span>
                  </Link>
                  <h4>{chatRoom.roomName}</h4>
                </div>
                <p className="chatStartDate">{getChatStartDate()}</p>
                {/* groupedMessages를 순회하며 날짜별로 출력 */}
                <div className="chatMessages">
                  {groupedMessages.map((group, index) => (
                    <div key={index}>
                      {/* 
                      날짜와 요일 구분
                      <div className="dateSeparator">
                        <hr />
                        <p className="dateText">
                          {group.date} ({group.weekday})
                        </p>
                        <hr />
                      </div>
                       */
                      }
                      {/* 해당 날짜의 메시지 출력 */}
                      {group.messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.user === user.nickname ? 'myMessage' : ''}`}>
                          <div className="imgBox">
                            <img src={ProfileImg} alt="프로필이미지" />
                          </div>
                          <div className="textBox">
                            <span className="nickname">{msg.user}</span>
                            <div className="layoutBox">
                              <p className="text">{msg.text}</p>
                              <span className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <Message
                  id="message"
                  hiddenText="메세지입력"
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleKeyDown={handleKeyDown}
                  handleSendMessage={handleSendMessage}
                  placeholder="메세지를 입력해주세요."
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

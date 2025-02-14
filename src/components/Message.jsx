import style from "./Message.module.css";
import ProfileImg from "../assets/images/common/Profile_Img.svg";

export default function Message({ user, id, hiddenText, newMessage, setNewMessage, handleKeyDown, handleSendMessage, placeholder }) {

  return (
    <div className={style.messageInput}>
      <div className={style.layoutBox}>
        <div className={style.imgBox}>
          <img src={ProfileImg} alt={user.name} />
        </div>
        <div className={style.textareaBox}>
          <label htmlFor={id} className="blind">{hiddenText}</label>
          <textarea
            id={id}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        </div>
      </div>

      <button
        className={style.messageBtn}
        onClick={handleSendMessage}
      >
        <span className="blind">
          전송
        </span>
      </button>
    </div>
  )

}
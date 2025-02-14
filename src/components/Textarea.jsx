import React from 'react';
import style from "./Textarea.module.css";

export default function Textarea({
  id,
  value, // 부모에서 전달되는 값
  onChange, // 부모에서 전달되는 변경 이벤트 핸들러
  placeholder,
  className,
  hiddenText
}) {
  return (
    <>
      <label htmlFor={id} className="blind">
        {hiddenText}
      </label>
      <textarea
        className={`${className} ${style.textarea}`}
        id={id}
        value={value} // 부모에서 전달된 value를 사용
        onChange={onChange} // 부모에서 전달된 onChange 핸들러 사용
        placeholder={placeholder}
      />
    </>
  );
}

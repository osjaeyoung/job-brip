import { useState, useEffect } from "react";
import style from "./Select.module.css";

export default function Select({
  className,
  id,
  hiddenText,
  options = [],
  defaultOption = "선택하세요",
  value, // 외부에서 선택된 값 전달받을 수 있도록
  onChange // 선택된 값이 변경될 때 부모에게 전달할 핸들러
}) {
  const [selectedOption, setSelectedOption] = useState(value || ""); // 내부 상태로 관리

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value); // 부모에서 전달된 값으로 동기화
    }
  }, [value]); // 부모의 값이 변경되면 동기화

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedOption(newValue);
    if (onChange) {
      onChange(newValue); // 부모에게 값 전달
    }
  };

  return (
    <>
      <label htmlFor={id} className="blind">
        {hiddenText}
      </label>
      <select
        className={`${className} ${style.select}`}
        id={id}
        value={selectedOption}
        onChange={handleChange}
      >
        <option value="" disabled>
          {defaultOption} {/* 기본 선택 안내 */}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}

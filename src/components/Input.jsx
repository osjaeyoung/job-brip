import style from "./Input.module.css";

export default function Input({ title, label, id, type, placeholder, value, onChange, children, className, error }) {

  return (
    <>
      {

        label && <label htmlFor={id} className={`${className} ${style.label}`}>
          {label}
        </label>

      }

      <input
        title={title}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${style.input} ${error ? `${style.error}` : ""}`}
      />

      {children}

    </>

  )

}
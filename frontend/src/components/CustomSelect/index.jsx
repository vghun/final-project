import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./CustomSelect.module.scss";

const cx = classNames.bind(styles);

function CustomSelect({ options, defaultValue, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || null);
  const ref = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className={cx("select")} ref={ref}>
      <div className={cx("selected", { open })} onClick={() => setOpen(!open)}>
        {selected || placeholder || "Chọn một mục"}
        <i className="fa-solid fa-chevron-down"></i>
      </div>

      {open && (
        <ul className={cx("options")}>
          {options.map((opt, i) => (
            <li
              key={i}
              className={cx("option", { active: opt === selected })}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;

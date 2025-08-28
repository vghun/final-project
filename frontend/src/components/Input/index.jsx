import { useState } from "react";
import styles from "./Input.module.scss";
import classNames from "classnames/bind";
import { Eye, EyeOff } from "lucide-react";

const cx = classNames.bind(styles);

function Input({
  primary = false,
  className,
  type = "text",
  placeholder = "",
  onChange,
  value,
  name,
  showToggleIcon = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const handleToggle = () => setShowPassword((prev) => !prev);

  const classes = cx("wrapper", {
    [className]: className,
    primary,
  });
  return (
    <div className={classes}>
      <input
        className={cx("input")}
        type={inputType}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        name={name}
      />
      {isPassword && showToggleIcon && (
        <span className={cx("icon")} onClick={handleToggle}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      )}
    </div>
  );
}

export default Input;

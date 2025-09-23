import { useState } from "react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

import { useToast } from "~/context/ToastContext";
import { useAuth } from "~/context/AuthContext";
import { AuthAPI } from "~/apis/AuthAPI";

import Input from "~/components/Input";
import Button from "~/components/Button";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

function Login({ onSwitch, onClose }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const { login } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await AuthAPI.login(formData);

      if (result.accessToken && result.refreshToken && result.user) {
        // Map image -> avatar
        const userWithAvatar = {
          ...result.user,
          avatar: result.user.image || "/user.png",
        };

        // Lưu vào context
        login(userWithAvatar, result.accessToken, result.refreshToken);

        showToast({
          text: result.message || "Đăng nhập thành công",
          type: "success",
        });

        navigate("/"); 

        onClose();
      } else {
        showToast({
          text: result.message || "Tài khoản hoặc mật khẩu không chính xác",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast({
        text: err.response?.data?.message || "Đăng nhập không thành công, vui lòng thử lại sau",
        type: "error",
      });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("inner")}>
        <h4 className={cx("heading")}>Đăng nhập</h4>
        <div className={cx("body")}>
          <p>
            Nếu bạn chưa có tài khoản,{" "}
            <a href="#" onClick={() => onSwitch("register")}>
              đăng ký ngay
            </a>
          </p>
          <form onSubmit={handleSubmit}>
            <Input primary name="email" required placeholder="Email" value={formData.email} onChange={handleChange} />
            <Input
              primary
              name="password"
              type="password"
              required
              placeholder="Mật khẩu"
              showToggleIcon
              value={formData.password}
              onChange={handleChange}
            />
            <div className={cx("forgetpass-wrapper")}>
              <div className={cx("forgetpass")} onClick={() => onSwitch("forgetpass")}>
                Quên mật khẩu ?
              </div>
            </div>
            <Button primary type="submit">
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

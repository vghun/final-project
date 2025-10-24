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

function Login({ onSwitch, onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const { login } = useAuth();
  const { showToast } = useToast();

  // ✅ Đảm bảo event có name/value dù Input là custom
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit form data:", formData); // 👈 Kiểm tra

    if (!formData.email || !formData.password) {
      showToast({ text: "Vui lòng nhập đầy đủ thông tin", type: "error" });
      return;
    }

    try {
      const result = await AuthAPI.login(formData);

      if (result.accessToken && result.refreshToken && result.user) {
        const userWithAvatar = {
          ...result.user,
          avatar: result.user.image || "/user.png",
        };

        login(userWithAvatar, result.accessToken, result.refreshToken);

        if (onLoginSuccess) onLoginSuccess();

        showToast({
          text: result.message || "Đăng nhập thành công",
          type: "success",
        });

        if (onClose) onClose();
        navigate("/");
      } else {
        showToast({
          text: result.message || "Tài khoản hoặc mật khẩu không chính xác",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Login error:", err);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      // 🔒 Nếu tài khoản bị khóa
      if (status === 403 || message?.includes("bị khóa")) {
        showToast({
          text: message || "Tài khoản của bạn đã bị khóa!",
          type: "error",
        });
        return; // ⛔ Dừng luôn, không show lỗi khác
      }

      // 🔹 Lỗi thông thường khác
      showToast({
        text: message || "Đăng nhập không thành công, vui lòng thử lại sau",
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
            <Input
              primary
              name="email"
              required
              placeholder="Email"
              value={formData.email}
              // ✅ Sửa cách truyền event
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              primary
              name="password"
              type="password"
              required
              placeholder="Mật khẩu"
              showToggleIcon
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />

            <div className={cx("forgetpass-wrapper")}>
              <div
                className={cx("forgetpass")}
                onClick={() => onSwitch("forgetpass")}
              >
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

import { useState } from "react";
import classNames from "classnames/bind";
import { useToast } from "~/context/ToastContext";
import { useAuth } from "~/context/AuthContext";
import { AuthAPI } from "~/apis/AuthAPI";

import Input from "~/components/Input";
import Button from "~/components/Button";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

function Login({ onSwitch, onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const { showToast } = useToast();

  // Cập nhật state khi input thay đổi
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast({ text: "Vui lòng nhập đầy đủ thông tin", type: "error" });
      return;
    }

    try {
      const result = await AuthAPI.login(formData);

      if (result.accessToken && result.refreshToken && result.user) {
        // Login thành công → cập nhật context
        const userWithAvatar = { ...result.user, avatar: result.user.image || "/user.png" };
        login(userWithAvatar, result.accessToken, result.refreshToken);

        showToast({ text: result.message || "Đăng nhập thành công", type: "success" });

        // Chỉ gọi khi login thành công
        if (onLoginSuccess) onLoginSuccess();
        if (onClose) onClose();
        return;
      }

      // Nếu API trả về OK nhưng không có token/user
      showToast({ text: result.message || "Email hoặc mật khẩu không chính xác", type: "error" });

    } catch (err) {
      console.error("Login error:", err);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 401) {
        // Sai email/password → chỉ show toast, KHÔNG đóng modal
        showToast({ text: message || "Email hoặc mật khẩu không đúng", type: "error" });
        return;
      }

      if (status === 403 || message?.includes("bị khóa")) {
        showToast({ text: message || "Tài khoản của bạn đã bị khóa!", type: "error" });
        return;
      }

      showToast({ text: "Đăng nhập không thành công, vui lòng thử lại sau", type: "error" });
    }
  };

  const handleSwitch = (e, target) => {
    e.preventDefault();
    if (onSwitch) onSwitch(target);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("inner")}>
        <h4 className={cx("heading")}>Đăng nhập</h4>
        <div className={cx("body")}>
          <p>
            Nếu bạn chưa có tài khoản,{" "}
            <a href="#" onClick={(e) => handleSwitch(e, "register")}>
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
                onClick={() => onSwitch && onSwitch("forgetpass")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSwitch && onSwitch("forgetpass")}
              >
                Quên mật khẩu ?
              </div>
            </div>

            <Button primary type="submit">Đăng nhập</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import classNames from "classnames/bind";

import { useAuth } from "~/context/AuthContext";
import { useToast } from "~/context/ToastContext";
import { AuthAPI } from "~/apis/AuthAPI";

import Input from "~/components/Input";
import Button from "~/components/Button";
import styles from "./Register.module.scss";

const cx = classNames.bind(styles);

function Register({ onSwitch, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "", // ✅ thêm confirmPassword
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gửi OTP & đăng ký
  const handleSendOtp = async () => {
    try {
      const res = await AuthAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // ✅ truyền confirmPassword
      });
      console.log("Register response:", res);

      showToast({
        text: res.message || "OTP đã gửi",
        type: "success",
      });

      setOtpSent(true);
    } catch (error) {
      showToast({
        text: error.response?.data?.error || error,
        type: "error",
      });
    }
  };

  // Xác thực OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AuthAPI.verifyOtp({
        email: formData.email,
        otp: formData.otp,
      });

      showToast({
        text: result.message || "Đăng ký thành công",
        type: "success",
      });

      onSwitch("Login");
    } catch (error) {
      showToast({
        text: error.response?.data?.error || error.message || "Xác thực OTP thất bại",
        type: "error",
      });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("inner")}>
        <h4 className={cx("heading")}>Tạo tài khoản mới</h4>
        <div className={cx("body")}>
          <p>
            Nếu bạn đã có tài khoản,{" "}
            <a href="#" onClick={() => onSwitch("Login")}>
              đăng nhập
            </a>
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              primary
              name="fullName"
              required
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              primary
              name="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              primary
              name="phoneNumber"
              required
              placeholder="Số điện thoại"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <Input
              primary
              name="password"
              type="password"
              required
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              primary
              name="confirmPassword" // ✅ bind confirmPassword
              type="password"
              required
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div className={cx("otp")}>
              <Input
                primary
                name="otp"
                required
                placeholder="OTP"
                type="number"
                value={formData.otp}
                onChange={handleChange}
              />
              <Button
                primary
                noMargin
                type="button"
                onClick={handleSendOtp}
                disabled={otpSent}
              >
                {otpSent ? "OTP đã gửi" : "Gửi OTP"}
              </Button>
            </div>

            <Button primary type="submit">
              Đăng ký
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

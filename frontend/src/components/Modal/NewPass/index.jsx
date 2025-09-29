import { useState } from "react";
import classNames from "classnames/bind";

import Input from "~/components/Input";
import Button from "~/components/Button";
import styles from "./NewPass.module.scss";

import { AuthAPI } from "~/apis/AuthAPI";
import { useToast } from "~/context/ToastContext";

const cx = classNames.bind(styles);

function NewPass({ onSwitch, email }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showToast({ text: "Mật khẩu nhập lại không khớp", type: "error" });
      return;
    }

    try {
      const res = await AuthAPI.resetPassword({
        email,
        newPassword: formData.newPassword,
      });
      showToast({
        text: res.message || "Đổi mật khẩu thành công",
        type: "success",
      });
      onSwitch("Login"); // chuyển về login sau khi reset
    } catch (err) {
      showToast({
        text: err.error || "Không thể đổi mật khẩu, vui lòng thử lại",
        type: "error",
      });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("inner")}>
        <h4 className={cx("heading")}>Đặt lại mật khẩu mới</h4>
        <div className={cx("body")}>
          <form onSubmit={handleSubmit}>
            <Input
              primary
              name="newPassword"
              type="password"
              required
              placeholder="Mật khẩu mới"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <Input
              primary
              name="confirmPassword"
              type="password"
              required
              placeholder="Nhập lại mật khẩu mới"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button primary type="submit">
              Xác nhận
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewPass;

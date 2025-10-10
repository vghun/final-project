import React, { useState } from "react";
import styles from "./DirectBooking.module.scss";

export default function DirectBooking({ onClose }) {
  const [phone, setPhone] = useState("");
  const [customerExists, setCustomerExists] = useState(false);
  const [form, setForm] = useState({
    name: "",
    service: "",
    barber: "",
    branch: "",
    time: "",
  });

  const handleCheck = () => {
    if (phone === "0909123456") {
      setCustomerExists(true);
      setForm({ ...form, name: "Nguyễn Văn A" });
    } else {
      setCustomerExists(false);
    }
  };

  const handleSubmit = () => {
    alert("Đã booking thành công!");
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.form}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        <h2>Booking trực tiếp</h2>

        <div className={styles.section}>
          <label>Số điện thoại khách hàng:</label>
          <div className={styles.phoneRow}>
            <input
              type="text"
              placeholder="Nhập SĐT..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={handleCheck}>Kiểm tra</button>
          </div>
        </div>

        <div className={styles.section}>
          <label>Họ và tên:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Tên khách hàng..."
          />
          {!customerExists && (
            <small className={styles.guestNote}>
              *Khách vãng lai (chưa có tài khoản)
            </small>
          )}
        </div>

        <div className={styles.section}>
          <label>Dịch vụ:</label>
          <select
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
          >
            <option>-- Chọn dịch vụ --</option>
            <option>Cắt tóc</option>
            <option>Gội đầu</option>
            <option>Uốn tóc</option>
          </select>
        </div>

        <div className={styles.section}>
          <label>Thợ cắt:</label>
          <select
            value={form.barber}
            onChange={(e) => setForm({ ...form, barber: e.target.value })}
          >
            <option>-- Chọn thợ cắt --</option>
            <option>Anh Tuấn</option>
            <option>Anh Duy</option>
            <option>Anh Hoàng</option>
          </select>
        </div>

        <div className={styles.section}>
          <label>Chi nhánh:</label>
          <select
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          >
            <option>-- Chọn chi nhánh --</option>
            <option>Cơ sở 1</option>
            <option>Cơ sở 2</option>
          </select>
        </div>

        <div className={styles.section}>
          <label>Thời gian:</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit}>
          Xác nhận booking
        </button>
      </div>
    </div>
  );
}

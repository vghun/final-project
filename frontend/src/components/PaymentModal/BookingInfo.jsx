import React from "react";
import styles from "./PaymentModal.module.scss";

export default function BookingInfo({ data, setData, onNext }) {
  const { booking, services, voucher } = data;

  const handleToggleService = (id) => {
    const updated = services.map((s) =>
      s.id === id ? { ...s, selected: !s.selected } : s
    );
    setData({ ...data, services: updated });
  };

  const selectedServices = services.filter((s) => s.selected);
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);

  // ✅ Giảm giá theo voucher (nếu có)
  const discount =
    voucher && voucher.discountPercent
      ? (subtotal * voucher.discountPercent) / 100
      : 0;

  const total = subtotal - discount;

  return (
    <div className={styles.step1Container}>
      <h2 className={styles.title}>Xác nhận thông tin đặt lịch</h2>

      <div className={styles.infoBox}>
        <div className={styles.row}>
          <label>Khách hàng:</label>
          <span>{booking.customer}</span>
        </div>
        <div className={styles.row}>
          <label>Thợ cắt:</label>
          <span>{booking.barber}</span>
        </div>
        <div className={styles.row}>
          <label>Thời gian:</label>
          <span>{booking.time}</span>
        </div>
        <div className={styles.row}>
          <label>Chi nhánh:</label>
          <span>{booking.branch}</span>
        </div>
      </div>

      <div className={styles.section}>
        <label>Dịch vụ đã chọn:</label>
        <ul className={styles.serviceList}>
          {services.map((s) => (
            <li
              key={s.id}
              className={`${styles.serviceItem} ${
                s.selected ? styles.activeService : ""
              }`}
              onClick={() => handleToggleService(s.id)}
            >
              <input
                type="checkbox"
                checked={s.selected}
                onChange={() => handleToggleService(s.id)}
              />
              <span>{s.name}</span>
              <span className={styles.price}>
                {s.price.toLocaleString()}đ
              </span>
            </li>
          ))}
        </ul>
      </div>

                {voucher ? (
            <div className={styles.voucherBox}>
                <div className={styles.voucherHeader}>
                <span>🎟 <strong>Mã giảm giá</strong></span>
                <span className={styles.code}>{voucher.code}</span>
                </div>
                <p className={styles.voucherDetail}>
                Giảm <strong>{voucher.discountPercent}%</strong> • Tiết kiệm{" "}
                <strong>{discount.toLocaleString()}đ</strong>
                </p>
            </div>
            ) : (
            <div className={styles.voucherBoxEmpty}>
                🎟 Chưa áp dụng mã giảm giá
            </div>
            )}


      <div className={styles.totalBox}>
        <span>Tổng cộng:</span>
        <strong>{total.toLocaleString()}đ</strong>
      </div>

      <button onClick={onNext} className={styles.nextBtn}>
        Tiếp tục ➜
      </button>
    </div>
  );
}

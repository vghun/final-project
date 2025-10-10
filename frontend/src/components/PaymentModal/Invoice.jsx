import React, { useState } from "react";
import styles from "./PaymentModal.module.scss";

export default function Invoice({ data, onBack, onClose }) {
  const [isPaid, setIsPaid] = useState(false);
  const { booking = {}, services = [], tip = 0, voucher = null } = data || {};

  // ✅ Lọc ra các dịch vụ đã được chọn
  const selectedServices = services.filter((s) => s.selected);

  // ✅ Tính tổng giá dịch vụ
  const totalServicePrice = selectedServices.reduce(
    (sum, s) => sum + (s.price || 0),
    0
  );

  // ✅ Giảm giá từ voucher (nếu có)
  const discount = voucher?.discountPercent
    ? (totalServicePrice * voucher.discountPercent) / 100
    : 0;

  // ✅ Tổng tiền cuối
  const total = totalServicePrice - discount + tip;

  const handleConfirm = () => {
    setIsPaid(true);
    setTimeout(onClose, 2000);
  };

  const formatVND = (num) =>
    num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className={styles.invoiceContainer}>
      <div className={styles.invoiceCard}>
        <h2 className={styles.invoiceTitle}>🧾 Hóa đơn thanh toán</h2>

        <div className={styles.section}>
          <h3>Thông tin đặt lịch</h3>
          <p><strong>Khách hàng:</strong> {booking.customer || "—"}</p>
          <p><strong>Thợ cắt:</strong> {booking.barber || "—"}</p>
          <p><strong>Thời gian:</strong> {booking.time || "—"}</p>
          <p><strong>Chi nhánh:</strong> {booking.branch || "—"}</p>
        </div>

        <div className={styles.section}>
          <h3>Dịch vụ đã chọn</h3>
          {selectedServices.length > 0 ? (
            <ul className={styles.serviceList}>
              {selectedServices.map((s) => (
                <li key={s.id}>
                  <span>{s.name}</span>
                  <span>{formatVND(s.price)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Không có dịch vụ nào được chọn</p>
          )}
        </div>

        <div className={styles.section}>
          {/* ✅ Hiển thị voucher */}
          <div className={styles.voucherRow}>
            <span>🎟️ Voucher</span>
            {voucher ? (
              <span>
                {voucher.title} (-{voucher.discountPercent}%)
              </span>
            ) : (
              <span>Không áp dụng</span>
            )}
          </div>

          {/* ✅ Hiển thị giảm giá nếu có */}
          {discount > 0 && (
            <div className={styles.discountRow}>
              <span>Giảm giá</span>
              <span>-{formatVND(discount)}</span>
            </div>
          )}

          <div className={styles.tipRow}>
            <span>💖 Tiền tip</span>
            <span>{formatVND(tip)}</span>
          </div>

          <div className={styles.totalRow}>
            <span>Tổng cộng</span>
            <strong>{formatVND(total)}</strong>
          </div>
        </div>

        {!isPaid ? (
          <div className={styles.btnGroup}>
            <button onClick={onBack} className={styles.backBtn}>⬅ Quay lại</button>
            <button onClick={handleConfirm} className={styles.confirmBtn}>
              💵 Xác nhận thanh toán
            </button>
          </div>
        ) : (
          <div className={styles.successBox}>
            ✅ <span>Thanh toán thành công!</span>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import styles from "./PaymentModal.module.scss";

export default function Step4_Invoice({ data, onBack, onClose }) {
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { booking = {}, services = [], tip = 0, voucher = null, serviceRating = 0 } = data || {};

  // ✅ Lọc dịch vụ đã chọn
  const selectedServices = services.filter((s) => s.selected);

  // ✅ Tính toán tổng tiền
  const totalServicePrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const discount = voucher?.discountPercent ? (totalServicePrice * voucher.discountPercent) / 100 : 0;
  const total = totalServicePrice - discount + tip;

  const formatVND = (num) => num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // ✅ Hàm xử lý thanh toán
  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1️⃣ Cập nhật trạng thái thanh toán
      const payRes = await fetch(`http://localhost:8088/api/bookings/${booking.id}/pay`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPaid: true,
          total,
          tip,
          services: selectedServices.map((s) => s.id),
        }),
      });

      if (!payRes.ok) throw new Error("Không thể cập nhật trạng thái thanh toán");
      await payRes.json();

      // 2️⃣ Gửi đánh giá thợ (nếu có rating)
      if (booking?.barberId && serviceRating > 0) {
        await fetch(`http://localhost:8088/api/ratings/barber/${booking.barberId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rate: serviceRating }),
        });
      }

      // ✅ Đánh dấu thanh toán thành công
      setIsPaid(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("❌ Có lỗi xảy ra khi thanh toán!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.invoiceContainer}>
      <div className={styles.invoiceCard}>
        <h2 className={styles.invoiceTitle}>🧾 Hóa đơn thanh toán</h2>

        {/* ✅ Thông tin đặt lịch */}
        <div className={styles.section}>
          <h3>Thông tin đặt lịch</h3>
          <p>
            <strong>Khách hàng:</strong> {booking.customer || "—"}
          </p>
          <p>
            <strong>Thợ cắt:</strong> {booking.barber || "—"}
          </p>
          <p>
            <strong>Thời gian:</strong> {booking.time || "—"}
          </p>
          <p>
            <strong>Chi nhánh:</strong> {booking.branch || "—"}
          </p>
        </div>

        {/* ✅ Dịch vụ đã chọn */}
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

        {/* ✅ Thông tin giảm giá / tip / tổng */}
        <div className={styles.section}>
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
            <button onClick={onBack} className={styles.backBtn}>
              ⬅ Quay lại
            </button>
            <button onClick={handleConfirm} className={styles.confirmBtn} disabled={loading}>
              {loading ? "Đang xử lý..." : "💵 Xác nhận thanh toán"}
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

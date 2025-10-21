import React, { useEffect, useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import styles from "./PaymentModal.module.scss";

export default function BookingInfo({ data, setData, onNext }) {
  const { booking, services, voucher } = data;
  const [branchServices, setBranchServices] = useState([]);
  const [showBranchServices, setShowBranchServices] = useState(false);

  // ✅ Lấy danh sách dịch vụ của chi nhánh
  useEffect(() => {
    if (!booking?.branch) return;

    const fetchBranchServices = async () => {
      try {
        const branchId =
          booking.branchId ||
          booking.raw?.branch?.idBranch ||
          1; // fallback tạm
        const res = await fetch(`http://localhost:8088/api/bookings/branches/${branchId}`);
        const result = await res.json();

        if (result?.services) {
          setBranchServices(
            result.services.map((s) => ({
              id: s.idService,
              name: s.name,
              price: parseFloat(s.price),
              selected: services.some((sv) => sv.id === s.idService && sv.selected),
            }))
          );
        }
      } catch (error) {
        console.error("Lỗi khi tải dịch vụ của chi nhánh:", error);
      }
    };

    fetchBranchServices();
  }, [booking?.branch]);

  // ✅ Toggle chọn dịch vụ
  const handleToggleService = (id) => {
    const updatedServices = branchServices.map((s) =>
      s.id === id ? { ...s, selected: !s.selected } : s
    );
    setBranchServices(updatedServices);
    setData({
      ...data,
      services: updatedServices.filter((s) => s.selected),
    });
  };

  // ✅ Dịch vụ đã chọn
  const selectedServices = branchServices.filter((s) => s.selected);
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const discount =
    voucher && voucher.discountPercent ? (subtotal * voucher.discountPercent) / 100 : 0;
  const total = subtotal - discount;

  return (
    <div className={styles.step1Container}>
      <h2 className={styles.title}>Xác nhận thông tin đặt lịch</h2>

      {/* 🔹 Thông tin cơ bản */}
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

      {/* 🔹 Thêm dịch vụ khác (có nút ẩn/hiện) */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Thêm dịch vụ khác trong chi nhánh</h3>
          <button
            className={styles.toggleBtn}
            onClick={() => setShowBranchServices(!showBranchServices)}
          >
            {showBranchServices ? (
              <>
                <MinusCircle size={18} /> Ẩn
              </>
            ) : (
              <>
                <PlusCircle size={18} /> Thêm
              </>
            )}
          </button>
        </div>

        {showBranchServices && (
          <ul className={styles.serviceList}>
            {branchServices.map((s) => (
              <li
                key={s.id}
                className={`${styles.serviceItem} ${s.selected ? styles.activeService : ""}`}
                onClick={() => handleToggleService(s.id)}
              >
                <input
                  type="checkbox"
                  checked={s.selected}
                  onChange={() => handleToggleService(s.id)}
                />
                <span>{s.name}</span>
                <span className={styles.price}>{s.price.toLocaleString()}đ</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 Dịch vụ khách đã chọn */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Dịch vụ khách đã chọn</h3>
        {selectedServices.length === 0 ? (
          <p className={styles.emptyText}>Chưa chọn dịch vụ nào</p>
        ) : (
          <ul className={styles.serviceList}>
            {selectedServices.map((s) => (
              <li key={s.id} className={styles.serviceItem}>
                <span>{s.name}</span>
                <span className={styles.price}>{s.price.toLocaleString()}đ</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 Voucher */}
      {voucher ? (
        <div className={styles.voucherBox}>
          <div className={styles.voucherHeader}>
            <span>
              🎟 <strong>Mã giảm giá</strong>
            </span>
            <span className={styles.code}>{voucher.code}</span>
          </div>
          <p className={styles.voucherDetail}>
            Giảm <strong>{voucher.discountPercent}%</strong> • Tiết kiệm{" "}
            <strong>{discount.toLocaleString()}đ</strong>
          </p>
        </div>
      ) : (
        <div className={styles.voucherBoxEmpty}>🎟 Chưa áp dụng mã giảm giá</div>
      )}

      {/* 🔹 Tổng cộng */}
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

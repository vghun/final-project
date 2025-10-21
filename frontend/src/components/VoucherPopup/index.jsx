import React, { useState, useEffect } from "react";
import styles from "./VoucherPopup.module.scss";
import * as voucherService from "~/services/voucherService";

function VoucherPopup({ idCustomer, onClose, onSelect }) {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);

        const customerVouchers = await voucherService.getCustomerVouchers(); 
        const availableVouchers = await voucherService.getAvailableVouchersByPoint();

        const allVouchers = [
          // Voucher đã đổi
          ...customerVouchers.map((v) => ({
            id: v.voucher.idVoucher,
            code: v.voucherCode,
            title: v.voucher.title,
            description: v.voucher.description || "-",
            discount: parseFloat(v.voucher.discountPercent).toFixed(2),
            pointCost: v.voucher.pointCost,
            expireDate: v.voucher.expiryDate,
            totalQuantity: v.voucher.totalQuantity ?? "Không giới hạn",
            status: v.voucher.status ?? false,
            exchanged: true,
          })),
          // Voucher chưa đổi
          ...availableVouchers.map((v) => ({
            id: v.idVoucher,
            code: null,
            title: v.title,
            description: v.description || "-",
            discount: parseFloat(v.discountPercent).toFixed(2),
            pointCost: v.pointCost,
            expireDate: v.expiryDate,
            totalQuantity: v.totalQuantity ?? "Không giới hạn",
            status: v.status ?? false,
            exchanged: false,
          })),
        ];

        setVouchers(allVouchers);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách voucher:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [idCustomer]);

  const handleApplyVoucher = (voucher) => {
    onSelect(voucher);
    onClose();
  };

  const handleConfirmExchange = async () => {
    if (!selectedVoucher) return;
    try {
      await voucherService.exchangeVoucher(selectedVoucher.id);
      alert(`Đổi voucher ${selectedVoucher.title} thành công!`);

      setVouchers((prev) =>
        prev.map((v) =>
          v.id === selectedVoucher.id ? { ...v, exchanged: true } : v
        )
      );
      setSelectedVoucher(null);
    } catch (error) {
      alert(error.message || "Đổi voucher thất bại!");
      console.error(error);
    }
  };

  if (loading) return <div className={styles.overlay}>Đang tải...</div>;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Chọn Voucher</h3>
        <ul className={styles.voucherList}>
          {vouchers.map((voucher) => (
            <li key={voucher.id} className={styles.voucherItem}>
              <div className={styles.info}>
                <p className={styles.title}><strong>{voucher.title}</strong></p>
                <p className={styles.description}>{voucher.description}</p>
                <p className={styles.discount}>Giảm {voucher.discount}%</p>
                <p className={styles.pointCost}>Giá điểm: {voucher.pointCost}</p>
                <p className={styles.totalQuantity}>
                  Số lượng còn: {voucher.totalQuantity}
                </p>
                <p className={styles.status}>
                  Trạng thái: {voucher.status ? "Còn hiệu lực" : "Hết hiệu lực"}
                </p>
                <p className={styles.expire}>
                  Hết hạn: {new Date(voucher.expireDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className={styles.actions}>
                {voucher.exchanged ? (
                  <button
                    className={styles.useBtn}
                    onClick={() => handleApplyVoucher(voucher)}
                  >
                    Áp dụng
                  </button>
                ) : (
                  <button
                    className={styles.exchangeBtn}
                    onClick={() => setSelectedVoucher(voucher)}
                  >
                    Đổi ngay ({voucher.pointCost} điểm)
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>Đóng</button>
        </div>
      </div>

      {selectedVoucher && (
        <div className={styles.fullOverlay}>
          <div className={styles.confirmBox}>
            <h4>Xác nhận đổi</h4>
            <p>
              Bạn có chắc chắn muốn đổi voucher <strong>{selectedVoucher.title}</strong> với{" "}
              <strong>{selectedVoucher.pointCost} điểm</strong>?
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmBtn} onClick={handleConfirmExchange}>Đồng ý</button>
              <button className={styles.cancelBtn} onClick={() => setSelectedVoucher(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoucherPopup;

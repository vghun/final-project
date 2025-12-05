// Updated VoucherPopup.js
import React, { useState, useEffect } from "react";
import styles from "./VoucherPopup.module.scss";
import * as voucherService from "~/services/voucherService";

function VoucherPopup({ idCustomer, onClose, onSelect, appliedVoucher }) {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentApplied, setCurrentApplied] = useState(appliedVoucher || null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const customerVouchers = await voucherService.getCustomerVouchers(idCustomer);
        const availableVouchers = await voucherService.getAvailableVouchersByPoint();

        const all = [
          ...customerVouchers.map((v) => ({
            id: v.voucher.idVoucher,
            idCustomerVoucher: v.id,
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
          ...availableVouchers.map((v) => ({
            id: v.idVoucher,
            idCustomerVoucher: null,
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

        setVouchers(all);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, [idCustomer]);

  const handleApply = (voucher) => {
    setCurrentApplied(voucher);
    onSelect(voucher);
    onClose();
  };

  const handleRemoveApplied = () => {
    setCurrentApplied(null);
    onSelect(null);
  };

  const handleConfirmExchange = async () => {
    if (!selectedVoucher) return;
    try {
      const exchanged = await voucherService.exchangeVoucher(selectedVoucher.id);

      setVouchers((prev) =>
        prev.map((v) =>
          v.id === selectedVoucher.id
            ? { ...v, exchanged: true, idCustomerVoucher: exchanged.idCustomerVoucher }
            : v
        )
      );

      setSelectedVoucher(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className={styles.overlay}>Đang tải...</div>;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Chọn Voucher</h3>

        {currentApplied && (
          <div className={styles.appliedBox}>
            <p>Đang áp dụng: <strong>{currentApplied.title}</strong></p>
            <button onClick={handleRemoveApplied} className={styles.cancelBtn}>Bỏ áp dụng</button>
          </div>
        )}

        <ul className={styles.voucherList}>
          {vouchers.map((v) => {
            const isApplied = currentApplied && currentApplied.id === v.id;
            return (
              <li key={v.id} className={styles.voucherItem}>
                <div className={styles.info}>
                  <p className={styles.title}><strong>{v.title}</strong></p>
                  <p className={styles.description}>{v.description}</p>
                  <p className={styles.discount}>Giảm {v.discount}%</p>
                  <p className={styles.expire}>Hết hạn: {new Date(v.expireDate).toLocaleDateString("vi-VN")}</p>
                </div>

                <div className={styles.actions}>
                  {isApplied ? (
                    <span className={styles.appliedLabel}>Đang áp dụng</span>
                  ) : v.exchanged ? (
                    <button className={styles.applyBtn} onClick={() => handleApply(v)}>Áp dụng</button>
                  ) : (
                    <button className={styles.exchangeBtn} onClick={() => setSelectedVoucher(v)}>
                      Đổi ngay ({v.pointCost} điểm)
                    </button>
                  )}
                </div>
              </li>
            );
          })}
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
              Đổi voucher <strong>{selectedVoucher.title}</strong> với {selectedVoucher.pointCost} điểm?
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
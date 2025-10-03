import React, { useState } from "react";
import styles from "./VoucherPopup.module.scss";

function VoucherPopup({ vouchers, onClose, onSelect }) {
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const handleConfirmExchange = () => {
    alert(`Đổi voucher ${selectedVoucher.code} thành công!`);
    // sau này call API thật ở đây
    setSelectedVoucher(null);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Chọn Voucher</h3>
        <ul className={styles.voucherList}>
          {vouchers.map((voucher, i) => (
            <li key={i} className={styles.voucherItem}>
              <div className={styles.info}>
                <p className={styles.code}>{voucher.code}</p>
                <p className={styles.desc}>{voucher.description}</p>
                <p className={styles.discount}>Giảm {voucher.discount}%</p>
                <p className={styles.expire}>
                  Hết hạn: {voucher.expireDate}
                </p>
              </div>
              <div className={styles.actions}>
                {voucher.exchanged ? (
                  <button
                    className={styles.useBtn}
                    onClick={() => {
                      onSelect(voucher);
                      onClose();
                    }}
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
          <button className={styles.closeBtn} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>

      {/* Form confirm khi bấm "Đổi ngay" */}
     {selectedVoucher && (
  <div className={styles.fullOverlay}>
    <div className={styles.confirmBox}>
      <h4>Xác nhận đổi</h4>
      <p>
        Bạn có chắc chắn muốn đổi voucher{" "}
        <strong>{selectedVoucher.code}</strong> với{" "}
        <strong>{selectedVoucher.pointCost} điểm</strong>?
      </p>
      <div className={styles.confirmActions}>
        <button
          className={styles.confirmBtn}
          onClick={handleConfirmExchange}
        >
          Đồng ý
        </button>
        <button
          className={styles.cancelBtn}
          onClick={() => setSelectedVoucher(null)}
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default VoucherPopup;

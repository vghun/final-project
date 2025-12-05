import React, { useState, useEffect } from "react";
import styles from "./VoucherPopup.module.scss";
import * as voucherService from "~/services/voucherService";

function VoucherPopup({ idCustomer, onClose, onSelect }) {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Voucher muốn đổi
  const [appliedVoucher, setAppliedVoucher] = useState(null); // Voucher đang được áp dụng
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);

        const customerVouchers = await voucherService.getCustomerVouchers(idCustomer);
        const availableVouchers = await voucherService.getAvailableVouchersByPoint();

        const allVouchers = [
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
            code: null,
            title: v.title,
            description: v.description || "-",
            discount: parseFloat(v.discountPercent).toFixed(2),
            pointCost: v.pointCost,
            expireDate: v.expiryDate,
            totalQuantity: v.totalQuantity ?? "Không giới hạn",
            status: v.status ?? false,
            exchanged: false,
            idCustomerVoucher: null,
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

  // Áp dụng voucher
  const handleApplyVoucher = (voucher) => {
    setAppliedVoucher(voucher);   // lưu trạng thái áp dụng
    onSelect(voucher);            // gửi về parent
    onClose();
  };

  // Bỏ áp dụng voucher
  const handleRemoveApplied = () => {
    setAppliedVoucher(null);
    onSelect(null); // Báo parent rằng không dùng voucher nào
    onClose();
  };

  // Xác nhận đổi voucher
  const handleConfirmExchange = async () => {
    if (!selectedVoucher) return;

    try {
      const exchangedVoucher = await voucherService.exchangeVoucher(selectedVoucher.id);

      alert(`Đổi voucher ${selectedVoucher.title} thành công!`);

      setVouchers((prev) =>
        prev.map((v) =>
          v.id === selectedVoucher.id
            ? { ...v, exchanged: true, idCustomerVoucher: exchangedVoucher.idCustomerVoucher }
            : v
        )
      );

      // Không áp dụng liền — chỉ chuyển sang trạng thái đã đổi
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

        {/* Banner voucher đang áp dụng */}
        {appliedVoucher && (
          <div className={styles.appliedBox}>
            <p>
              <strong>Đang áp dụng:</strong> {appliedVoucher.title}
            </p>
            <button className={styles.removeBtn} onClick={handleRemoveApplied}>
              Bỏ áp dụng
            </button>
          </div>
        )}

        <ul className={styles.voucherList}>
          {vouchers.map((voucher) => {
            const isApplied = appliedVoucher?.id === voucher.id;

            return (
              <li key={voucher.id} className={styles.voucherItem}>
                <div className={styles.info}>
                  <p className={styles.title}><strong>{voucher.title}</strong></p>
                  <p className={styles.description}>{voucher.description}</p>
                  <p className={styles.discount}>Giảm {voucher.discount}%</p>
                  <p className={styles.pointCost}>Giá điểm: {voucher.pointCost}</p>
                  <p className={styles.totalQuantity}>Số lượng còn: {voucher.totalQuantity}</p>
                  <p className={styles.status}>Trạng thái: {voucher.status ? "Còn hiệu lực" : "Hết hiệu lực"}</p>
                  <p className={styles.expire}>
                    Hết hạn: {new Date(voucher.expireDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <div className={styles.actions}>
                  {voucher.exchanged ? (
                    isApplied ? (
                      <span className={styles.appliedTag}>Đang áp dụng</span>
                    ) : (
                      <button className={styles.useBtn} onClick={() => handleApplyVoucher(voucher)}>
                        Áp dụng
                      </button>
                    )
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
              Bạn có chắc chắn muốn đổi voucher{" "}
              <strong>{selectedVoucher.title}</strong> với{" "}
              <strong>{selectedVoucher.pointCost} điểm</strong>?
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmBtn} onClick={handleConfirmExchange}>
                Đồng ý
              </button>
              <button className={styles.cancelBtn} onClick={() => setSelectedVoucher(null)}>
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

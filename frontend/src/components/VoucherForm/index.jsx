import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./VoucherForm.module.scss";
import { VoucherAPI } from "~/apis/voucherAPI"; // import API
import { useToast } from "~/context/ToastContext"; // import Toast

const cx = classNames.bind(styles);

function VoucherForm({ onClose, onVoucherCreated }) {
  const { showToast } = useToast();

  const [title, setTitle] = useState("");           
  const [discountPercent, setDiscountPercent] = useState("");
  const [pointCost, setPointCost] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const voucherData = {
      title,
      discountPercent: Number(discountPercent),
      pointCost: Number(pointCost),
      totalQuantity: totalQuantity ? Number(totalQuantity) : null,
      expiryDate,
      description,
    };

    setLoading(true);
    try {
      const result = await VoucherAPI.create(voucherData);
      if (result.success) {
        showToast({ text: "Tạo voucher thành công!", type: "success", duration: 3000 });
        onVoucherCreated?.(); // reload danh sách voucher
        onClose();
      } else {
        showToast({ text: "Tạo voucher thất bại: " + result.message, type: "error", duration: 3000 });
      }
    } catch (error) {
      showToast({ text: "Lỗi khi gọi API: " + error.message, type: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDiscountChange = (e) => {
    let value = e.target.value;
    if (value === "") return setDiscountPercent("");
    value = Math.max(0, Math.min(100, Number(value)));
    setDiscountPercent(value);
  };

  const handleQuantityChange = (e) => {
    let value = e.target.value;
    if (value === "") return setTotalQuantity("");
    value = Math.max(0, Number(value));
    setTotalQuantity(value);
  };

  return (
    <div className={cx("voucherFormOverlay")}>
      <form className={cx("voucherForm")} onSubmit={handleSubmit}>
        <h3>Tạo voucher mới</h3>

        <label>Tên voucher</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Giảm giá (%)</label>
        <input
          type="number"
          value={discountPercent}
          onChange={handleDiscountChange}
          required
          min="0"
          max="100"
        />

        <label>Điểm đổi</label>
        <input
          type="number"
          value={pointCost}
          onChange={(e) => setPointCost(e.target.value)}
          required
          min="0"
        />

        <label>Giới hạn số lượng</label>
        <input
          type="number"
          value={totalQuantity}
          onChange={handleQuantityChange}
          min="0"
        />

        <label>Ngày hết hạn</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />

        <label>Mô tả</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={cx("formButtons")}>
          <button type="submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo"}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default VoucherForm;

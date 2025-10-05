import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./BonusModal.module.scss";

const cx = classNames.bind(styles);

function BonusModal({ initialData, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    minRevenue: "",
    bonusAmount: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        minRevenue: initialData.minRevenue || "",
        bonusAmount: initialData.bonusAmount || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.minRevenue || !form.bonusAmount) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onCreate(form);
  };

  return (
    <div className={cx("modal-overlay")}>
      <div className={cx("modal")}>
        <h2>{initialData ? "Chỉnh sửa thưởng doanh số" : "Tạo thưởng doanh số"}</h2>

        <form onSubmit={handleSubmit} className={cx("form")}>
          <div className={cx("form-group")}>
            <label>Tên chính sách</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ví dụ: Thưởng tháng 10"
            />
          </div>

          <div className={cx("form-group")}>
            <label>Doanh số tối thiểu (VNĐ)</label>
            <input
              type="number"
              name="minRevenue"
              value={form.minRevenue}
              onChange={handleChange}
              placeholder="Ví dụ: 50000000"
            />
          </div>

          <div className={cx("form-group")}>
            <label>Tiền thưởng (VNĐ)</label>
            <input
              type="number"
              name="bonusAmount"
              value={form.bonusAmount}
              onChange={handleChange}
              placeholder="Ví dụ: 5000000"
            />
          </div>

          <div className={cx("form-group")}>
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ghi chú thêm (không bắt buộc)"
            ></textarea>
          </div>

          <div className={cx("buttons")}>
            <button type="submit" className={cx("btn", "btn-save")}>
              {initialData ? "Cập nhật" : "Tạo mới"}
            </button>
            <button
              type="button"
              className={cx("btn", "btn-cancel")}
              onClick={onClose}
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BonusModal;

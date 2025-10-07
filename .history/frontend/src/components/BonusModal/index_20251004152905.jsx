import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./BonusModal.module.scss";

const cx = classNames.bind(styles);

function BonusModal({ initialData, onClose, onCreate }) {
  const [form, setForm] = useState({
    minRevenue: "",
    maxRevenue: "",
    bonusPercent: "",
    note: "",
    active: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        minRevenue: initialData.minRevenue || "",
        maxRevenue: initialData.maxRevenue || "",
        bonusPercent: initialData.bonusPercent || "",
        note: initialData.note || "",
        active: initialData.active ?? true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.minRevenue || !form.bonusPercent) {
      alert("Vui lòng nhập doanh số tối thiểu và phần trăm thưởng!");
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
            <label>Doanh số tối thiểu (VNĐ)</label>
            <input
              type="number"
              name="minRevenue"
              value={form.minRevenue}
              onChange={handleChange}
              placeholder="Ví dụ: 10000000"
            />
          </div>

          <div className={cx("form-group")}>
            <label>Doanh số tối đa (VNĐ)</label>
            <input
              type="number"
              name="maxRevenue"
              value={form.maxRevenue}
              onChange={handleChange}
              placeholder="Bỏ trống nếu không giới hạn"
            />
          </div>

          <div className={cx("form-group")}>
            <label>Phần trăm thưởng (%)</label>
            <input
              type="number"
              name="bonusPercent"
              step="0.1"
              value={form.bonusPercent}
              onChange={handleChange}
              placeholder="Ví dụ: 5.5"
            />
          </div>

          <div className={cx("form-group")}>
            <label>Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Mô tả thêm (không bắt buộc)"
            ></textarea>
          </div>

          <div className={cx("form-group", "checkbox-group")}>
            <label>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Kích hoạt
            </label>
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

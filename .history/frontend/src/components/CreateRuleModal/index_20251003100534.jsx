// components/CreateRuleModal.jsx
import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./CreateRuleModal.module.scss";

const cx = classNames.bind(styles);

function CreateRuleModal({ onClose, onCreate, initialData }) {
  const [form, setForm] = useState({
    money_per_point: "",
    point_multiplier: 1,
    min_order_amount: "",
    is_default: false,
    is_active: true,
    start_date: "",
    end_date: "",
  });

  const [error, setError] = useState("");

  // Nếu có initialData (sửa), điền sẵn form
  useEffect(() => {
    if (initialData) {
      setForm({
        money_per_point: initialData.money_per_point || "",
        point_multiplier: initialData.point_multiplier || 1,
        min_order_amount: initialData.min_order_amount || "",
        is_default: initialData.is_default || false,
        is_active: initialData.is_active ?? true,
        start_date: initialData.start_date
        ? initialData.start_date.slice(0, 10)
        : "",
      end_date: initialData.end_date
        ? initialData.end_date.slice(0, 10)
        : "",
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
const handleSubmit = () => {
  if (!form.is_default && (!form.start_date || !form.end_date)) {
    setError("Start Date và End Date là bắt buộc cho rule không mặc định");
    return;
  }

  const payload = {
    ...form,
    start_date: form.is_default ? null : form.start_date,
    end_date: form.is_default ? null : form.end_date,
  };

  setError("");
  onCreate(payload);
  onClose();
};


  return (
    <div className={cx("modal-overlay")}>
      <div className={cx("modal")}>
        <h2>{initialData ? "Sửa Rule" : "Chính Sách Mới"}</h2>

        <div className={cx("field")}>
          <label>Số tiền trên 1 điểm (VND)</label>
          <input
            type="number"
            name="money_per_point"
            value={form.money_per_point}
            onChange={handleChange}
          />
        </div>

        <div className={cx("field")}>
          <label>Hệ số nhân điểm</label>
          <input
            type="number"
            step="0.1"
            name="point_multiplier"
            value={form.point_multiplier}
            onChange={handleChange}
          />
        </div>

        <div className={cx("field")}>
          <label>Đơn tối thiểu (VND)</label>
          <input
            type="number"
            name="min_order_amount"
            value={form.min_order_amount}
            onChange={handleChange}
          />
        </div>

        <div className={cx("field-checkbox")}>
          <label>
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
            />
            Rule mặc định
          </label>
        </div>

        {/* start/end date */}
        <div className={cx("date-fields", { hidden: form.is_default })}>
          <div className={cx("field")}>
            <label>Ngày bắt đầu</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>
          <div className={cx("field")}>
            <label>Ngày kết thúc</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={cx("field-checkbox")}>
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Kích hoạt ngay
          </label>
        </div>

        {error && <p className={cx("error")}>{error}</p>}

        <div className={cx("actions")}>
          <button className={cx("btn")} onClick={handleSubmit}>
            {initialData ? "Cập nhật" : "Tạo"}
          </button>
          <button className={cx("btn")} onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRuleModal;

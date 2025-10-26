import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./BonusModal.module.scss";

const cx = classNames.bind(styles);

function BonusModal({ initialData, onClose, onCreate }) {
  const [form, setForm] = useState({
    minRevenue: "",
    bonusPercent: "",
    note: "",
    active: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        minRevenue: initialData.minRevenue
          ? Number(initialData.minRevenue).toLocaleString("vi-VN")
          : "",
        bonusPercent: initialData.bonusPercent || "",
        note: initialData.note || "",
        active: initialData.active ?? true,
      });
    }
  }, [initialData]);

  // Format số tiền VNĐ khi nhập
  const formatCurrency = (value) => {
    if (!value) return "";
    const numeric = value.toString().replace(/\D/g, "");
    return numeric ? Number(numeric).toLocaleString("vi-VN") : "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "minRevenue") {
      setForm((prev) => ({
        ...prev,
        [name]: formatCurrency(value),
      }));
    } else if (name === "bonusPercent") {
      const numeric = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: numeric }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.minRevenue || !form.bonusPercent) {
      alert("Vui lòng nhập doanh số tối thiểu và phần trăm thưởng!");
      return;
    }

    const payload = {
      ...form,
      minRevenue: Number(form.minRevenue.toString().replace(/\./g, "")),
      bonusPercent: Number(form.bonusPercent),
    };

    onCreate(payload);
  };

  return (
    <div className={cx("modal-overlay")}>
      <div className={cx("modal")}>
        <h2>{initialData ? "Chỉnh sửa thưởng doanh số" : "Tạo thưởng doanh số"}</h2>

        <form onSubmit={handleSubmit} className={cx("form")}>
          <div className={cx("form-group")}>
            <label>Doanh số tối thiểu (VNĐ)</label>
            <input
              type="text"
              name="minRevenue"
              value={form.minRevenue}
              onChange={handleChange}
              placeholder="Ví dụ: 10.000.000"
            />
          </div>

          <div className={cx("form-group")}>
            <label>Phần trăm thưởng (%)</label>
            <input
              type="text"
              name="bonusPercent"
              value={form.bonusPercent}
              onChange={handleChange}
              placeholder="Ví dụ: 5"
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

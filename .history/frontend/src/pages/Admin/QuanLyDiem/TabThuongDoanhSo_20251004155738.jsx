import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./QuanLyDiem.module.scss";

const cx = classNames.bind(styles);

export default function BonusModal({ initialData, onClose, onCreate }) {
  const [form, setForm] = useState({
    minRevenue: "",
    maxRevenue: "",
    bonusPercent: "",
    note: "",
    active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  // Hàm format số thành string có dấu chấm
  const formatNumber = (value) => {
    if (!value) return "";
    const num = value.toString().replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (field, value) => {
    // chỉ cho phép số và xóa các ký tự khác
    if (["minRevenue", "maxRevenue"].includes(field)) {
      const formatted = formatNumber(value);
      setForm((prev) => ({ ...prev, [field]: formatted }));
    } else if (field === "bonusPercent") {
      // chỉ cho phép số từ 0-100
      const num = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, bonusPercent: num }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const minRev = Number(form.minRevenue.replace(/\./g, ""));
    const maxRev = Number(form.maxRevenue.replace(/\./g, ""));
    const bonus = Number(form.bonusPercent);

    if (!form.minRevenue) newErrors.minRevenue = "Vui lòng nhập doanh thu tối thiểu";
    else if (isNaN(minRev)) newErrors.minRevenue = "Phải là số hợp lệ";

    if (!form.maxRevenue) newErrors.maxRevenue = "Vui lòng nhập doanh thu tối đa";
    else if (isNaN(maxRev)) newErrors.maxRevenue = "Phải là số hợp lệ";

    if (minRev && maxRev && minRev > maxRev) newErrors.maxRevenue = "Doanh thu tối đa phải lớn hơn hoặc bằng tối thiểu";

    if (!form.bonusPercent) newErrors.bonusPercent = "Vui lòng nhập % thưởng";
    else if (isNaN(bonus) || bonus < 0 || bonus > 100) newErrors.bonusPercent = "% thưởng phải từ 0 đến 100";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onCreate(form);
  };

  return (
    <div className={cx("modalOverlay")}>
      <div className={cx("modalContent")}>
        <h3>{initialData ? "Sửa quy tắc" : "Tạo quy tắc mới"}</h3>

        <div className={cx("formGroup")}>
          <label>Doanh thu tối thiểu</label>
          <input
            type="text"
            value={form.minRevenue}
            onChange={(e) => handleChange("minRevenue", e.target.value)}
            placeholder="VD: 10.000"
          />
          {errors.minRevenue && <p className={cx("error")}>{errors.minRevenue}</p>}
        </div>

        <div className={cx("formGroup")}>
          <label>Doanh thu tối đa</label>
          <input
            type="text"
            value={form.maxRevenue}
            onChange={(e) => handleChange("maxRevenue", e.target.value)}
            placeholder="VD: 100.000"
          />
          {errors.maxRevenue && <p className={cx("error")}>{errors.maxRevenue}</p>}
        </div>

        <div className={cx("formGroup")}>
          <label>% Thưởng</label>
          <input
            type="text"
            value={form.bonusPercent}
            onChange={(e) => handleChange("bonusPercent", e.target.value)}
            placeholder="VD: 5"
          />
          {errors.bonusPercent && <p className={cx("error")}>{errors.bonusPercent}</p>}
        </div>

        <div className={cx("formGroup")}>
          <label>Ghi chú</label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
          />
        </div>

        <div className={cx("modalActions")}>
          <button className={cx("btn")} onClick={handleSubmit}>Lưu</button>
          <button className={cx("btn")} onClick={onClose}>Huỷ</button>
        </div>
      </div>
    </div>
  );
}

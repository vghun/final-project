import React, { useState, useEffect } from "react";
import BonusModal from "~/components/BonusModal";
import { BonusRuleAPI } from "~/apis/bonusRuleAPI";
import classNames from "classnames/bind";
import styles from "./QuanLyDiem.module.scss";

const cx = classNames.bind(styles);

export default function TabThuongDoanhSo() {
  const [bonusRules, setBonusRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  useEffect(() => {
    fetchBonusRules();
  }, []);

  const fetchBonusRules = async () => {
    try {
      const data = await BonusRuleAPI.getAll();
      setBonusRules(data);
    } catch (error) {
      console.error("Lỗi load bonus rules:", error);
    }
  };

  const handleSaveRule = async (ruleData) => {
    // Validate dữ liệu trước khi gửi
    const min = Number(ruleData.minRevenue.toString().replace(/\./g, ""));
    const max = Number(ruleData.maxRevenue.toString().replace(/\./g, ""));
    const bonus = Number(ruleData.bonusPercent);

    if (isNaN(min) || isNaN(max) || isNaN(bonus)) {
      alert("Các trường phải là số hợp lệ");
      return;
    }
    if (min > max) {
      alert("Doanh thu tối đa phải lớn hơn hoặc bằng tối thiểu");
      return;
    }
    if (bonus < 0 || bonus > 100) {
      alert("% thưởng phải từ 0–100");
      return;
    }

    try {
      const payload = {
        ...ruleData,
        minRevenue: min,
        maxRevenue: max,
        bonusPercent: bonus,
      };

      if (editingRule) {
        const updated = await BonusRuleAPI.update(editingRule.id, payload);
        setBonusRules((prev) =>
          prev.map((r) => (r.id === editingRule.id ? updated : r))
        );
      } else {
        const created = await BonusRuleAPI.create(payload);
        setBonusRules((prev) => [...prev, created]);
      }

      setShowModal(false);
      setEditingRule(null);
    } catch (error) {
      console.error("Lỗi lưu rule:", error);
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      await BonusRuleAPI.delete(id);
      setBonusRules((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Lỗi xoá rule:", error);
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule({
      ...rule,
      minRevenue: Number(rule.minRevenue).toLocaleString("vi-VN"),
      maxRevenue: Number(rule.maxRevenue).toLocaleString("vi-VN"),
      bonusPercent: rule.bonusPercent.toString(),
    });
    setShowModal(true);
  };

  // Format số khi nhập trong modal
  const handleInputChange = (field, value, setForm) => {
    if (["minRevenue", "maxRevenue"].includes(field)) {
      const numStr = value.replace(/\D/g, ""); // chỉ giữ số
      setForm((prev) => ({
        ...prev,
        [field]: numStr ? Number(numStr).toLocaleString("vi-VN") : "",
      }));
    } else if (field === "bonusPercent") {
      const numStr = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [field]: numStr }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div>
      <div className={cx("header")}>
        <h2>Chính sách thưởng doanh số</h2>
        <div className={cx("actions")}>
          <button
            className={cx("btn")}
            onClick={() => {
              setEditingRule(null);
              setShowModal(true);
            }}
          >
            Tạo mới
          </button>
          <button className={cx("btn")} onClick={fetchBonusRules}>
            Refresh
          </button>
        </div>
      </div>

      <div className={cx("rule-list")}>
        {bonusRules.length > 0 ? (
          <table className={cx("bonus-table")}>
            <thead>
              <tr>
                <th>Doanh thu tối thiểu</th>
                <th>Doanh thu tối đa</th>
                <th>% Thưởng</th>
                <th>Ghi chú</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bonusRules.map((rule) => (
                <tr key={rule.id}>
                  <td>{Number(rule.minRevenue).toLocaleString("vi-VN")}</td>
                  <td>{Number(rule.maxRevenue).toLocaleString("vi-VN")}</td>
                  <td>{rule.bonusPercent}%</td>
                  <td>{rule.note}</td>
                  <td>{rule.active ? "Hoạt động" : "Không hoạt động"}</td>
                  <td>
                    <button
                      className={cx("btn")}
                      onClick={() => handleEditRule(rule)}
                    >
                      Sửa
                    </button>
                    <button
                      className={cx("btn")}
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={cx("emptyText")}>Chưa có quy tắc thưởng nào.</p>
        )}
      </div>

      {showModal && (
        <BonusModal
          initialData={editingRule}
          onClose={() => setShowModal(false)}
          onCreate={handleSaveRule}
          onInputChange={handleInputChange} // truyền vào modal
        />
      )}
    </div>
  );
}

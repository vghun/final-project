import React, { useState, useEffect } from "react";
import LoyaltyRuleCard from "~/components/LoyaltyRuleCard";
import CreateRuleModal from "~/components/CreateRuleModal";
import classNames from "classnames/bind";
import styles from "./QuanLyDiem.module.scss";
import { LoyaltyRuleAPI } from "~/apis/loyaltyRuleAPI"; // import API

const cx = classNames.bind(styles);

function QuanLyDiem() {
  const [rules, setRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // 🟢 Thêm state tab phụ
  const [activeSubTab, setActiveSubTab] = useState("tichdiem"); // "tichdiem" | "thuongdoanhso"

  // Hàm load rule từ API
  const fetchRules = async () => {
    try {
      const data = await LoyaltyRuleAPI.getAll();
      setRules(data);
    } catch (error) {
      console.error("Lỗi load rules:", error);
    }
  };

  // Load lần đầu
  useEffect(() => {
    fetchRules();
  }, []);

  // Tạo mới hoặc cập nhật rule
  const handleSaveRule = async (ruleData) => {
    try {
      if (editingRule) {
        const updated = await LoyaltyRuleAPI.update(editingRule.id, ruleData);
        setRules((prev) =>
          prev.map((r) => (r.id === editingRule.id ? updated : r))
        );
        setEditingRule(null);
      } else {
        const created = await LoyaltyRuleAPI.create(ruleData);
        setRules((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi lưu rule:", error);
    }
  };

  // Xoá rule
  const handleDeleteRule = async (id) => {
    try {
      await LoyaltyRuleAPI.delete(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Lỗi xoá rule:", error);
    }
  };

  // Mở modal sửa
  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setShowModal(true);
  };

  return (
    <div className={cx("wrapper")}>
      {/* ===== Thanh chọn tab phụ ===== */}
      <div className={cx("subTabNav")}>
        <button
          className={cx("subTabBtn", { active: activeSubTab === "tichdiem" })}
          onClick={() => setActiveSubTab("tichdiem")}
        >
          Tích điểm
        </button>
        <button
          className={cx("subTabBtn", { active: activeSubTab === "thuongdoanhso" })}
          onClick={() => setActiveSubTab("thuongdoanhso")}
        >
          Thưởng doanh số
        </button>
      </div>

      {/* ====== NỘI DUNG THEO TAB ====== */}
      {activeSubTab === "tichdiem" && (
        <>
          <div className={cx("header")}>
            <h2>Quản lý chính sách tích điểm</h2>
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
              <button className={cx("btn")} onClick={fetchRules}>
                Refresh
              </button>
            </div>
          </div>

          <div className={cx("rule-list")}>
            {rules.map((rule) => (
              <LoyaltyRuleCard
                key={rule.id}
                rule={rule}
                onEdit={() => handleEditRule(rule)}
                onDelete={() => handleDeleteRule(rule.id)}
              />
            ))}
          </div>

          {showModal && (
            <CreateRuleModal
              initialData={editingRule}
              onClose={() => setShowModal(false)}
              onCreate={handleSaveRule}
            />
          )}
        </>
      )}

      {activeSubTab === "thuongdoanhso" && (
        <div className={cx("bonusSection")}>
          <h2>Chính sách thưởng doanh số</h2>
          <p>
            🏆 Đây là nơi bạn có thể đặt quy tắc thưởng cho nhân viên hoặc chi
            nhánh dựa trên doanh thu đạt được.
          </p>

          <div className={cx("bonusTable")}>
            <table>
              <thead>
                <tr>
                  <th>Mức doanh thu</th>
                  <th>Thưởng</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>&lt; 50.000.000đ</td>
                  <td>Không thưởng</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>50.000.000đ - 100.000.000đ</td>
                  <td>2%</td>
                  <td>Thưởng nhẹ</td>
                </tr>
                <tr>
                  <td>&gt; 100.000.000đ</td>
                  <td>5%</td>
                  <td>Thưởng cao</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyDiem;

import React, { useState, useEffect } from "react";
import LoyaltyRuleCard from "~/components/LoyaltyRuleCard";
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
    try {
      if (editingRule) {
        const updated = await BonusRuleAPI.update(editingRule.id, ruleData);
        setBonusRules((prev) => prev.map((r) => (r.id === editingRule.id ? updated : r)));
      } else {
        const created = await BonusRuleAPI.create(ruleData);
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
    setEditingRule(rule);
    setShowModal(true);
  };

  return (
    <div>
      <div className={cx("header")}>
        <h2>Chính sách thưởng doanh số</h2>
        <div className={cx("actions")}>
          <button className={cx("btn")} onClick={() => { setEditingRule(null); setShowModal(true); }}>Tạo mới</button>
          <button className={cx("btn")} onClick={fetchBonusRules}>Refresh</button>
        </div>
      </div>

      <div className={cx("rule-list")}>
        {bonusRules.length > 0 ? (
          bonusRules.map((rule) => (
            <LoyaltyRuleCard
              key={rule.id}
              rule={rule}
              onEdit={() => handleEditRule(rule)}
              onDelete={() => handleDeleteRule(rule.id)}
            />
          ))
        ) : (
          <p className={cx("emptyText")}>Chưa có quy tắc thưởng nào.</p>
        )}
      </div>

      {showModal && (
        <BonusModal
          initialData={editingRule}
          onClose={() => setShowModal(false)}
          onCreate={handleSaveRule}
        />
      )}
    </div>
  );
}

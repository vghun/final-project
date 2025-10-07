import React, { useState, useEffect } from "react";
import LoyaltyRuleCard from "~/components/LoyaltyRuleCard";
import CreateRuleModal from "~/components/CreateRuleModal";
import { LoyaltyRuleAPI } from "~/apis/loyaltyRuleAPI";
import classNames from "classnames/bind";
import styles from "./TabTichDiem.module.scss";

const cx = classNames.bind(styles);

export default function TabTichDiem() {
  const [rules, setRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const data = await LoyaltyRuleAPI.getAll();
      setRules(data);
    } catch (error) {
      console.error("Lỗi load loyalty rules:", error);
    }
  };

  const handleSaveRule = async (ruleData) => {
    try {
      if (editingRule) {
        const updated = await LoyaltyRuleAPI.update(editingRule.id, ruleData);
        setRules((prev) => prev.map((r) => (r.id === editingRule.id ? updated : r)));
      } else {
        const created = await LoyaltyRuleAPI.create(ruleData);
        setRules((prev) => [...prev, created]);
      }
      setShowModal(false);
      setEditingRule(null);
    } catch (error) {
      console.error("Lỗi lưu rule:", error);
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      await LoyaltyRuleAPI.delete(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
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
        <h2>Chính sách tích điểm</h2>
        <div className={cx("actions")}>
          <button className={cx("btn")} onClick={() => { setEditingRule(null); setShowModal(true); }}>Tạo mới</button>
          <button className={cx("btn")} onClick={fetchRules}>Refresh</button>
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
    </div>
  );
}

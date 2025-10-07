import React, { useState, useEffect } from "react";
import LoyaltyRuleCard from "~/components/LoyaltyRuleCard";
import CreateRuleModal from "~/components/CreateRuleModal";
import BonusModal from "~/components/BonusModal";
import classNames from "classnames/bind";
import styles from "./QuanLyDiem.module.scss";
import { LoyaltyRuleAPI } from "~/apis/loyaltyRuleAPI";
import { BonusRuleAPI } from "~/apis/bonusRuleAPI";

const cx = classNames.bind(styles);

function QuanLyDiem() {
  const [rules, setRules] = useState([]);
  const [bonusRules, setBonusRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("tichdiem");

  // ====== Load dữ liệu khi đổi tab hoặc mount ======
  useEffect(() => {
    if (activeSubTab === "tichdiem") fetchLoyaltyRules();
    else fetchBonusRules();
  }, [activeSubTab]);

  const fetchLoyaltyRules = async () => {
    try {
      const data = await LoyaltyRuleAPI.getAll();
      setRules(data);
    } catch (error) {
      console.error("Lỗi load loyalty rules:", error);
    }
  };

  const fetchBonusRules = async () => {
    try {
      const data = await BonusRuleAPI.getAll();
      setBonusRules(data);
    } catch (error) {
      console.error("Lỗi load bonus rules:", error);
    }
  };

  // ====== Tạo / Cập nhật rule ======
  const handleSaveRule = async (ruleData) => {
    try {
      if (activeSubTab === "tichdiem") {
        if (editingRule) {
          const updated = await LoyaltyRuleAPI.update(editingRule.id, ruleData);
          setRules((prev) =>
            prev.map((r) => (r.id === editingRule.id ? updated : r))
          );
        } else {
          const created = await LoyaltyRuleAPI.create(ruleData);
          setRules((prev) => [...prev, created]);
        }
      } else {
        if (editingRule) {
          const updated = await BonusRuleAPI.update(editingRule.id, ruleData);
          setBonusRules((prev) =>
            prev.map((r) => (r.id === editingRule.id ? updated : r))
          );
        } else {
          const created = await BonusRuleAPI.create(ruleData);
          setBonusRules((prev) => [...prev, created]);
        }
      }

      setShowModal(false);
      setEditingRule(null);
    } catch (error) {
      console.error("Lỗi lưu rule:", error);
    }
  };

  // ====== Xoá rule ======
  const handleDeleteRule = async (id) => {
    try {
      if (activeSubTab === "tichdiem") {
        await LoyaltyRuleAPI.delete(id);
        setRules((prev) => prev.filter((r) => r.id !== id));
      } else {
        await BonusRuleAPI.delete(id);
        setBonusRules((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Lỗi xoá rule:", error);
    }
  };

  // ====== Sửa rule ======
  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setShowModal(true);
  };

  return (
    <div className={cx("wrapper")}>
      {/* ===== Tab phụ ===== */}
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

      {/* ===== Tab Tích điểm ===== */}
      {activeSubTab === "tichdiem" && (
        <>
          <div className={cx("header")}>
            <h2>Chính sách tích điểm</h2>
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
              <button className={cx("btn")} onClick={fetchLoyaltyRules}>
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

      {/* ===== Tab Thưởng doanh số ===== */}
      {activeSubTab === "thuongdoanhso" && (
        <>
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
        </>
      )}
    </div>
  );
}

export default QuanLyDiem;

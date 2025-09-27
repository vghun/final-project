// components/LoyaltyRuleCard.jsx
import React from "react";
import classNames from "classnames/bind";
import styles from "./LoyaltyRuleCard.module.scss";

const cx = classNames.bind(styles);

function LoyaltyRuleCard({ rule, onEdit, onDelete }) {
  return (
    <div className={cx("card", { default: rule.is_default })}>
      <div className={cx("header")}>
        <h3>
          {rule.is_default ? (
            <span className={cx("defaultLabel")}>Mặc Định</span>
          ) : (
            "Rule Thường"
          )}
        </h3>
        <div className={cx("actions")}>
          <button className={cx("btn-edit")} onClick={onEdit}>
            Sửa
          </button>
          <button className={cx("btn-delete")} onClick={onDelete}>
            Xoá
          </button>
        </div>
      </div>
      <div className={cx("body")}>
        <p><strong>Giá trị 1 điểm:</strong> {rule.money_per_point} VND</p>
        <p><strong>Hệ số nhân điểm:</strong> x{rule.point_multiplier}</p>
        <p><strong>Đơn tối thiểu:</strong> {rule.min_order_amount} VND</p>
        {!rule.is_default && (
          <p>
            <strong>Thời gian áp dụng:</strong>{" "}
            {rule.start_date?.slice(0, 10)} → {rule.end_date?.slice(0, 10)}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoyaltyRuleCard;

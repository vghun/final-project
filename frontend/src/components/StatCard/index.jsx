import React from "react";
import classNames from "classnames/bind";
import styles from "./StatCard.module.scss";

const cx = classNames.bind(styles);

function StatCard({ title, value, desc }) {
  return (
    <div className={cx("statCard")}>
      <p className={cx("statTitle")}>{title}</p>
      <h2 className={cx("statValue")}>{value}</h2>
      <span className={cx("statDesc")}>{desc}</span>
    </div>
  );
}

export default StatCard;

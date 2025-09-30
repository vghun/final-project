import React, { useState } from "react";
import styles from "./Thuong.module.scss";

function Thuong() {
  const [rewards] = useState({
    currentMonthRevenue: 12500000,
    targetRevenue: 20000000,
    completedAppointments: 45,
    nextMilestone: 60,
    milestoneReward: 500000,
  });

  const percentRevenue = Math.min(
    (rewards.currentMonthRevenue / rewards.targetRevenue) * 100,
    100
  );

  const percentAppointments = Math.min(
    (rewards.completedAppointments / rewards.nextMilestone) * 100,
    100
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thưởng & Mốc doanh thu</h2>
      <p className={styles.subtitle}>
        Theo dõi tiến độ và nhận thưởng khi đạt mốc
      </p>

      {/* Doanh thu tháng */}
      <div className={styles.section}>
        <div className={styles.headerRow}>
          <h3 className={styles.sectionTitle}>Doanh thu tháng này</h3>
          <span className={styles.badge}>
            {Math.round(percentRevenue)}%
          </span>
        </div>
        <div className={styles.progressBox}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${percentRevenue}%` }}
            />
          </div>
          <div className={styles.row}>
            <span>Hiện tại</span>
            <b>{rewards.currentMonthRevenue.toLocaleString("vi-VN")}đ</b>
          </div>
          <div className={styles.row}>
            <span>Mục tiêu</span>
            <b>{rewards.targetRevenue.toLocaleString("vi-VN")}đ</b>
          </div>
        </div>
      </div>

      {/* Lịch hẹn */}
      <div className={styles.section}>
        <div className={styles.headerRow}>
          <h3 className={styles.sectionTitle}>Mốc lịch hẹn hoàn thành</h3>
        </div>
        <div className={styles.progressBox}>
          <div className={styles.progressBarYellow}>
            <div
              className={styles.progressFillYellow}
              style={{ width: `${percentAppointments}%` }}
            />
          </div>
          <div className={styles.row}>
            <span>Đã hoàn thành</span>
            <b>{rewards.completedAppointments} lịch</b>
          </div>
          <div className={styles.row}>
            <span>Mốc tiếp theo</span>
            <b>{rewards.nextMilestone} lịch</b>
          </div>
        </div>
        <div className={styles.rewardBox}>
          <p className={styles.rewardLabel}>Phần thưởng khi đạt mốc</p>
          <p className={styles.rewardValue}>
            {rewards.milestoneReward.toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>
    </div>
  );
}

export default Thuong;

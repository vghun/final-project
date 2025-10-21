import React, { useEffect, useState } from "react";
import styles from "./Thuong.module.scss";
import { BarberAPI } from "~/apis/barberAPI";

const Thuong = ({ idBarber = 7 }) => {
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReward = async () => {
      try {
        const data = await BarberAPI.getReward(idBarber);
        setReward(data);
      } catch (err) {
        console.error("Lỗi tải thưởng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReward();
  }, [idBarber]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!reward) return <p>Không có dữ liệu thưởng.</p>;

  const percentRevenue = reward.nextRule
    ? Math.min((reward.serviceRevenue / reward.nextRule.minRevenue) * 100, 100)
    : 100;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎁 Thưởng & Mốc doanh thu</h2>
      <p className={styles.subtitle}>
        Tháng {reward.month}/{reward.year}
      </p>

      <div className={styles.section}>
        <div className={styles.headerRow}>
          <h3>Doanh thu tháng này</h3>
          <span className={styles.badge}>{Math.round(percentRevenue)}%</span>
        </div>

        <div className={styles.progressBox}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${percentRevenue}%` }}
            ></div>
          </div>

          <div className={styles.row}>
            <span>Hiện tại:</span>
            <b>{reward.serviceRevenue.toLocaleString("vi-VN")}đ</b>
          </div>

          {reward.nextRule && (
            <div className={styles.row}>
              <span>Mốc tiếp theo:</span>
              <b>{reward.nextRule.minRevenue.toLocaleString("vi-VN")}đ</b>
            </div>
          )}
        </div>

        <div className={styles.rewardBox}>
          <p className={styles.rewardLabel}>Phần thưởng hiện tại</p>
          <p className={styles.rewardValue}>
            {reward.bonus.toLocaleString("vi-VN")}đ (
            {reward.currentRule.bonusPercent}%)
          </p>
          {reward.nextRule && (
            <p className={styles.nextMilestone}>
              Khi đạt{" "}
              {reward.nextRule.minRevenue.toLocaleString("vi-VN")}đ → thưởng{" "}
              +{reward.nextRule.bonusPercent}%
            </p>
          )}
        </div>
      </div>

      <div className={styles.tableSection}>
        <h3>Bảng mốc thưởng</h3>
        <table className={styles.rewardTable}>
          <thead>
            <tr>
              <th>Mốc doanh thu</th>
              <th>Thưởng (%)</th>
            </tr>
          </thead>
          <tbody>
            {reward.rewardRules.map((rule, idx) => {
              const reached = reward.serviceRevenue >= rule.minRevenue;
              const isNext = reward.nextRule?.minRevenue === rule.minRevenue;
              return (
                <tr
                  key={idx}
                  className={
                    reached
                      ? styles.reached
                      : isNext
                      ? styles.next
                      : styles.notYet
                  }
                >
                  <td>{rule.minRevenue.toLocaleString("vi-VN")}đ</td>
                  <td>{rule.bonusPercent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Thuong;

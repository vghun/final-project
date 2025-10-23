import React, { useEffect, useState } from "react";
import styles from "./Thuong.module.scss";
import { BarberAPI } from "~/apis/barberAPI";
import { useAuth } from "~/context/AuthContext";

const formatCurrency = (num) => Math.round(num).toLocaleString("vi-VN") + "đ";
const formatPercent = (num) => Number(num).toFixed(0);

const Thuong = () => {
  const { user, loading: isAuthLoading } = useAuth();
  const idBarber = user?.idUser;

  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading || !idBarber) {
      if (!isAuthLoading) setLoading(false); // Nếu Auth xong mà không có ID
      return;
    }

    const fetchReward = async () => {
      setLoading(true); // Đảm bảo hiển thị loading
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
  }, [idBarber, isAuthLoading]);

  // 🟢 XỬ LÝ TRƯỜNG HỢP LOADING/KHÔNG CÓ DỮ LIỆU
  if (isAuthLoading || loading) return <p className={styles.loading}>Đang tải dữ liệu...</p>;
  if (!idBarber) return <p className={styles.empty}>Vui lòng đăng nhập bằng tài khoản Barber để xem thưởng.</p>;
  if (!reward) return <p className={styles.empty}>Không có dữ liệu thưởng.</p>;

  const percentRevenue = reward.nextRule
    ? Math.min((reward.serviceRevenue / reward.nextRule.minRevenue) * 100, 100)
    : 100;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thưởng & Mốc doanh thu</h2>
      <p className={styles.subtitle}>
        Tháng {reward.month}/{reward.year}
      </p>

      {/* Phần doanh thu */}
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
            <span>Doanh thu dịch vụ:</span>
            <b>{formatCurrency(reward.serviceRevenue)}</b>
          </div>


          {reward.nextRule && (
            <div className={styles.row}>
              <span>Mốc tiếp theo:</span>
              <b>{formatCurrency(reward.nextRule.minRevenue)}</b>
            </div>
          )}

          <div className={styles.row}>
            <span>Tiền tip:</span>
            <b>{formatCurrency(reward.tipAmount)}</b>
          </div>
        </div>

        {/* Phần thưởng */}
        <div className={styles.rewardBox}>
          <p className={styles.rewardLabel}>Phần thưởng hiện tại</p>
          <p className={styles.rewardValue}>
            {formatCurrency(reward.bonus)} ({formatPercent(reward.currentRule.bonusPercent)}%)
          </p>

          {reward.nextRule && (
            <p className={styles.nextMilestone}>
              Khi đạt {formatCurrency(reward.nextRule.minRevenue)} → thưởng +{formatPercent(reward.nextRule.bonusPercent)}%
            </p>
          )}
        </div>
      </div>

      {/* Bảng mốc thưởng */}
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
                  <td>{formatCurrency(rule.minRevenue)}</td>
                  <td>{formatPercent(rule.bonusPercent)}%</td>
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

import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { DollarSign, Users, CalendarDays, Star, TrendingUp, Scissors, Crown } from "lucide-react";
import styles from "./TongQuan.module.scss";
import { StatisticsAPI } from "~/apis/statisticsAPI"; // import API frontend service

const cx = classNames.bind(styles);

function TongQuan() {
  const [dashboard, setDashboard] = useState({
    monthlyRevenue: 0,
    servedCustomerCount: 0,
    totalBookings: 0,
    avgRating: 0,
    topCustomers: [],
  });

  // Hàm format số tiền
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await StatisticsAPI.getDashboardOverview({ month: 10, year: 2025 });
        setDashboard(data);
      } catch (error) {
        console.error("Lỗi khi load dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  // Dữ liệu hiển thị thống kê nhanh
  const stats = [
    {
      icon: <DollarSign size={26} />,
      title: "Doanh thu tháng",
      value: formatCurrency(dashboard.monthlyRevenue),
    
    },
    {
      icon: <Users size={26} />,
      title: "Tổng khách hàng",
      value: dashboard.servedCustomerCount,
      sub: "Khách hàng đã phục vụ",
    },
    {
      icon: <CalendarDays size={26} />,
      title: "Lịch hẹn tháng",
      value: dashboard.totalBookings,
      sub: "Tổng số lịch hẹn",
    },
    {
      icon: <Star size={26} />,
      title: "Đánh giá trung bình",
      value: dashboard.avgRating.toFixed(1) + " ⭐",
      sub: "Từ tất cả chi nhánh",
    },
  ];

  return (
    <div className={cx("tongQuan")}>
      {/* ====== THỐNG KÊ NHANH ====== */}
      <div className={cx("cardGrid")}>
        {stats.map((s, i) => (
          <div key={i} className={cx("card")}>
            <div className={cx("iconBox")}>{s.icon}</div>
            <div>
              <h3>{s.title}</h3>
              <p className={cx("value")}>{s.value}</p>
              <span>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ====== TOP KHÁCH HÀNG ====== */}
      <div className={cx("section")}>
        <div className={cx("sectionHeader")}>
          <Crown size={22} />
          <h2>Top khách hàng tiềm năng</h2>
        </div>
        <div className={cx("tableWrapper")}>
          <table className={cx("customerTable")}>
            <thead>
              <tr>
                <th>Tên khách hàng</th>
                <th>Số lần đến</th>
                <th>Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.topCustomers.map((c) => (
                <tr key={c.idCustomer}>
                  <td>{c.fullName}</td>
                  <td>{c.visitCount}</td>
                  <td>{formatCurrency(c.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== Các phần Xu hướng & Tăng trưởng vẫn dùng dữ liệu tĩnh hoặc API khác nếu có ====== */}
      {/* ... giữ nguyên trends & growth nếu chưa có API */}
    </div>
  );
}

export default TongQuan;

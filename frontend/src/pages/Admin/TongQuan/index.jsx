import React from "react";
import classNames from "classnames/bind";
import {
  DollarSign,
  Users,
  CalendarDays,
  Star,
  TrendingUp,
  Scissors,
  Crown,
} from "lucide-react";
import styles from "./TongQuan.module.scss";

const cx = classNames.bind(styles);

function TongQuan() {
  const topCustomers = [
    { id: 1, name: "Nguyễn Văn A", totalSpent: "12.500.000đ", visits: 8 },
    { id: 2, name: "Trần Thị B", totalSpent: "10.200.000đ", visits: 6 },
    { id: 3, name: "Phạm Văn C", totalSpent: "9.800.000đ", visits: 7 },
  ];

  const trends = [
    { id: 1, name: "Fade Undercut", popularity: "🔥 Hot trend 2025", img: "/styles/fade.jpg" },
    { id: 2, name: "Side Part Classic", popularity: "⭐ Phổ biến", img: "/styles/sidepart.jpg" },
    { id: 3, name: "Pompadour", popularity: "💈 Được ưa chuộng", img: "/styles/pompadour.jpg" },
  ];

  const stats = [
    {
      icon: <DollarSign size={26} />,
      title: "Doanh thu tháng",
      value: "115.000.000đ",
      sub: "+12.5% so với tháng trước",
    },
    {
      icon: <Users size={26} />,
      title: "Tổng khách hàng",
      value: "1.247",
      sub: "Khách hàng đã phục vụ",
    },
    {
      icon: <CalendarDays size={26} />,
      title: "Lịch hẹn tháng",
      value: "2.156",
      sub: "Tổng số lịch hẹn",
    },
    {
      icon: <Star size={26} />,
      title: "Đánh giá trung bình",
      value: "4.8 ⭐",
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
              {topCustomers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.visits}</td>
                  <td>{c.totalSpent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== XU HƯỚNG CẮT TÓC ====== */}
      <div className={cx("section")}>
        <div className={cx("sectionHeader")}>
          <Scissors size={22} />
          <h2>Xu hướng cắt tóc hiện tại</h2>
        </div>
        <div className={cx("trendGrid")}>
          {trends.map((trend) => (
            <div key={trend.id} className={cx("trendCard")}>
              <div className={cx("trendImageBox")}>
                <img src={trend.img} alt={trend.name} />
                <div className={cx("overlay")}></div>
              </div>
              <div className={cx("trendInfo")}>
                <h4>{trend.name}</h4>
                <span>{trend.popularity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== TĂNG TRƯỞNG ====== */}
      <div className={cx("section", "growth")}>
        <div className={cx("growthCard")}>
          <TrendingUp size={28} className={cx("growthIcon")} />
          <div>
            <h3>Tăng trưởng doanh thu</h3>
            <p className={cx("growthValue")}>+18% trong 3 tháng gần nhất</p>
            <span>Xu hướng tích cực</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TongQuan;

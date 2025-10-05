import React from "react";
import classNames from "classnames/bind";
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

  return (
    <div className={cx("tongQuan")}>
      {/* ====== Thống kê nhanh ====== */}
      <div className={cx("cardGrid")}>
        <div className={cx("card")}>
          <h3>Doanh thu tháng</h3>
          <p className={cx("value")}>115.000.000đ</p>
          <span>+12.5% so với tháng trước</span>
        </div>
        <div className={cx("card")}>
          <h3>Tổng khách hàng</h3>
          <p className={cx("value")}>1247</p>
          <span>Khách hàng đã phục vụ</span>
        </div>
        <div className={cx("card")}>
          <h3>Lịch hẹn tháng</h3>
          <p className={cx("value")}>2156</p>
          <span>Tổng số lịch hẹn</span>
        </div>
        <div className={cx("card")}>
          <h3>Đánh giá trung bình</h3>
          <p className={cx("value")}>4.8 ⭐</p>
          <span>Từ tất cả chi nhánh</span>
        </div>
      </div>

      {/* ====== Top khách hàng tiềm năng ====== */}
      <div className={cx("section")}>
        <h2>Top khách hàng tiềm năng</h2>
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

      {/* ====== Xu hướng cắt tóc ====== */}
      <div className={cx("section")}>
        <h2>Xu hướng cắt tóc hiện tại</h2>
        <div className={cx("trendGrid")}>
          {trends.map((trend) => (
            <div key={trend.id} className={cx("trendCard")}>
              <img src={trend.img} alt={trend.name} />
              <div className={cx("trendInfo")}>
                <h4>{trend.name}</h4>
                <span>{trend.popularity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TongQuan;

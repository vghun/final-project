import React from "react";
import styles from "./BookingList.module.scss";

export default function BookingList({ onSelect }) {
  const bookings = [
    {
      id: 1,
      time: "09:30",
      customer: "Nguyễn Văn A",
      barber: "Anh Tuấn",
      service: "Cắt + Gội",
      branch: "Cơ sở 1",
      total: 180000,
      status: "pending",
    },
    {
      id: 2,
      time: "11:00",
      customer: "Trần Quốc Bảo",
      barber: "Anh Duy",
      service: "Cắt + Nhuộm",
      branch: "Cơ sở 2",
      total: 350000,
      status: "paid",
    },
  ];

  return (
    <div className={styles.list}>
      <h2>Lịch hẹn hôm nay</h2>
      <table>
        <thead>
          <tr>
            <th>Giờ</th>
            <th>Khách hàng</th>
            <th>Thợ cắt</th>
            <th>Dịch vụ</th>
            <th>Chi nhánh</th>
            <th>Tạm tính</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.time}</td>
              <td>{b.customer}</td>
              <td>{b.barber}</td>
              <td>{b.service}</td>
              <td>{b.branch}</td>
              <td>{b.total.toLocaleString()}đ</td>
              <td
                className={
                  b.status === "paid" ? styles.paid : styles.pending
                }
              >
                {b.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
              </td>
              <td>
                {b.status !== "paid" && (
                  <button onClick={() => onSelect(b)}>Thanh toán</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

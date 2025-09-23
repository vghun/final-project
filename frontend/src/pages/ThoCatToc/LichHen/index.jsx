import React from "react";
import classNames from "classnames/bind";
import styles from "./LichHen.module.scss";

const cx = classNames.bind(styles);

const appointments = [
  {
    time: "09:00",
    duration: "45 phút",
    name: "Nguyễn Văn A",
    service: "Classic Cut + Beard Styling",
    phone: "0901234567",
    status: "Đã xác nhận",
  },
  {
    time: "10:30",
    duration: "30 phút",
    name: "Trần Minh B",
    service: "Hair Washing + Styling",
    phone: "0907654321",
    status: "Đã xác nhận",
  },
  {
    time: "14:00",
    duration: "30 phút",
    name: "Lê Hoàng C",
    service: "Classic Cut",
    phone: "0912345678",
    status: "Chờ xác nhận",
  },
];

function LichHen() {
  return (
    <div className={cx("lichhen")}>
      <h3>Lịch hẹn hôm nay</h3>
      <p>Quản lý các cuộc hẹn của bạn trong ngày</p>
      {appointments.map((appt, i) => (
        <div key={i} className={cx("appointment")}>
          <div className={cx("timeBlock")}>
            <strong>{appt.time}</strong>
            <span>{appt.duration}</span>
          </div>
          <div className={cx("info")}>
            <strong>{appt.name}</strong>
            <p>{appt.service}</p>
            <span>{appt.phone}</span>
          </div>
          <div className={cx("actions")}>
            <span
              className={cx("status", {
                confirmed: appt.status === "Đã xác nhận",
                pending: appt.status === "Chờ xác nhận",
              })}
            >
              {appt.status}
            </span>
            <button className={cx("detailBtn")}>Chi tiết</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LichHen;

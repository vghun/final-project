import React, { useState } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import styles from "./GioLamViec.module.scss";

const cx = classNames.bind(styles);

const defaultSchedule = [
  { day: "Thứ 2", working: true, start: "09:00 SA", end: "06:00 CH" },
  { day: "Thứ 3", working: true, start: "09:00 SA", end: "06:00 CH" },
  { day: "Thứ 4", working: true, start: "09:00 SA", end: "06:00 CH" },
  { day: "Thứ 5", working: true, start: "09:00 SA", end: "06:00 CH" },
  { day: "Thứ 6", working: true, start: "09:00 SA", end: "06:00 CH" },
  { day: "Thứ 7", working: true, start: "08:00 SA", end: "05:00 CH" },
  { day: "Chủ nhật", working: false, start: "09:00 SA", end: "06:00 CH" },
];

function GioLamViec() {
  const [schedule, setSchedule] = useState(defaultSchedule);

  const toggleWork = (index) => {
    const updated = [...schedule];
    updated[index].working = !updated[index].working;
    setSchedule(updated);
  };

  return (
    <div className={cx("schedule")}>
      <h3>Giờ làm việc</h3>
      <p>Thiết lập lịch làm việc hàng tuần của bạn</p>

      <div className={cx("days")}>
        {schedule.map((item, index) => (
          <div key={index} className={cx("dayRow")}>
            <span className={cx("day")}>{item.day}</span>
            <label>
              <input
                type="checkbox"
                checked={item.working}
                onChange={() => toggleWork(index)}
              />
              <span>{item.working ? "Làm việc" : "Nghỉ"}</span>
            </label>

            <div className={cx("timeInputs")}>
              <input type="text" value={item.start} readOnly />
              <span>đến</span>
              <input type="text" value={item.end} readOnly />
            </div>

            <button className={cx("editBtn")}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
        ))}
      </div>

      <button className={cx("saveBtn")}>Lưu thay đổi</button>
    </div>
  );
}

export default GioLamViec;

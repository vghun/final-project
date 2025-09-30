import React, { useState } from "react";
import styles from "./LichHen.module.scss";
import AppointmentCard from "~/components/AppointmentCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

function LichHen() {
  const [calendarView, setCalendarView] = useState("day"); // day | week
  const [currentDate, setCurrentDate] = useState(new Date("2025-09-29")); // mặc định Thứ 2

  const [appointments] = useState([
    // Tuần 1
    { id: 1, customerName: "Nguyễn Văn A", service: "Classic Cut", time: "09:00", date: "2025-09-29", duration: 45, phone: "0901111111" },
    { id: 2, customerName: "Trần Minh B", service: "Hair Washing", time: "10:30", date: "2025-09-29", duration: 30, phone: "0902222222" },
    { id: 3, customerName: "Lê Văn C", service: "Fade Cut", time: "14:00", date: "2025-09-30", duration: 40, phone: "0903333333" },
    { id: 4, customerName: "Phạm Thị D", service: "Coloring", time: "16:00", date: "2025-09-30", duration: 60, phone: "0904444444" },
    { id: 5, customerName: "Hoàng Văn E", service: "Beard Styling", time: "18:00", date: "2025-09-30", duration: 30, phone: "0905555555" },
    { id: 6, customerName: "Đỗ Thị F", service: "Classic Cut", time: "08:30", date: "2025-10-01", duration: 45, phone: "0906666666" },
    { id: 7, customerName: "Ngô Văn G", service: "Shampoo", time: "11:00", date: "2025-10-01", duration: 25, phone: "0907777777" },
    { id: 8, customerName: "Bùi Thị H", service: "Layer Cut", time: "15:30", date: "2025-10-01", duration: 50, phone: "0908888888" },
    { id: 9, customerName: "Nguyễn Văn I", service: "Perm", time: "10:00", date: "2025-10-02", duration: 90, phone: "0909999999" },
    { id: 10, customerName: "Trần Văn K", service: "Fade + Beard", time: "13:00", date: "2025-10-02", duration: 60, phone: "0911111111" },
    { id: 11, customerName: "Phan Văn L", service: "Shaving", time: "17:00", date: "2025-10-02", duration: 20, phone: "0912222222" },
    { id: 12, customerName: "Đinh Văn M", service: "Classic Cut", time: "09:30", date: "2025-10-03", duration: 45, phone: "0913333333" },
    { id: 13, customerName: "Vũ Thị N", service: "Hair Washing", time: "11:30", date: "2025-10-03", duration: 30, phone: "0914444444" },
    { id: 14, customerName: "Phùng Văn O", service: "Highlight", time: "14:30", date: "2025-10-03", duration: 120, phone: "0915555555" },
    { id: 15, customerName: "Nguyễn Thị P", service: "Fade Cut", time: "08:00", date: "2025-10-04", duration: 40, phone: "0916666666" },
    { id: 16, customerName: "Trương Văn Q", service: "Shampoo", time: "10:00", date: "2025-10-04", duration: 20, phone: "0917777777" },
    { id: 17, customerName: "Lý Văn R", service: "Beard Trim", time: "15:00", date: "2025-10-04", duration: 25, phone: "0918888888" },
    { id: 18, customerName: "Nguyễn Văn S", service: "Classic Cut", time: "09:00", date: "2025-10-05", duration: 45, phone: "0919999999" },
    { id: 19, customerName: "Phạm Thị T", service: "Hair Spa", time: "13:30", date: "2025-10-05", duration: 60, phone: "0921111111" },
    { id: 20, customerName: "Hoàng Văn U", service: "Fade Cut", time: "17:30", date: "2025-10-05", duration: 40, phone: "0922222222" },

    // Tuần 2 (20 cái thêm)
    { id: 21, customerName: "Trần Văn V", service: "Classic Cut", time: "08:30", date: "2025-10-06", duration: 45, phone: "0923333333" },
    { id: 22, customerName: "Nguyễn Văn W", service: "Fade Cut", time: "09:15", date: "2025-10-06", duration: 50, phone: "0924444444" },
    { id: 23, customerName: "Lê Thị X", service: "Hair Dye", time: "13:00", date: "2025-10-06", duration: 120, phone: "0925555555" },
    { id: 24, customerName: "Hoàng Văn Y", service: "Perm", time: "16:00", date: "2025-10-06", duration: 90, phone: "0926666666" },
    { id: 25, customerName: "Phạm Văn Z", service: "Beard Trim", time: "18:00", date: "2025-10-06", duration: 30, phone: "0927777777" },
    { id: 26, customerName: "Đỗ Văn A1", service: "Classic Cut", time: "09:00", date: "2025-10-06", duration: 40, phone: "0928888888" },
    { id: 27, customerName: "Nguyễn Văn B1", service: "Hair Spa", time: "11:00", date: "2025-10-06", duration: 60, phone: "0929999999" },
    { id: 28, customerName: "Trần Văn C1", service: "Shampoo", time: "15:00", date: "2025-10-06", duration: 25, phone: "0931111111" },
    { id: 29, customerName: "Lê Thị D1", service: "Layer Cut", time: "17:00", date: "2025-10-06", duration: 55, phone: "0932222222" },
    { id: 30, customerName: "Phạm Văn E1", service: "Fade Cut", time: "19:00", date: "2025-10-06", duration: 40, phone: "0933333333" },
    { id: 31, customerName: "Hoàng Văn F1", service: "Classic Cut", time: "08:00", date: "2025-10-06", duration: 45, phone: "0934444444" },
    { id: 32, customerName: "Nguyễn Thị G1", service: "Perm", time: "10:30", date: "2025-10-08", duration: 100, phone: "0935555555" },
    { id: 33, customerName: "Trần Văn H1", service: "Beard Styling", time: "13:30", date: "2025-10-08", duration: 40, phone: "0936666666" },
    { id: 34, customerName: "Lý Thị I1", service: "Hair Spa", time: "15:30", date: "2025-10-08", duration: 60, phone: "0937777777" },
    { id: 35, customerName: "Đinh Văn J1", service: "Fade + Beard", time: "18:00", date: "2025-10-08", duration: 60, phone: "0938888888" },
    { id: 36, customerName: "Nguyễn Văn K1", service: "Shampoo", time: "09:00", date: "2025-10-09", duration: 20, phone: "0939999999" },
    { id: 37, customerName: "Phạm Văn L1", service: "Classic Cut", time: "11:00", date: "2025-10-09", duration: 45, phone: "0941111111" },
    { id: 38, customerName: "Hoàng Thị M1", service: "Highlight", time: "14:00", date: "2025-10-09", duration: 120, phone: "0942222222" },
    { id: 39, customerName: "Vũ Văn N1", service: "Beard Trim", time: "16:30", date: "2025-10-09", duration: 25, phone: "0943333333" },
    { id: 40, customerName: "Trần Văn O1", service: "Classic Cut", time: "19:00", date: "2025-10-09", duration: 40, phone: "0944444444" },
  ]);

  // Điều hướng ngày/tuần
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (calendarView === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (calendarView === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  // Text hiển thị theo view
  const getDateRangeText = () => {
    if (calendarView === "day") {
      return currentDate.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
    } else {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("vi-VN", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" })}`;
    }
  };

  // Lọc lịch hẹn cho tuần
  const getWeekAppointments = () => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });

    return days.map((day) => {
      const appts = appointments.filter(
        (appt) => new Date(appt.date).toDateString() === day.toDateString()
      );
      return { day, appts };
    });
  };

  const filteredAppointments =
    calendarView === "day"
      ? appointments.filter(
          (appt) => new Date(appt.date).toDateString() === currentDate.toDateString()
        )
      : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Lịch hẹn khách hàng</h2>
        <select
          value={calendarView}
          onChange={(e) => setCalendarView(e.target.value)}
          className={styles.select}
        >
          <option value="day">Theo ngày</option>
          <option value="week">Theo tuần</option>
        </select>
      </div>

      <div className={styles.nav}>
        <button onClick={() => navigateDate("prev")} className={styles.navBtn}>
          <ChevronLeft size={16} />
        </button>
        <span className={styles.rangeText}>{getDateRangeText()}</span>
        <button onClick={() => navigateDate("next")} className={styles.navBtn}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day View */}
      {calendarView === "day" && (
        <div className={styles.list}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} view="day" />
            ))
          ) : (
            <p className={styles.empty}>Không có lịch hẹn trong ngày này</p>
          )}
        </div>
      )}

      {/* Week View */}
      {calendarView === "week" && (
        <div className={styles.weekGrid}>
          {getWeekAppointments().map(({ day, appts }) => (
            <div key={day.toDateString()} className={styles.weekCol}>
              <div className={styles.weekHeader}>
                {day.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric" })}
              </div>
              <div className={styles.weekAppts}>
                {appts.length > 0 ? (
                  appts.map((appt) => (
                    <AppointmentCard key={appt.id} appt={appt} view="week" />
                  ))
                ) : (
                  <p className={styles.noAppt}>—</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LichHen;

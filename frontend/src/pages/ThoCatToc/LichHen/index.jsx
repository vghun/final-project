import React, { useState, useEffect } from "react";
import styles from "./LichHen.module.scss";
import AppointmentCard from "~/components/AppointmentCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchBookingsForBarber } from "~/services/bookingService";

function LichHen() {
  const BARBER_ID = 7; // 👈 ID thợ (có thể đổi sau này)

  const [calendarView, setCalendarView] = useState("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      const data = await fetchBookingsForBarber(BARBER_ID, startStr, endStr);
      setAppointments(data);
    };

    loadBookings();
  }, [currentDate]);

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
        (appt) => new Date(appt.bookingDate).toDateString() === day.toDateString()
      );
      return { day, appts };
    });
  };

  const filteredAppointments =
    calendarView === "day"
      ? appointments.filter(
          (appt) => new Date(appt.bookingDate).toDateString() === currentDate.toDateString()
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
              <AppointmentCard key={appt.idBooking} appt={appt} view="day" />
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
                    <AppointmentCard key={appt.idBooking} appt={appt} view="week" />
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

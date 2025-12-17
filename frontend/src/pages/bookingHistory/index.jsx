import React, { useEffect, useState } from "react";
import styles from "./bookingHistory.module.scss";
import BookingItem from "~/components/BookingItem";
import { BookingHistoryAPI } from "~/apis/bookingHistoryAPI";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsedDates, setCollapsedDates] = useState({});

  const toggleCollapse = (date) => {
    setCollapsedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const groupByDate = (bookings) => {
    return bookings.reduce((acc, booking) => {
      const date = booking.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(booking);
      return acc;
    }, {});
  };

  const bookingsByDate = groupByDate(bookings);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await BookingHistoryAPI.getBookingHistory();
        setBookings(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy lịch sử booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div
      className={styles.page}
      style={{
        backgroundImage: `url(/banner.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className={styles.overlay}></div>

      <div className={styles.list}>
        {loading ? (
          <p className={styles.message}>Đang tải...</p>
        ) : bookings.length === 0 ? (
          <p className={styles.message}>Chưa có lịch sử booking</p>
        ) : (
          Object.entries(bookingsByDate).map(([date, dayBookings]) => {
            const isCollapsed = collapsedDates[date];
            return (
              <div key={date} className={styles.dayGroup}>
                <div
                  className={styles.dayTitle}
                  onClick={() => toggleCollapse(date)}
                >
                  <span>{date}</span>
                  <span>{isCollapsed ? "▼" : "▲"}</span>
                </div>
                <div
                  className={styles.dayContent}
                  style={{ display: isCollapsed ? "none" : "flex" }}
                >
                  {dayBookings.map((booking) => (
                    <BookingItem
                      key={booking.idBooking}
                      booking={booking}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

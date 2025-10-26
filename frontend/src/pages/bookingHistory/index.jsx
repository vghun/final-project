import React, { useEffect, useState } from "react";
import styles from "./bookingHistory.module.scss";
import BookingItem from "~/components/BookingItem";
import { BookingHistoryAPI } from "~/apis/bookingHistoryAPI";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await BookingHistoryAPI.getBookingHistory();
        setBookings(res.data || []); // giả sử API trả về { success, data }
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
      {/* Overlay mờ */}
      <div className={styles.overlay}></div>

      <div className={styles.list}>
        {loading ? (
          <p style={{ color: "#fff", textAlign: "center" }}>Đang tải...</p>
        ) : bookings.length === 0 ? (
          <p style={{ color: "#fff", textAlign: "center" }}>Chưa có lịch sử booking</p>
        ) : (
      bookings.map((booking) => (
            <BookingItem
                key={booking.idBooking}
                booking={{
                date: booking.date,           // API trả trực tiếp
                time: booking.time,           // API trả trực tiếp
                service: booking.service || "", // nếu rỗng thì hiển thị ""
                barber: {
                    name: booking.barber.name,
                    avatar: booking.barber.avatar
                },
                branch: {
                    name: booking.branch.name,
                    address: booking.branch.address
                }
                }}
            />
            ))

        )}
      </div>
    </div>
  );
}

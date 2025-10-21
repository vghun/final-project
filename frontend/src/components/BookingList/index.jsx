import React, { useEffect, useState } from "react";
import styles from "./BookingList.module.scss";

export default function BookingList({ onSelect, onReload, date }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:8088/api/bookings/details");
      const data = await res.json();

      if (data?.data) {
        const mapped = data.data
          .filter((booking) => booking.bookingDate.startsWith(date))
          .map((booking) => {
            const serviceTotal =
              booking.services?.reduce((sum, s) => sum + (parseFloat(s.price) || 0) * (s.quantity || 1), 0) || 0;
            const tipAmount = parseFloat(booking.tip || 0);
            const subTotal = serviceTotal + tipAmount;

            return {
              id: booking.idBooking,
              time: booking.bookingTime,
              customer: booking.customer?.name || "Khách lẻ",
              barber: booking.barber?.name || "Chưa chỉ định",
              services: booking.services?.map((s) => s.name) || [],
              branch: booking.branch?.name || "",
              total: parseFloat(booking.total),
              tip: tipAmount,
              subTotal,
              isPaid: booking.isPaid,
              status: booking.status,
              raw: booking,
            };
          })
          // ✅ Sắp xếp theo thời gian (giờ giảm dần)
          .sort((a, b) => {
            const timeA = a.time ? a.time.localeCompare(b.time) : 0;
            return -timeA; // đảo ngược để được từ cao đến thấp
          });

        setBookings(mapped);
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải booking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [date]);

  // ✅ Hủy đặt lịch
  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này không?")) return;
    try {
      const res = await fetch(`http://localhost:8088/api/bookings/${id}/cancel`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        alert("Đã hủy lịch hẹn thành công!");
        fetchBookings();
      } else {
        alert(data.message || "Hủy lịch thất bại!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi hủy booking:", err);
      alert("Có lỗi xảy ra khi hủy lịch!");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className={styles.list}>
      <h2>Lịch hẹn {date}</h2>
      <table>
        <thead>
          <tr>
            <th>Giờ</th>
            <th>Khách hàng</th>
            <th>Thợ cắt</th>
            <th>Dịch vụ</th>
            <th>Chi nhánh</th>
            <th>Tạm tính</th>
            <th>Tiến trình</th>
            <th>Thanh toán</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                Không có lịch hẹn nào trong ngày này
              </td>
            </tr>
          ) : (
            bookings.map((booking) => {
              const displayedServices =
                booking.services.length > 2
                  ? `${booking.services.slice(0, 2).join(", ")} (+${booking.services.length - 2})`
                  : booking.services.join(", ");

              return (
                <tr key={booking.id}>
                  <td>{booking.time}</td>
                  <td>{booking.customer}</td>
                  <td>{booking.barber}</td>
                  <td title={booking.services.join(", ")}>{displayedServices || "—"}</td>
                  <td>{booking.branch}</td>
                  <td>{booking.subTotal.toLocaleString("vi-VN")}đ</td>
                  <td
                    className={
                      booking.status === "Completed"
                        ? styles.completed
                        : booking.status === "Cancelled"
                        ? styles.cancelled
                        : styles.pending
                    }
                  >
                    {booking.status === "Completed"
                      ? "Đã cắt xong"
                      : booking.status === "Cancelled"
                      ? "Đã hủy"
                      : "Đang chờ"}
                  </td>
                  <td className={booking.isPaid ? styles.paid : styles.unpaid}>
                    {booking.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </td>
                  <td style={{ display: "flex", gap: "6px" }}>
                    {!booking.isPaid && booking.status !== "Cancelled" && (
                      <button onClick={() => onSelect(booking.raw, fetchBookings)}>Thanh toán</button>
                    )}
                    {booking.status === "Pending" && (
                      <button className={styles.cancelBtn} onClick={() => handleCancel(booking.id)}>
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

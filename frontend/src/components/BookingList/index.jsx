import React, { useEffect, useState } from "react";
import styles from "./BookingList.module.scss";

export default function BookingList({ onSelect, date }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Tải danh sách booking
  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:8088/api/bookings/details");
      const data = await res.json();

      if (data?.data) {
        const mapped = data.data
          .filter((b) => b.bookingDate.startsWith(date))
          .map((b) => ({
            id: b.idBooking,
            time: b.bookingTime,
            customer: b.customer?.name || "Khách lẻ",
            barber: b.barber?.name || "Chưa chỉ định",
            services: b.services?.map((s) => s.name) || [],
            branch: b.branch?.name || "",
            total: parseFloat(b.total),
            isPaid: b.isPaid,
            status: b.status,
            raw: b,
          }));

        setBookings(mapped);
      }
    } catch (err) {
      console.error("Lỗi khi tải booking:", err);
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
        fetchBookings(); // reload lại danh sách
      } else {
        alert(data.message || "Hủy lịch thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi hủy booking:", err);
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
            bookings.map((b) => {
              // ✅ Xử lý hiển thị dịch vụ gọn gàng
              const displayedServices =
                b.services.length > 2
                  ? `${b.services.slice(0, 2).join(", ")} (+${b.services.length - 2})`
                  : b.services.join(", ");

              return (
                <tr key={b.id}>
                  <td>{b.time}</td>
                  <td>{b.customer}</td>
                  <td>{b.barber}</td>

                  {/* ✅ Dịch vụ ngắn gọn, hover xem chi tiết */}
                  <td title={b.services.join(", ")}>{displayedServices || "—"}</td>

                  <td>{b.branch}</td>
                  <td>{b.total.toLocaleString()}đ</td>

                  {/* ✅ Tiến trình */}
                  <td
                    className={
                      b.status === "Completed"
                        ? styles.completed
                        : b.status === "Cancelled"
                        ? styles.cancelled
                        : styles.pending
                    }
                  >
                    {b.status === "Completed" ? "Đã cắt xong" : b.status === "Cancelled" ? "Đã hủy" : "Đang chờ"}
                  </td>

                  {/* ✅ Thanh toán */}
                  <td className={b.isPaid ? styles.paid : styles.unpaid}>
                    {b.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </td>

                  {/* ✅ Thao tác */}
                  <td style={{ display: "flex", gap: "6px" }}>
                    {!b.isPaid && b.status !== "Cancelled" && (
                      <button onClick={() => onSelect(b.raw)}>Thanh toán</button>
                    )}

                    {b.status === "Pending" && (
                      <button className={styles.cancelBtn} onClick={() => handleCancel(b.id)}>
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

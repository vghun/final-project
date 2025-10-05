import { useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import styles from "./Booking.module.scss";
import VoucherPopup from "../../components/VoucherPopup";

function BookingPage() {
  const [booking, setBooking] = useState({
    branch: "",
    barber: "",
    date: "",
    time: "",
    services: [],
    discount: 0,
    voucher: null,
  });

  const [showVoucherList, setShowVoucherList] = useState(false);

  // Danh sách giờ đã đặt theo ngày
  const [bookedTimesByDate, setBookedTimesByDate] = useState({});

  // Fake list giờ mở cửa (bạn có thể đổi theo DB)
  const times = [
    "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00"
  ];

  // Lấy danh sách giờ đã đặt cho ngày hiện tại
  const bookedTimes = booking.date
    ? bookedTimesByDate[booking.date] || []
    : [];

  // Khi chọn ngày
  const handleDateChange = (e) => {
    const date = e.target.value;
    setBooking((prev) => ({ ...prev, date }));

    // TODO: thay bằng API gọi từ backend
    const mockBooked = {
      "2025-10-05": ["09:00", "10:00", "15:00"],
      "2025-10-06": ["13:00", "14:00"],
    };

    setBookedTimesByDate(mockBooked);
  };

  // Khi chọn giờ
  const handleTimeSelect = (time) => {
    setBooking((prev) => ({ ...prev, time }));
  };

  // Khi chọn chi nhánh
  const handleBranchChange = (e) => {
    setBooking((prev) => ({ ...prev, branch: e.target.value }));
  };

  // Khi chọn barber
  const handleBarberChange = (e) => {
    setBooking((prev) => ({ ...prev, barber: e.target.value }));
  };

  // Khi chọn dịch vụ
  const handleServiceToggle = (service) => {
    setBooking((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  // Khi áp dụng voucher
  const handleVoucherSelect = (voucher) => {
    setBooking((prev) => ({
      ...prev,
      voucher,
      discount: voucher.discount,
    }));
    setShowVoucherList(false);
  };

  return (
    <DefaultLayout>
      <div className={styles.bookingContainer}>
        <h1>Đặt lịch hẹn</h1>

        {/* Chọn chi nhánh */}
        <div className={styles.formGroup}>
          <label>Chi nhánh:</label>
          <select value={booking.branch} onChange={handleBranchChange}>
            <option value="">-- Chọn chi nhánh --</option>
            <option value="branch1">Chi nhánh 1</option>
            <option value="branch2">Chi nhánh 2</option>
          </select>
        </div>

        {/* Chọn barber */}
        <div className={styles.formGroup}>
          <label>Thợ cắt:</label>
          <select value={booking.barber} onChange={handleBarberChange}>
            <option value="">-- Chọn barber --</option>
            <option value="barber1">Barber 1</option>
            <option value="barber2">Barber 2</option>
          </select>
        </div>

        {/* Chọn ngày */}
        <div className={styles.formGroup}>
          <label>Ngày:</label>
          <input
            type="date"
            value={booking.date}
            onChange={handleDateChange}
          />
        </div>

        {/* Chọn giờ */}
        <div className={styles.formGroup}>
          <label>Giờ:</label>
          <div className={styles.timeSlots}>
            {times.map((time, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.timeSlot}
                  ${booking.time === time ? styles.selected : ""}
                  ${bookedTimes.includes(time) ? styles.disabled : ""}`}
                onClick={() =>
                  !bookedTimes.includes(time) && handleTimeSelect(time)
                }
                disabled={bookedTimes.includes(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Chọn dịch vụ */}
        <div className={styles.formGroup}>
          <label>Dịch vụ:</label>
          <div className={styles.services}>
            {["Cắt tóc", "Gội đầu", "Nhuộm tóc"].map((service) => (
              <label key={service}>
                <input
                  type="checkbox"
                  checked={booking.services.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        {/* Chọn voucher */}
        <div className={styles.formGroup}>
          <label>Voucher:</label>
          <button
            type="button"
            onClick={() => setShowVoucherList(true)}
            className={styles.voucherBtn}
          >
            {booking.voucher ? booking.voucher.code : "Chọn voucher"}
          </button>
        </div>

        {/* Hiển thị danh sách voucher */}
        {showVoucherList && (
          <VoucherPopup onSelect={handleVoucherSelect} />
        )}

        <button type="button" className={styles.submitBtn}>
          Xác nhận đặt lịch
        </button>
      </div>
    </DefaultLayout>
  );
}

export default BookingPage;

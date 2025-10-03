import { useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import styles from "./Booking.module.scss";
import VoucherPopup from "../../components/VoucherPopup";

function BookingPage() {
  const [booking, setBooking] = useState({
    branch: "",
    barber: "",
    time: "",
    services: [],
    discount: 0,
    voucher: null,
  });

  const [showVoucherList, setShowVoucherList] = useState(false);

  // ================= DATA =================
  const branches = ["Cơ sở 1 - Hà Nội", "Cơ sở 2 - Đà Nẵng", "Cơ sở 3 - TP.HCM"];
  const barbersByBranch = {
    "Cơ sở 1 - Hà Nội": ["Anh Nam", "Anh Hùng", "Anh Dũng"],
    "Cơ sở 2 - Đà Nẵng": ["Anh Tuấn", "Anh Khánh"],
    "Cơ sở 3 - TP.HCM": ["Anh Phúc", "Anh Lâm", "Anh Hoàng"],
  };

  const times = ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const bookedTimes = ["10:00", "15:00"];

  const services = [
    { name: "Cắt tóc", price: 100000 },
    { name: "Cạo râu", price: 50000 },
    { name: "Nhuộm tóc", price: 200000 },
    { name: "Gội đầu", price: 70000 },
    { name: "Massage", price: 150000 },
  ];

  const vouchers = [
    { code: "SALE10", description: "Giảm 10% dịch vụ", discount: 10, exchanged: true, expireDate: "31/12/2025" },
    {
      code: "SALE20",
      description: "Giảm 20% cho đơn từ 300k",
      discount: 20,
      exchanged: false,
      pointCost: 100,
      expireDate: "15/11/2025",
    },
    { code: "FREESHIP", description: "Miễn phí gội đầu", discount: 5, exchanged: true, expireDate: "01/01/2026" },
  ];

  // ================= HANDLER =================
  const handleBranchChange = (e) => setBooking({ ...booking, branch: e.target.value, barber: "" });
  const handleBarberChange = (e) => setBooking({ ...booking, barber: e.target.value });
  const handleTimeSelect = (time) => {
    if (!bookedTimes.includes(time)) setBooking({ ...booking, time });
  };
  const handleServiceAdd = (e) => {
    const selected = e.target.value;
    const service = services.find((s) => s.name === selected);
    if (service && !booking.services.find((s) => s.name === selected)) {
      setBooking({ ...booking, services: [...booking.services, service] });
    }
  };
  const handleRemoveService = (serviceName) =>
    setBooking({ ...booking, services: booking.services.filter((s) => s.name !== serviceName) });
  const handleVoucherSelect = (voucher) => {
    setBooking({ ...booking, discount: voucher.discount, voucher });
    setShowVoucherList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalPrice = booking.services.reduce((sum, s) => sum + s.price, 0);
    const discountAmount = (totalPrice * booking.discount) / 100;
    const finalPrice = totalPrice - discountAmount;

    alert(
      `Đặt lịch thành công:\n` +
        `Cơ sở: ${booking.branch}\n` +
        `Barber: ${booking.barber}\n` +
        `Giờ: ${booking.time}\n` +
        `Dịch vụ: ${booking.services.map((s) => `${s.name} (${s.price.toLocaleString()}đ)`).join(", ")}\n` +
        `Voucher: ${booking.voucher ? booking.voucher.code : "Không"}\n` +
        `Thành tiền: ${finalPrice.toLocaleString()}đ`
    );
  };

  // ================= RENDER =================
  const totalPrice = booking.services.reduce((sum, s) => sum + s.price, 0);
  const discountAmount = (totalPrice * booking.discount) / 100;
  const finalPrice = totalPrice - discountAmount;

  return (
    <DefaultLayout>
      <div className={styles.bookingWrapper}>
        {/* Logo râu dưới header */}
        <div className={styles.logoBarber}>
          <img src="/rau.png" alt="Barber Logo" />
        </div>

        {/* Container booking */}
        <div className={styles.bookingContainer}>
          <h2>Đặt lịch Barber</h2>
          <form onSubmit={handleSubmit}>
            {/* Chọn cơ sở */}
            <div className={styles.formGroup}>
              <label>Cơ sở:</label>
              <select value={booking.branch} onChange={handleBranchChange}>
                <option value="">-- Chọn cơ sở --</option>
                {branches.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn barber */}
            <div className={styles.formGroup}>
              <label>Kỹ thuật viên:</label>
              <select value={booking.barber} onChange={handleBarberChange} disabled={!booking.branch}>
                <option value="">-- Chọn barber --</option>
                {booking.branch &&
                  barbersByBranch[booking.branch].map((barber, i) => (
                    <option key={i} value={barber}>
                      {barber}
                    </option>
                  ))}
              </select>
            </div>

            {/* Chọn thời gian */}
            <div className={styles.formGroup}>
              <label>Thời gian:</label>
              <div className={styles.timeGrid}>
                {times.map((time, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.timeSlot} ${bookedTimes.includes(time) ? styles.booked : ""} ${
                      booking.time === time ? styles.selected : ""
                    }`}
                    onClick={() => handleTimeSelect(time)}
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
              <select onChange={handleServiceAdd} value="">
                <option value="">-- Chọn dịch vụ --</option>
                {services.map((s, i) => (
                  <option key={i} value={s.name}>
                    {s.name} - {s.price.toLocaleString()}đ
                  </option>
                ))}
              </select>
              <ul className={styles.serviceList}>
                {booking.services.map((s, i) => (
                  <li key={i}>
                    {s.name} - {s.price.toLocaleString()}đ
                    <button type="button" onClick={() => handleRemoveService(s.name)}>
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tổng giá + giảm giá */}
            <div className={styles.summary}>
              <p>Tạm tính: {totalPrice.toLocaleString()}đ</p>
              <p>Giảm giá: -{discountAmount.toLocaleString()}đ</p>
              <p>
                <b>Thành tiền: {finalPrice.toLocaleString()}đ</b>
              </p>
              <button type="button" onClick={() => setShowVoucherList(true)}>
                Áp dụng mã giảm
              </button>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Xác nhận đặt lịch
            </button>
          </form>
        </div>

        {/* Kéo 2 bên container */}
        <img src="/keo.png" alt="Left Scissors" className={styles.scissorsLeft} />
        <img src="/keo.png" alt="Right Scissors" className={styles.scissorsRight} />

        {/* Popup voucher */}
        {showVoucherList && (
          <VoucherPopup vouchers={vouchers} onClose={() => setShowVoucherList(false)} onSelect={handleVoucherSelect} />
        )}
      </div>
    </DefaultLayout>
  );
}

export default BookingPage;

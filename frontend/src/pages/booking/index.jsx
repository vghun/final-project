import { useState, useEffect } from "react";
import axios from "axios";
import DefaultLayout from "../../layouts/DefaultLayout";
import styles from "./Booking.module.scss";

function BookingPage() {
  const [booking, setBooking] = useState({
    branch: "",
    barber: "",
    time: "",
    services: [],
    discount: 0,
    voucher: null,
  });

  const [branches, setBranches] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [times, setTimes] = useState([]);
  const [showVoucherList, setShowVoucherList] = useState(false);

  // Lấy danh sách chi nhánh
  useEffect(() => {
    axios
      .get("http://localhost:8088/api/booking/branches")
      .then((res) => setBranches(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Khi chọn chi nhánh thì load barber + service + thời gian
  const handleBranchChange = async (e) => {
    const branchId = e.target.value;
    setBooking({ ...booking, branch: branchId, barber: "" });

    if (!branchId) return;

    try {
      const res = await axios.get(`http://localhost:8088/api/booking/branches/${branchId}/details`);
      setBarbers(res.data.barbers || []);
      setServices(res.data.services || []);
      // Sinh timeslot từ openTime, closeTime, slotDuration
      const { openTime, closeTime, slotDuration } = res.data.branch;
      setTimes(generateTimeSlots(openTime, closeTime, slotDuration));
    } catch (error) {
      console.error("Lỗi khi load chi nhánh:", error);
    }
  };

  // Sinh timeslot
  const generateTimeSlots = (openTime, closeTime, slotDuration) => {
    const slots = [];
    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);
    let current = new Date();
    current.setHours(openH, openM, 0, 0);

    const end = new Date();
    end.setHours(closeH, closeM, 0, 0);

    while (current <= end) {
      slots.push(current.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
      current.setMinutes(current.getMinutes() + slotDuration);
    }
    return slots;
  };

  const handleBarberChange = (e) => {
    setBooking({ ...booking, barber: e.target.value });
  };

  const handleTimeSelect = (time) => {
    setBooking({ ...booking, time });
  };

  const handleServiceAdd = (e) => {
    const id = e.target.value;
    const service = services.find((s) => s.idService.toString() === id);
    if (service && !booking.services.find((s) => s.idService === service.idService)) {
      setBooking({ ...booking, services: [...booking.services, service] });
    }
  };

  const handleRemoveService = (idService) => {
    setBooking({
      ...booking,
      services: booking.services.filter((s) => s.idService !== idService),
    });
  };

  const handleVoucherSelect = (voucher) => {
    setBooking({
      ...booking,
      discount: voucher.discount,
      voucher,
    });
    setShowVoucherList(false);
  };

  const totalPrice = booking.services.reduce((sum, s) => sum + Number(s.price), 0);
  const discountAmount = (totalPrice * booking.discount) / 100;
  const finalPrice = totalPrice - discountAmount;

  // Nút thanh toán
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      idCustomer: 1, // TODO: lấy từ user login
      idBranch: booking.branch,
      idBarber: booking.barber,
      bookingDate: new Date().toISOString().split("T")[0],
      bookingTime: booking.time,
      services: booking.services.map((s) => ({
        idService: s.idService,
        quantity: 1,
        price: s.price,
      })),
      description: "Đặt lịch qua frontend",
    };

    try {
      await axios.post("http://localhost:8088/api/booking", payload);
      alert(`Thanh toán thành công! Tổng tiền: ${finalPrice.toLocaleString()}đ`);
      // Nếu muốn chuyển trang payment
      // navigate("/payment-success");
    } catch (error) {
      console.error(error);
      alert("Thanh toán thất bại, vui lòng thử lại!");
    }
  };

  return (
    <DefaultLayout>
      <div className={styles.bookingContainer}>
        <h2>Đặt lịch Barber</h2>
        <form onSubmit={handleSubmit}>
          {/* chọn cơ sở */}
          <div className={styles.formGroup}>
            <label>Cơ sở:</label>
            <select value={booking.branch} onChange={handleBranchChange}>
              <option value="">-- Chọn cơ sở --</option>
              {branches.map((b) => (
                <option key={b.idBranch} value={b.idBranch}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* chọn barber */}
          <div className={styles.formGroup}>
            <label>Kỹ thuật viên:</label>
            <select value={booking.barber} onChange={handleBarberChange} disabled={!booking.branch}>
              <option value="">-- Chọn barber --</option>
              {barbers.map((barber) => (
                <option key={barber.idBarber} value={barber.idBarber}>
                  {barber.name}
                </option>
              ))}
            </select>
          </div>

          {/* chọn thời gian */}
          <div className={styles.formGroup}>
            <label>Thời gian:</label>
            <div className={styles.timeGrid}>
              {times.map((time, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.timeSlot} ${booking.time === time ? styles.selected : ""}`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* chọn dịch vụ */}
          <div className={styles.formGroup}>
            <label>Dịch vụ:</label>
            <select onChange={handleServiceAdd} value="">
              <option value="">-- Chọn dịch vụ --</option>
              {services.map((s) => (
                <option key={s.idService} value={s.idService}>
                  {s.name} - {Number(s.price).toLocaleString()}đ
                </option>
              ))}
            </select>
            <ul className={styles.serviceList}>
              {booking.services.map((s) => (
                <li key={s.idService}>
                  {s.name} - {Number(s.price).toLocaleString()}đ
                  <button type="button" onClick={() => handleRemoveService(s.idService)}>
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* tổng giá + giảm giá */}
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

          {/* Nút thanh toán */}
          <button type="submit" className={styles.submitBtn}>
            Xác nhận & Thanh toán
          </button>
        </form>

        {/* Popup voucher */}
        {showVoucherList && (
          <div className={styles.voucherModal}>
            <div className={styles.voucherContent}>
              <h3>Chọn voucher</h3>
              <ul>
                <li onClick={() => handleVoucherSelect({ code: "SALE10", discount: 10 })}>SALE10 - Giảm 10%</li>
                <li onClick={() => handleVoucherSelect({ code: "SALE20", discount: 20 })}>SALE20 - Giảm 20%</li>
                <li onClick={() => handleVoucherSelect({ code: "FREESHIP", discount: 5 })}>FREESHIP - Giảm 5%</li>
              </ul>
              <button onClick={() => setShowVoucherList(false)}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default BookingPage;

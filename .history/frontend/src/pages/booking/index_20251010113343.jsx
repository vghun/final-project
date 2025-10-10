import { useState, useEffect } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import styles from "./Booking.module.scss";
import VoucherPopup from "../../components/VoucherPopup";

function BookingPage() {
  const [booking, setBooking] = useState({
    branch: "",
    branchId: null,
    barber: "",
    barberId: null,
    date: "",
    time: "",
    services: [],
    discount: 0,
    voucher: null,
  });

  const [showVoucherList, setShowVoucherList] = useState(false);
<<<<<<< HEAD
  const [branches, setBranches] = useState([]); // lấy từ API
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [times, setTimes] = useState([]);

  // Danh sách giờ đã đặt theo ngày (map: { "YYYY-MM-DD": ["09:00", "10:00"] })
  const [bookedTimesByDate, setBookedTimesByDate] = useState({});

  // voucher
=======
  const [branches, setBranches] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [times, setTimes] = useState([]);
  const [bookedTimesByDate, setBookedTimesByDate] = useState({});
  const [unavailableDates, setUnavailableDates] = useState([]); // ✅ thêm state ngày nghỉ

>>>>>>> origin/main
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

<<<<<<< HEAD
  // ================= CALL API =================
  useEffect(() => {
    // Gọi API lấy danh sách chi nhánh
=======
  const today = new Date();

  // ================= CALL API =================
  useEffect(() => {
>>>>>>> origin/main
    fetch("http://localhost:8088/api/booking/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data || []))
      .catch((err) => console.error("Error fetch branches:", err));
  }, []);

  const handleBranchChange = async (e) => {
    const branchId = Number(e.target.value) || null;
<<<<<<< HEAD
    // giữ nguyên giao diện: reset tên branch/barber/services/time khi đổi chi nhánh
=======
>>>>>>> origin/main
    setBooking({ ...booking, branchId, branch: "", barber: "", barberId: null, services: [], time: "", date: "" });

    if (!branchId) {
      setBarbers([]);
      setServices([]);
      setTimes([]);
      return;
    }

<<<<<<< HEAD
    // Gọi API chi tiết chi nhánh
    try {
      const res = await fetch(`http://localhost:8088/api/booking/branches/${branchId}/details`);
      const data = await res.json();

      // data.branch, data.barbers, data.services kỳ vọng từ backend
      setBooking((prev) => ({ ...prev, branch: data.branch?.name || "" }));
      setBarbers(data.barbers || []);
      setServices(data.services || []);

      // tạo danh sách times từ openTime-closeTime theo slotDuration
      if (data.branch && data.branch.openTime && data.branch.closeTime && data.branch.slotDuration) {
        const start = new Date(`2000-01-01T${data.branch.openTime}`);
        const end = new Date(`2000-01-01T${data.branch.closeTime}`);
        const slot = Number(data.branch.slotDuration) || 60;
        const slots = [];
        // dùng copy vì setMinutes thay đổi đối tượng Date
        for (let t = new Date(start); t < end; t = new Date(t.getTime() + slot * 60000)) {
          const hhmm = t.toTimeString().slice(0, 5); // HH:mm
=======
    try {
      const res = await fetch(`http://localhost:8088/api/booking/branches/${branchId}`);
      const data = await res.json();

      setBooking((prev) => ({ ...prev, branch: data.name || "" }));
      setBarbers(data.barbers || []);
      setServices(data.services || []);

      if (data.openTime && data.closeTime && data.slotDuration) {
        const start = new Date(`2000-01-01T${data.openTime}`);
        const end = new Date(`2000-01-01T${data.closeTime}`);
        const slot = Number(data.slotDuration) || 60;
        const slots = [];
        for (let t = new Date(start); t < end; t = new Date(t.getTime() + slot * 60000)) {
          const hhmm = t.toTimeString().slice(0, 5);
>>>>>>> origin/main
          slots.push(hhmm);
        }
        setTimes(slots);
      } else {
        setTimes([]);
      }
    } catch (err) {
      console.error("Error fetch branch details:", err);
      setBarbers([]);
      setServices([]);
      setTimes([]);
    }
  };

<<<<<<< HEAD
  const handleBarberChange = (e) => {
    const barberId = Number(e.target.value) || null;
    const barber = barbers.find((b) => Number(b.idBarber) === barberId);
    setBooking({ ...booking, barberId, barber: barber?.name || "" });
  };

  // Khi chọn ngày: cập nhật booking.date và load booked times từ backend (nếu có)
  const handleDateChange = async (e) => {
    const date = e.target.value; // "YYYY-MM-DD"
    setBooking((prev) => ({ ...prev, date }));

    // Nếu bạn có API để lấy giờ đã đặt theo branch + barber + date thì gọi ở đây
    // Ví dụ endpoint giả: /api/booking/booked-times?branchId=1&barberId=2&date=2025-10-05
    try {
      if (booking.branchId) {
        const res = await fetch(
          `http://localhost:8088/api/booking/booked-times?branchId=${booking.branchId}` +
            `${booking.barberId ? `&barberId=${booking.barberId}` : ""}&date=${date}`
        );
        if (res.ok) {
          const data = await res.json(); // kỳ vọng trả về { times: ["09:00","10:00"] } hoặc ["09:00",...]
          const timesArr = Array.isArray(data) ? data : data.times || [];
          setBookedTimesByDate((prev) => ({ ...prev, [date]: timesArr }));
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch booked times, fallback to mock if any", err);
    }

    // fallback demo (nếu backend không có): ví dụ mock
    const mockBooked = {
      "2025-10-05": ["10:00", "15:00"],
      "2025-10-04": ["09:00", "14:00"],
    };
    setBookedTimesByDate((prev) => ({ ...prev, [date]: mockBooked[date] || [] }));
  };

  const handleTimeSelect = (time) => {
    // nếu time đã bị booked thì không chọn
=======
  const handleBarberChange = async (e) => {
    const barberId = Number(e.target.value) || null;
    const barber = barbers.find((b) => Number(b.idBarber) === barberId);
    setBooking({ ...booking, barberId, barber: barber?.user?.fullName || "" });

    if (!barberId) return;

    try {
      const res = await fetch(`http://localhost:8088/api/booking/barbers/${barberId}`);
      const data = await res.json();

      // ✅ Gom booking theo ngày
      const grouped = {};
      data.bookings.forEach((item) => {
        const date = item.bookingDate.split("T")[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item.bookingTime);
      });
      setBookedTimesByDate(grouped);

      // ✅ Lưu ngày nghỉ
      const unava = [];
      data.unavailabilities.forEach((u) => {
        const start = new Date(u.startDate);
        const end = new Date(u.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          unava.push(d.toISOString().split("T")[0]);
        }
      });
      setUnavailableDates(unava);
    } catch (err) {
      console.error("Error fetching barber booked times:", err);
    }
  };

  // ✅ Reset ngày nếu đang chọn vào ngày nghỉ
  useEffect(() => {
    if (unavailableDates.includes(booking.date)) {
      setBooking((prev) => ({ ...prev, date: "" }));
    }
  }, [unavailableDates]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setBooking((prev) => ({ ...prev, date }));
  };

  const handleTimeSelect = (time) => {
>>>>>>> origin/main
    const bookedTimes = booking.date ? bookedTimesByDate[booking.date] || [] : [];
    if (bookedTimes.includes(time)) return;
    setBooking({ ...booking, time });
  };

  const handleServiceAdd = (e) => {
    const selectedId = Number(e.target.value) || null;
    const service = services.find((s) => Number(s.idService) === selectedId);
    if (service && !booking.services.find((s) => Number(s.idService) === Number(service.idService))) {
      setBooking({ ...booking, services: [...booking.services, service] });
    }
  };

  const handleRemoveService = (idService) =>
    setBooking({ ...booking, services: booking.services.filter((s) => Number(s.idService) !== Number(idService)) });

  const handleVoucherSelect = (voucher) => {
    setBooking({ ...booking, discount: voucher.discount, voucher });
    setShowVoucherList(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalPrice = booking.services.reduce((sum, s) => sum + Number(s.price), 0);
    const discountAmount = (totalPrice * booking.discount) / 100;
    const finalPrice = totalPrice - discountAmount;

<<<<<<< HEAD
    // Gọi API tạo booking
=======
>>>>>>> origin/main
    try {
      const res = await fetch("http://localhost:8088/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
<<<<<<< HEAD
          idCustomer: 1, // TODO: lấy từ user login
          idBranch: booking.branchId,
          idBarber: booking.barberId,
          bookingDate: booking.date, // dùng date user chọn
          bookingTime: booking.time,
          services: booking.services.map((s) => ({ idService: s.idService, price: s.price, quantity: 1 })),
=======
          idCustomer: 2,
          idBranch: booking.branchId,
          idBarber: booking.barberId,
          bookingDate: booking.date,
          bookingTime: booking.time,
          services: booking.services.map((s) => ({
            idService: s.idService,
            price: s.price,
            quantity: 1,
          })),
>>>>>>> origin/main
          description: booking.services.map((s) => s.name).join(", "),
        }),
      });
      const result = await res.json();
      if (res.ok) {
        alert(`Đặt lịch thành công!\nThành tiền: ${finalPrice.toLocaleString()}đ`);
<<<<<<< HEAD
=======
        window.location.reload(); // ✅ Load lại giao diện
>>>>>>> origin/main
      } else {
        alert("Lỗi đặt lịch: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error create booking:", err);
      alert("Không thể kết nối server!");
    }
  };

<<<<<<< HEAD
  // ================= RENDER =================
  const totalPrice = booking.services.reduce((sum, s) => sum + Number(s.price), 0);
  const discountAmount = (totalPrice * booking.discount) / 100;
  const finalPrice = totalPrice - discountAmount;

=======
  const totalPrice = booking.services.reduce((sum, s) => sum + Number(s.price), 0);
  const discountAmount = (totalPrice * booking.discount) / 100;
  const finalPrice = totalPrice - discountAmount;
>>>>>>> origin/main
  const bookedTimes = booking.date ? bookedTimesByDate[booking.date] || [] : [];

  return (
    <DefaultLayout>
      <div className={styles.bookingWrapper}>
        <div className={styles.logoBarber}>
          <img src="/rau.png" alt="Barber Logo" />
        </div>

        <div className={styles.bookingContainer}>
          <h2>Đặt lịch Barber</h2>
          <form onSubmit={handleSubmit}>
<<<<<<< HEAD
            {/* Chọn cơ sở */}
=======
            {/* Cơ sở */}
>>>>>>> origin/main
            <div className={styles.formGroup}>
              <label>Cơ sở:</label>
              <select value={booking.branchId || ""} onChange={handleBranchChange}>
                <option value="">-- Chọn cơ sở --</option>
                {branches.map((b) => (
                  <option key={b.idBranch} value={b.idBranch}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

<<<<<<< HEAD
            {/* Chọn barber */}
=======
            {/* Barber */}
>>>>>>> origin/main
            <div className={styles.formGroup}>
              <label>Kỹ thuật viên:</label>
              <select value={booking.barberId || ""} onChange={handleBarberChange} disabled={!barbers.length}>
                <option value="">-- Chọn barber --</option>
                {barbers.map((barber) => (
                  <option key={barber.idBarber} value={barber.idBarber}>
<<<<<<< HEAD
                    {barber.name}
=======
                    {barber.user?.fullName}
>>>>>>> origin/main
                  </option>
                ))}
              </select>
            </div>

<<<<<<< HEAD
            {/* Chọn ngày */}
            <div className={styles.formGroup}>
              <label>Ngày:</label>
              <input type="date" value={booking.date} onChange={handleDateChange} />
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
                    disabled={bookedTimes.includes(time) || !booking.date}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn dịch vụ */}
=======
            {/* Ngày */}
            <div className={styles.formGroup}>
              <label>Ngày:</label>
              <select value={booking.date} onChange={handleDateChange}>
                <option value="">-- Chọn ngày --</option>
                {[...Array(8)].map((_, i) => {
                  const d = new Date();
                  d.setDate(today.getDate() + i);
                  const value = d.toISOString().split("T")[0];
                  const label = d.toLocaleDateString("vi-VN", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  const isUnavailable = unavailableDates.includes(value);
                  return (
                    <option key={i} value={value} disabled={isUnavailable}>
                      {label} {isUnavailable ? "(Nghỉ)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Thời gian */}
            <div className={styles.formGroup}>
              <label>Thời gian:</label>
              <div className={styles.timeGrid}>
                {times.map((time, i) => {
                  let isPast = false;
                  if (booking.date) {
                    const todayStr = today.toISOString().split("T")[0];
                    if (booking.date === todayStr) {
                      const [hh, mm] = time.split(":").map(Number);
                      const slotDate = new Date(today);
                      slotDate.setHours(hh, mm, 0, 0);
                      if (slotDate < today) {
                        isPast = true;
                      }
                    }
                  }

                  const isBooked = bookedTimes.includes(time);
                  const disabled = isBooked || isPast || !booking.date;

                  return (
                    <button
                      key={i}
                      type="button"
                      className={`${styles.timeSlot} ${isBooked || isPast ? styles.booked : ""} ${
                        booking.time === time ? styles.selected : ""
                      }`}
                      onClick={() => handleTimeSelect(time)}
                      disabled={disabled}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dịch vụ */}
>>>>>>> origin/main
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

<<<<<<< HEAD
            {/* Tổng giá + giảm giá */}
=======
            {/* Tổng giá */}
>>>>>>> origin/main
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

        <img src="/keo.png" alt="Left Scissors" className={styles.scissorsLeft} />
        <img src="/keo.png" alt="Right Scissors" className={styles.scissorsRight} />

        {showVoucherList && (
          <VoucherPopup vouchers={vouchers} onClose={() => setShowVoucherList(false)} onSelect={handleVoucherSelect} />
        )}
      </div>
    </DefaultLayout>
  );
}

export default BookingPage;

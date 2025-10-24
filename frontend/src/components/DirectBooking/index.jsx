import React, { useState, useEffect } from "react";
import styles from "./DirectBooking.module.scss";

export default function DirectBooking({ onClose, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [customerExists, setCustomerExists] = useState(false);
  const [customerId, setCustomerId] = useState(0);
  const [checking, setChecking] = useState(false);

  const [branches, setBranches] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);

  const [times, setTimes] = useState([]);
  const [bookedTimesByDate, setBookedTimesByDate] = useState({});
  const [unavailableDates, setUnavailableDates] = useState([]);

  const [form, setForm] = useState({
    customerType: "existing",
    name: "",
    branchId: "",
    barberId: "",
    date: "",
    time: "",
    services: [],
  });

  const today = new Date();

  // ====== LOAD CHI NHÁNH ======
  useEffect(() => {
    fetch("http://localhost:8088/api/bookings/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data || []))
      .catch((err) => console.error("Error fetch branches:", err));
  }, []);

  // ====== CHỌN CHI NHÁNH ======
  const handleBranchChange = async (e) => {
    const branchId = Number(e.target.value);
    setForm((prev) => ({
      ...prev,
      branchId,
      barberId: "",
      date: "",
      time: "",
      services: [],
    }));

    if (!branchId) {
      setBarbers([]);
      setServices([]);
      setTimes([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8088/api/bookings/branches/${branchId}`);
      const data = await res.json();
      setBarbers(data.barbers || []);
      setServices(data.services || []);

      // Tạo khung giờ làm việc
      if (data.openTime && data.closeTime && data.slotDuration) {
        const start = new Date(`2000-01-01T${data.openTime}`);
        const end = new Date(`2000-01-01T${data.closeTime}`);
        const slot = Number(data.slotDuration) || 60;
        const slots = [];
        for (let t = new Date(start); t < end; t = new Date(t.getTime() + slot * 60000)) {
          slots.push(t.toTimeString().slice(0, 5));
        }
        setTimes(slots);
      } else {
        setTimes([]);
      }
    } catch (err) {
      console.error("Error fetch branch details:", err);
    }
  };

  // ====== CHỌN BARBER ======
  const handleBarberChange = async (e) => {
    const barberId = Number(e.target.value);
    setForm((prev) => ({ ...prev, barberId }));

    if (!barberId) return;

    try {
      const res = await fetch(`http://localhost:8088/api/bookings/barbers/${barberId}`);
      const data = await res.json();

      // Gom các giờ đã đặt theo ngày
      const grouped = {};
      data.bookings?.forEach((b) => {
        const dateStr = new Date(b.bookingDate).toISOString().split("T")[0];
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(b.bookingTime);
      });
      setBookedTimesByDate(grouped);

      // Lưu ngày nghỉ
      const unava = [];
      data.unavailabilities?.forEach((u) => {
        const start = new Date(u.startDate);
        const end = new Date(u.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          unava.push(d.toISOString().split("T")[0]);
        }
      });
      setUnavailableDates(unava);
    } catch (err) {
      console.error("Error fetch booked slots:", err);
    }
  };

  // ====== CHỌN NGÀY ======
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setForm((prev) => ({ ...prev, date, time: "" }));

    if (!form.barberId) return;

    try {
      const res = await fetch(`http://localhost:8088/api/bookings/barbers/${form.barberId}?date=${date}`);
      const data = await res.json();

      const grouped = {};
      grouped[date] =
        data.bookings
          ?.filter((b) => new Date(b.bookingDate).toISOString().split("T")[0] === date)
          .map((b) => b.bookingTime) || [];

      setBookedTimesByDate((prev) => ({ ...prev, ...grouped }));

      // Ngày nghỉ
      const unava = [];
      data.unavailabilities?.forEach((u) => {
        const start = new Date(u.startDate);
        const end = new Date(u.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          unava.push(d.toISOString().split("T")[0]);
        }
      });
      setUnavailableDates(unava);
    } catch (err) {
      console.error("Error fetch booked slots on date change:", err);
    }
  };

  // ====== CHỌN GIỜ ======
  const handleTimeSelect = (time) => {
    const bookedTimes = form.date ? bookedTimesByDate[form.date] || [] : [];
    if (!bookedTimes.includes(time)) setForm((prev) => ({ ...prev, time }));
  };

  // ====== DỊCH VỤ ======
  const handleServiceAdd = (e) => {
    const selectedId = Number(e.target.value);
    const selected = services.find((s) => s.idService === selectedId);
    if (selected && !form.services.find((s) => s.idService === selected.idService)) {
      setForm((prev) => ({ ...prev, services: [...prev.services, selected] }));
    }
  };

  const handleRemoveService = (idService) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.idService !== idService),
    }));
  };

  // ====== KIỂM TRA KHÁCH HÀNG ======
  const handleCheck = async () => {
    if (!phone.trim()) {
      alert("Vui lòng nhập số điện thoại!");
      return;
    }

    setChecking(true);
    try {
      const res = await fetch(`http://localhost:8088/api/booking-direct/find?phone=${phone}`);
      const data = await res.json();

      if (data.exists) {
        setCustomerExists(true);
        setForm((prev) => ({ ...prev, name: data.name }));
        setCustomerId(data.idCustomer || 0);
      } else {
        setCustomerExists(false);
        setForm((prev) => ({ ...prev, name: "Khách vãng lai" }));
        setCustomerId(0);
        alert("Không tìm thấy tài khoản này (sẽ lưu là khách vãng lai).");
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra khách hàng:", err);
      alert("Không thể kiểm tra thông tin khách hàng!");
    } finally {
      setChecking(false);
    }
  };

  // ====== GỬI BOOKING ======
  const handleSubmit = async () => {
    if (!form.branchId || !form.barberId || !form.date || !form.time || !form.services.length) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const payload = {
      idCustomer: customerId || 0, // ✅ nếu không có id thì gán 0
      idBranch: form.branchId,
      idBarber: form.barberId,
      bookingDate: form.date,
      bookingTime: form.time,
      description: form.services.map((s) => s.name).join(", "),
      services: form.services.map((s) => ({
        idService: s.idService,
        price: s.price,
        quantity: 1,
      })),
      customerName: form.name || "Khách vãng lai",
      phoneNumber: phone || "",
    };

    try {
      const res = await fetch("http://localhost:8088/api/booking-direct/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Booking failed:", data);
        alert(`Đặt lịch thất bại: ${data.message || "Lỗi server"}`);
        return;
      }

      alert("✅ Đặt lịch trực tiếp thành công!");
      if (onSuccess) onSuccess();
      else onClose();
    } catch (err) {
      console.error("Network error:", err);
      alert("Không thể kết nối server!");
    }
  };

  const totalPrice = form.services.reduce((sum, s) => sum + Number(s.price), 0);
  const bookedTimes = form.date ? bookedTimesByDate[form.date] || [] : [];

  // ====== UI ======
  return (
    <div className={styles.overlay}>
      <div className={styles.form}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        <h2>Đặt lịch trực tiếp</h2>

        <div className={styles.scrollable}>
          <div className={styles.formContent}>
            {/* Loại khách hàng */}
            <div className={styles.section}>
              <label>Loại khách hàng:</label>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="customerType"
                    value="existing"
                    checked={form.customerType === "existing"}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        customerType: "existing",
                        name: "",
                        branchId: "",
                        barberId: "",
                        date: "",
                        time: "",
                        services: [],
                      }))
                    }
                  />
                  Đã có tài khoản
                </label>
                <label>
                  <input
                    type="radio"
                    name="customerType"
                    value="new"
                    checked={form.customerType === "new"}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        customerType: "new",
                        name: "Khách vãng lai",
                        branchId: "",
                        barberId: "",
                        date: "",
                        time: "",
                        services: [],
                      }))
                    }
                  />
                  Chưa có tài khoản
                </label>
              </div>
            </div>

            {/* Số điện thoại */}
            {form.customerType === "existing" && (
              <>
                <div className={styles.section}>
                  <label>Số điện thoại khách hàng:</label>
                  <div className={styles.phoneRow}>
                    <input
                      type="text"
                      placeholder="Nhập SĐT..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button onClick={handleCheck} disabled={checking}>
                      {checking ? "Đang kiểm tra..." : "Kiểm tra"}
                    </button>
                  </div>
                </div>

                {customerExists && (
                  <div className={styles.section}>
                    <label>Họ và tên:</label>
                    <input type="text" value={form.name} readOnly />
                  </div>
                )}
              </>
            )}

            {/* Chi nhánh */}
            <div className={styles.section}>
              <label>Chi nhánh:</label>
              <select value={form.branchId} onChange={handleBranchChange}>
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map((b) => (
                  <option key={b.idBranch} value={b.idBranch}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Barber */}
            <div className={styles.section}>
              <label>Thợ cắt:</label>
              <select value={form.barberId} onChange={handleBarberChange} disabled={!barbers.length}>
                <option value="">-- Chọn thợ cắt --</option>
                {barbers.map((b) => (
                  <option key={b.idBarber} value={b.idBarber}>
                    {b.user?.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Ngày */}
            <div className={styles.section}>
              <label>Ngày:</label>
              <select value={form.date} onChange={handleDateChange}>
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

            {/* Giờ */}
            <div className={styles.section}>
              <label>Giờ:</label>
              <div className={styles.timeGrid}>
                {times.map((time, i) => {
                  let isPast = false;
                  if (form.date) {
                    const todayStr = today.toISOString().split("T")[0];
                    if (form.date === todayStr) {
                      const [hh, mm] = time.split(":").map(Number);
                      const slotDate = new Date(today);
                      slotDate.setHours(hh, mm, 0, 0);
                      if (slotDate < today) isPast = true;
                    }
                  }

                  const isBooked = bookedTimes.includes(time);
                  const disabled = isBooked || isPast || !form.date;

                  return (
                    <button
                      key={i}
                      type="button"
                      className={`${styles.timeSlot} ${isBooked || isPast ? styles.booked : ""} ${
                        form.time === time ? styles.selected : ""
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
            <div className={styles.section}>
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
                {form.services.map((s) => (
                  <li key={s.idService}>
                    {s.name} - {Number(s.price).toLocaleString()}đ
                    <button type="button" onClick={() => handleRemoveService(s.idService)}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <p>
                <strong>Tổng tiền:</strong> {totalPrice.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>

        <div className={styles.submitContainer}>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Xác nhận booking
          </button>
        </div>
      </div>
    </div>
  );
}

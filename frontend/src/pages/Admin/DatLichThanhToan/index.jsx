import React, { useState } from "react";
import styles from "./DatLichThanhToan.module.scss";
import BookingList from "~/components/BookingList";
import PaymentModal from "~/components/PaymentModal";
import DirectBooking from "~/components/DirectBooking";

export default function PaymentBookingPage() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) =>
    date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });

  // Giới hạn: hôm qua → 7 ngày sau
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 1);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    if (newDate >= minDate) setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    if (newDate <= maxDate) setSelectedDate(newDate);
  };

  const isToday =
    new Date().toDateString() === selectedDate.toDateString();

  return (
    <div className={styles.page}>
      {/* Bộ chọn ngày */}
      <div className={styles.dateSelector}>
        <button
          className={styles.arrowButton}
          onClick={handlePrevDay}
          disabled={selectedDate <= minDate}
        >
          &lt;
        </button>

        <div className={styles.dateDisplay}>
          {isToday ? "Hôm nay" : formatDate(selectedDate)}
        </div>

        <button
          className={styles.arrowButton}
          onClick={handleNextDay}
          disabled={selectedDate >= maxDate}
        >
          &gt;
        </button>
      </div>

      {/* Danh sách lịch hẹn */}
      <div className={styles.container}>
        <BookingList
          date={selectedDate.toISOString().split("T")[0]}
          onSelect={setSelectedBooking}
        />

        {selectedBooking && (
          <PaymentModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </div>

      {/* Nút booking trực tiếp */}
      <button
        className={styles.bookingButton}
        onClick={() => setShowBookingForm(true)}
      >
        + Booking trực tiếp
      </button>

      {showBookingForm && (
        <DirectBooking onClose={() => setShowBookingForm(false)} />
      )}
    </div>
  );
}

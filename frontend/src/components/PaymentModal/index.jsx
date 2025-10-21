import React, { useState, useEffect } from "react";
import styles from "./PaymentModal.module.scss";

// Import các step con
import Step1_BookingInfo from "./BookingInfo";
import Step2_Rating from "./Rating";
import Step3_Tips from "./Tips";
import Step4_Invoice from "./Invoice";

export default function PaymentModal({ booking, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);

  // ✅ Khi booking thay đổi (hoặc mở modal), khởi tạo dữ liệu từ API thật
  useEffect(() => {
    if (!booking) return;

    const initialData = {
      booking: {
        customer: booking.customer?.name || "Khách lẻ",
        barber: booking.barber?.name || "Chưa chỉ định",
        time: booking.bookingTime || "Không rõ",
        branch: booking.branch?.name || "",
      },
      services:
        booking.services?.map((s) => ({
          id: s.id,
          name: s.name,
          price: parseFloat(s.price) || 0,
          selected: true,
        })) || [],
      voucher: null, // có thể bổ sung sau nếu có API voucher
      serviceRating: 0,
      barberRating: 0,
      tip: booking.tip || 0,
      note: booking.description || "",
    };

    setFormData(initialData);
  }, [booking]);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  if (!formData) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Nút đóng */}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Bước 1: Xác nhận thông tin */}
        {step === 1 && <Step1_BookingInfo data={formData} setData={setFormData} onNext={nextStep} />}

        {/* Bước 2: Đánh giá */}
        {step === 2 && <Step2_Rating data={formData} setData={setFormData} onNext={nextStep} onBack={prevStep} />}

        {/* Bước 3: Nhập tiền tip */}
        {step === 3 && <Step3_Tips data={formData} setData={setFormData} onNext={nextStep} onBack={prevStep} />}

        {/* Bước 4: Hóa đơn */}
        {step === 4 && <Step4_Invoice data={formData} onBack={prevStep} onClose={onClose} />}
      </div>
    </div>
  );
}

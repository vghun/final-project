import React, { useState } from "react";
import styles from "./PaymentModal.module.scss";

import Step1_BookingInfo from "./BookingInfo";
import Step2_Rating from "./Rating";
import Step3_Tips from "./Tips";
import Step4_Invoice from "./Invoice";

export default function PaymentModal({ booking, onClose }) {
  const [step, setStep] = useState(1);

  // ✅ Khởi tạo dữ liệu đầy đủ
  const [formData, setFormData] = useState({
    booking: {
      customer: booking.customer,
      barber: booking.barber,
      time: booking.time,
      branch: booking.branch,
    },
    services: [
      { id: 1, name: "Cạo râu", price: 40000, selected: true },
      { id: 2, name: "Gội đầu thư giãn", price: 60000, selected: false },
      { id: 3, name: "Uốn tóc nam", price: 120000, selected: false },
    ],
    voucher: {
    code: "GIAM10",
    discountPercent: 10,
  },
    serviceRating: 0,
    barberRating: 0,
    tip: 0,
    note: "",
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {step === 1 && (
          <Step1_BookingInfo
            data={formData}
            setData={setFormData}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <Step2_Rating
            data={formData}
            setData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 3 && (
          <Step3_Tips
            data={formData}
            setData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 4 && (
          <Step4_Invoice
            data={formData}
            onBack={prevStep}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

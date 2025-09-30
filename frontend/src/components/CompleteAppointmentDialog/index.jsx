import React, { useState } from "react";
import styles from "./CompleteAppointmentDialog.module.scss";

function CompleteAppointmentDialog({ open, onClose, appointment, onComplete }) {
  const [service, setService] = useState(appointment?.service || "");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState({
    front: null,
    left: null,
    right: null,
    back: null,
  });

  if (!open || !appointment) return null;

  const handleFileChange = (e, position) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [position]: file }));
    }
  };

  const handleSubmit = () => {
    const uploadedCount = Object.values(images).filter((img) => img !== null).length;
    if (uploadedCount === 0) {
      alert("Vui lòng upload ít nhất 1 ảnh trước khi hoàn thành.");
      return;
    }

    // Trả dữ liệu về parent
    onComplete({
      ...appointment,
      service,
      description,
      images,
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2>Hoàn tất dịch vụ</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label>Tên khách hàng</label>
            <input type="text" value={appointment.customerName} readOnly />
          </div>

          <div className={styles.formGroup}>
            <label>Dịch vụ đã thực hiện</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Upload ảnh (ít nhất 1)</label>
            <div className={styles.uploadGrid}>
              {["front", "left", "right", "back"].map((pos) => (
                <div key={pos} className={styles.uploadBox}>
                  <p>{pos.toUpperCase()}</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, pos)}
                  />
                  {images[pos] && <span className={styles.fileName}>{images[pos].name}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={Object.values(images).every((img) => img === null)}
          >
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompleteAppointmentDialog;

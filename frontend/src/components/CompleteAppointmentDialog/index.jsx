import React, { useState } from "react";
import styles from "./CompleteAppointmentDialog.module.scss";
import { completeBooking } from "~/services/bookingService";

function CompleteAppointmentDialog({ open, onClose, appointment }) {
  const [description, setDescription] = useState("");
  // Thêm state để kiểm soát trạng thái tải (loading)
  const [isLoading, setIsLoading] = useState(false); 
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

  const handleSubmit = async () => {
    // 1. Kiểm tra nếu đang tải, THOÁT NGAY để tránh ấn liên tục
    if (isLoading) {
      return;
    }

    const uploadedCount = Object.values(images).filter((img) => img !== null).length;
    if (uploadedCount === 0) {
      alert("Vui lòng upload ít nhất 1 ảnh trước khi hoàn thành.");
      return;
    }

    // Bắt đầu tải: Set isLoading = true
    setIsLoading(true); 

    const formData = new FormData();
    formData.append("description", description);
    formData.append("idBarber", appointment.idBarber);
    formData.append("idCustomer", appointment.idCustomer);
    formData.append("idBooking", appointment.idBooking);

    Object.entries(images).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      const result = await completeBooking(appointment.idBooking, formData);
      console.log("Kết quả hoàn tất:", result);
      alert("Hoàn tất dịch vụ thành công!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi hoàn tất dịch vụ.");
    } finally {
      // Kết thúc tải: Set isLoading = false
      setIsLoading(false); 
    }
  };

  const isSubmitDisabled = Object.values(images).every((img) => img === null) || isLoading;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        {/* ... Header và Body giữ nguyên ... */}
        <div className={styles.header}>
          <h2>Hoàn tất dịch vụ</h2>
          {/* Vô hiệu hóa nút đóng khi đang tải */}
          <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {/* Vô hiệu hóa toàn bộ input khi đang tải */}
          <fieldset disabled={isLoading}> 
            {/* Tên khách hàng */}
            <div className={styles.formGroup}>
              <label>Tên khách hàng</label>
              <input type="text" value={appointment.customerName || "Khách vãng lai"} readOnly />
            </div>

            {/* Dịch vụ */}
            <div className={styles.formGroup}>
              <label>Dịch vụ đã thực hiện</label>
              <input type="text" value={appointment.services || "—"} readOnly />
            </div>

            {/* Mô tả */}
            <div className={styles.formGroup}>
              <label>Mô tả</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Upload ảnh */}
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
                    {images[pos] && (
                      <span className={styles.fileName}>{images[pos].name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {/* Vô hiệu hóa nút Hủy khi đang tải */}
          <button className={styles.cancelBtn} onClick={onClose} disabled={isLoading}>
            Hủy
          </button>
          {/* Ẩn / Hiện nội dung nút và vô hiệu hóa nếu đang tải */}
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isLoading ? "Đang tải..." : "Hoàn thành"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompleteAppointmentDialog;
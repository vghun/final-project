import React, { useState } from "react";
import styles from "./UploadVideoDialog.module.scss";

function UploadVideoDialog({ open, onClose, onUpload }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  if (!open) return null;

  const handleSubmit = () => {
    if (!videoFile) {
      alert("Vui lòng chọn video!");
      return;
    }

    const newVideo = {
      title,
      description,
      thumbnail: "/default-thumbnail.jpg", // TODO: tạo thumbnail từ video
      duration: "0:59", // giả lập
    };

    onUpload(newVideo);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2>Tải lên video tay nghề</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <p className={styles.description}>
          Chia sẻ kỹ năng và thu hút khách hàng mới
        </p>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label>Tiêu đề video</label>
            <input
              type="text"
              placeholder="VD: Kỹ thuật Fade chuyên nghiệp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả</label>
            <textarea
              placeholder="Mô tả chi tiết về video..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Chọn video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
            {videoFile && <p className={styles.fileName}>{videoFile.name}</p>}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Tải lên
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadVideoDialog;

import React, { useState } from "react";
import styles from "./UploadVideoDialog.module.scss";
import { uploadReel } from "~/services/reelService";

function UploadVideoDialog({ open, onClose, onUpload }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false); // ⬅️ trạng thái đang upload

  if (!open) return null;

  const handleSubmit = async () => {
    if (!videoFile) {
      alert("Vui lòng chọn video!");
      return;
    }

    setLoading(true); // bắt đầu upload

    const formData = new FormData();
    formData.append("video", videoFile);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("idBarber", 8);

    try {
      const newReel = await uploadReel(formData);
      onUpload(newReel);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi upload video");
    } finally {
      setLoading(false); // kết thúc upload
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2>Tải lên video tay nghề</h2>
          <button className={styles.closeBtn} onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>
        <p className={styles.description}>Chia sẻ kỹ năng và thu hút khách hàng mới</p>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label>Tiêu đề video</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mô tả</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Chọn video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              disabled={loading}
            />
            {videoFile && <p className={styles.fileName}>{videoFile.name}</p>}
          </div>
          <div className={styles.formGroup}>
            <label>Chọn thumbnail (tùy chọn)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              disabled={loading}
            />
            {thumbnailFile && <p className={styles.fileName}>{thumbnailFile.name}</p>}
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Tải lên"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadVideoDialog;

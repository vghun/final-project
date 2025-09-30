import React, { useRef, useState } from "react";
import styles from "./UploadPhotos.module.scss";

function UploadPhotos({ onUpload }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
    if (onUpload) onUpload(newFiles);
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        className={styles.input}
        onChange={handleFileChange}
      />
      <button
        className={styles.btn}
        onClick={() => fileInputRef.current.click()}
      >
        + Upload ảnh
      </button>
      <div className={styles.preview}>
        {files.map((file, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(file)}
            alt={`upload-${idx}`}
            className={styles.thumb}
          />
        ))}
      </div>
    </div>
  );
}

export default UploadPhotos;

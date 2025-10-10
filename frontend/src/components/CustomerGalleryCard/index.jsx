import React, { useState } from "react";
import styles from "./CustomerGalleryCard.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";

function WorkCard({ work }) {
  const [current, setCurrent] = useState(0);
  const totalPhotos = work.photos?.length || 0;

  const nextPhoto = () => {
    // Chuyển sang ảnh tiếp theo, quay lại 0 nếu là ảnh cuối cùng
    setCurrent((prev) => (prev + 1) % totalPhotos);
  };

  const prevPhoto = () => {
    // Chuyển về ảnh trước đó, về ảnh cuối cùng nếu là ảnh đầu tiên
    setCurrent((prev) =>
      prev === 0 ? totalPhotos - 1 : prev - 1
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.imgBox}>
        {totalPhotos > 0 && (
          <>
            {/* Vùng chứa tất cả ảnh để áp dụng hiệu ứng trượt */}
            <div
              className={styles.photoContainer}
              // Sử dụng CSS transform để trượt ảnh theo index
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {work.photos.map((photoUrl, index) => (
                <img
                  key={index}
                  src={photoUrl}
                  alt={`${work.customerName}-${index}`}
                  className={styles.photo}
                />
              ))}
            </div>

            {totalPhotos > 1 && (
              <>
                {/* Nút điều hướng */}
                <button
                  className={`${styles.navBtn} ${styles.left}`}
                  onClick={prevPhoto}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className={`${styles.navBtn} ${styles.right}`}
                  onClick={nextPhoto}
                >
                  <ChevronRight size={20} />
                </button>

                {/* Dot Indicators - Dấu chấm chỉ báo */}
                <div className={styles.dotIndicators}>
                  {work.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`${styles.dot} ${index === current ? styles.active : ""}`}
                      onClick={() => setCurrent(index)} // (Tùy chọn) cho phép chuyển ảnh bằng cách click vào chấm
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Phần thông tin còn lại giữ nguyên */}
      <div className={styles.info}>
        <h3 className={styles.customer}>{work.customerName}</h3>
        <p className={styles.barber}>Thợ: {work.barberName}</p>
        <p className={styles.service}>{work.service}</p>
        {work.description && (
          <p className={styles.desc}>{work.description}</p>
        )}
        <div className={styles.meta}>
          <span>{new Date(work.date).toLocaleDateString("vi-VN")}</span>
        </div>
      </div>
    </div>
  );
}

export default WorkCard;
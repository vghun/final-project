import React, { useState } from "react";
import styles from "./CustomerGalleryCard.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";

function WorkCard({ work }) {
  const [current, setCurrent] = useState(0);

  const nextPhoto = () => {
    setCurrent((prev) => (prev + 1) % work.photos.length);
  };

  const prevPhoto = () => {
    setCurrent((prev) =>
      prev === 0 ? work.photos.length - 1 : prev - 1
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.imgBox}>
        {work.photos.length > 0 && (
          <>
            <img
              src={work.photos[current]}
              alt={`${work.customerName}-${current}`}
              className={styles.photo}
            />
            {work.photos.length > 1 && (
              <>
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
              </>
            )}
          </>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.customer}>{work.customerName}</h3>
        <p className={styles.barber}>Thợ: {work.barberName}</p>
        <p className={styles.service}>{work.service}</p>
        <p className={styles.desc}>{work.description}</p>
        <div className={styles.meta}>
          <span>{work.date}</span>
          <div className={styles.stats}>
            <span>❤️ {work.likes}</span>
            <span>💬 {work.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkCard;

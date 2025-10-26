import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import styles from "./BarberCard.module.scss";

export default function BarberCard({ barber }) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  // Click card → mở trang thông tin thợ
  const handleOpenProfile = () => {
    navigate(`/barber/${barber.idBarber}`, { state: { barber } });
  };

  // Click nút Đặt lịch → không mở profile
  const handleBooking = (e) => {
    e.stopPropagation(); // ❗ Chặn sự kiện click lan lên card
    navigate("/booking", { state: { barber } });
  };

  return (
    <div
      className={styles.card}
      onClick={handleOpenProfile}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.imageWrap}>
        <img src={barber.avatar} alt={barber.name} />
        <div className={styles.ratingBadge}>
          <Star size={12} />
          <span>{barber.rating}</span>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{barber.name}</h3>
        <p className={styles.branch}>{barber.branch}</p>

        <button className={styles.bookBtn} onClick={handleBooking}>
          Đặt lịch
        </button>

        {hover && (
          <div className={styles.hoverPanel}>
            <div className={styles.panelLeft}>
              <img src={barber.avatar} alt={barber.name} />
            </div>
            <div className={styles.panelRight}>
              <p><strong>Tên thợ:</strong> {barber.name}</p>
              <p><strong>Chi nhánh:</strong> {barber.branch}</p>
              <p>
                <strong>Rating:</strong>
                <Star size={12} className={styles.starIcon} /> {barber.rating}
              </p>
              <p>{barber.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

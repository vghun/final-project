import React from "react";
import styles from "./BookingItem.module.scss";
import { Calendar, Clock, MapPin, Scissors, User } from "lucide-react";

export default function BookingItem({ booking }) {
  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.barberInfo}>
          <img src={booking.barber.avatar} alt={booking.barber.name} />
          <div>
            <h3>{booking.barber.name}</h3>
            <p className={styles.branchName}>{booking.branch.name}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className={styles.details}>
        <p><Calendar size={18} /> {booking.date}</p>
        <p><Clock size={18} /> {booking.time}</p>
        <p><MapPin size={18} /> {booking.branch.address}</p>
        <p><Scissors size={18} /> {booking.service}</p>
      </div>
    </div>
  );
}

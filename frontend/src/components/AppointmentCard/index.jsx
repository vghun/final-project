import React, { useState } from "react";
import styles from "./AppointmentCard.module.scss";
import CompleteAppointmentDialog from "~/components/CompleteAppointmentDialog";

function AppointmentCard({ appt, view }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleComplete = (data) => {
    console.log("Dịch vụ đã hoàn tất:", data);
    // TODO: gọi API lưu ảnh + cập nhật trạng thái lịch hẹn
  };

  return (
    <div
      className={`${styles.card} ${view === "week" ? styles.weekCard : ""}`}
    >
      <div className={styles.timeBox}>
        <div className={styles.time}>{appt.time}</div>
        {view === "day" && (
          <div className={styles.duration}>{appt.duration} phút</div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{appt.customerName}</h3>
        <p className={styles.service}>{appt.service}</p>
        {view === "day" && <p className={styles.phone}>{appt.phone}</p>}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.completeBtn}
          onClick={() => setDialogOpen(true)}
        >
          Hoàn tất
        </button>
      </div>

      {/* Dialog */}
      <CompleteAppointmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        appointment={appt}
        onComplete={handleComplete}
      />
    </div>
  );
}

export default AppointmentCard;

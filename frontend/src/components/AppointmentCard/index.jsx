import React, { useState } from "react";
import styles from "./AppointmentCard.module.scss";
import CompleteAppointmentDialog from "~/components/CompleteAppointmentDialog";

function AppointmentCard({ appt, view }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // ✅ Lấy danh sách tên dịch vụ
  const serviceNames =
    appt.BookingDetails?.map((d) => d.service?.name).join(", ") || "—";

  // ✅ Thông tin khách hàng
  const customerName = appt.Customer?.user.fullName || "Khách vãng lai";
  const customerPhone = appt.Customer?.user.phoneNumber || "Không có số";

  // ✅ Kiểm tra trạng thái
  const status = appt.status;
  const statusText =
    status === "Pending"
      ? "Đang chờ"
      : status === "Completed"
      ? "Đã hoàn thành"
      : "Đã hủy";

  return (
    <div
      className={`${styles.card} ${view === "week" ? styles.weekCard : ""}`}
    >
      {/* Cột thời gian */}
      <div className={styles.timeBox}>
        <div className={styles.time}>{appt.bookingTime}</div>
        {view === "day" && (
          <div className={styles.duration}>
            {appt.BookingDetails?.[0]?.service?.duration || "?"} phút
          </div>
        )}
      </div>

      {/* Cột thông tin */}
      <div className={styles.info}>
        {view === "day" ? (
          <>
            <h3 className={styles.name}>{customerName}</h3>
            <p className={styles.phone}>
              {customerPhone === "Không có số"
                ? "(Khách vãng lai)"
                : customerPhone}
            </p>
            <p className={styles.service}>
              <strong>Dịch vụ:</strong> {serviceNames}
            </p>
            <p className={styles.guest}>
              <strong>Số khách:</strong> {appt.guestCount}
            </p>
            {appt.description && (
              <p className={styles.note}>
                <strong>Ghi chú:</strong> {appt.description}
              </p>
            )}
          </>
        ) : (
          <>
            <p className={styles.service}>{serviceNames}</p>
          </>
        )}
      </div>

      {/* Cột trạng thái / hành động */}
      <div className={styles.actions}>
        {status === "Pending" ? (
          <button
            className={styles.completeBtn}
            onClick={() => setDialogOpen(true)}
          >
            Hoàn tất
          </button>
        ) : (
          <span
            className={`${styles.statusLabel} ${
              status === "Cancelled"
                ? styles.cancelled
                : status === "Completed"
                ? styles.completed
                : ""
            }`}
          >
            {statusText}
          </span>
        )}
      </div>

      {/* Dialog hoàn tất */}
      <CompleteAppointmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        appointment={{
          idBooking: appt.idBooking,
          idBarber: appt.idBarber,
          idCustomer: appt.idCustomer,
          customerName: customerName,
          services: serviceNames,
        }}
      />

    </div>
  );
}

export default AppointmentCard;

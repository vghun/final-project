import React from "react";
import { faMapMarkerAlt, faPenToSquare, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./BranchCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "~/context/ToastContext"; // import hook toast

const cx = classNames.bind(styles);

function BranchCard({
  name,
  address,
  manager,
  staff,
  revenue,
  status,
  onEdit,
  onToggle,
  suspendInfo = {},
}) {
  const { showToast } = useToast(); // hook toast
  const {
    isSuspended = false,
    alreadySet = false,
    suspendDate = null,
    resumeDate = null,
  } = suspendInfo;

  const today = new Date().toISOString().split("T")[0];
  const isActive = status === "Hoạt động" && !isSuspended;

  let toggleText = "";
  if (isActive) toggleText = "Tạm ngưng";
  else if (isSuspended && suspendDate && suspendDate > today)
    toggleText = "Tạm ngưng (sẽ bắt đầu)";
  else if (isSuspended && suspendDate && resumeDate)
    toggleText = `Đang tạm ngưng (${new Date(suspendDate).toLocaleDateString()} - ${resumeDate ? new Date(resumeDate).toLocaleDateString() : ""})`;
  else toggleText = "Kích hoạt";

  const handleToggle = () => {
    if (suspendDate && suspendDate > today) {
      showToast({
        text: `Chi nhánh sẽ tạm dừng từ ${new Date(suspendDate).toLocaleDateString()}`,
        type: "info",
      });
      return;
    }
    onToggle?.();
  };

  return (
    <div className={cx("card")}>
      <div className={cx("cardHeader")}>
        <h3>{name}</h3>
        <span className={cx("status", { active: isActive })}>
          {isSuspended
            ? `Tạm ngưng (${suspendDate ? new Date(suspendDate).toLocaleDateString() : ""} - ${resumeDate ? new Date(resumeDate).toLocaleDateString() : ""})`
            : status}
        </span>
      </div>

      <p className={cx("address")}>
        <FontAwesomeIcon icon={faMapMarkerAlt} /> {address}
      </p>

      <div className={cx("infoRow")}>
        <span>Quản lý:</span>
        <strong>{manager}</strong>
      </div>
      <div className={cx("infoRow")}>
        <span>Số thợ:</span>
        <strong>{staff} người</strong>
      </div>
      <div className={cx("infoRow")}>
        <span>Doanh thu:</span>
        <strong>{revenue}</strong>
      </div>

      <div className={cx("actions")}>
        <button className={cx("editBtn")} onClick={onEdit}>
          <FontAwesomeIcon icon={faPenToSquare} /> Sửa
        </button>

        <button
          className={cx("toggleBtn", { off: !isActive })}
          onClick={handleToggle}
          disabled={isSuspended && alreadySet && suspendDate > today}
        >
          <FontAwesomeIcon icon={isActive ? faToggleOn : faToggleOff} /> {toggleText}
        </button>
      </div>
    </div>
  );
}

export default BranchCard;

import React from "react";
import { faMapMarkerAlt, faPenToSquare, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./BranchCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const [statusMessage, setStatusMessage] = React.useState("");

  const handleToggle = () => {
    if (suspendDate && suspendDate > today) {
      setStatusMessage(`Chi nhánh sẽ tạm dừng từ ${new Date(suspendDate).toLocaleDateString()}`);
      return;
    }

    if (suspendDate && resumeDate && suspendDate <= today && resumeDate > today) {
      setStatusMessage(`Chi nhánh đang tạm ngưng từ ${new Date(suspendDate).toLocaleDateString()} đến ${new Date(resumeDate).toLocaleDateString()}`);
      return;
    }

    if (resumeDate && resumeDate <= today) {
      setStatusMessage(`Chi nhánh đã hoạt động trở lại từ ${new Date(resumeDate).toLocaleDateString()}`);
      return;
    }

    // Trường hợp bình thường, toggle status
    setStatusMessage(""); // reset message
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

        {statusMessage && <div className={cx("statusMessage")}>{statusMessage}</div>}
      </div>
    </div>
  );
}

export default BranchCard;

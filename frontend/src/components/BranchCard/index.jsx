import React from "react";
import {
  faMapMarkerAlt,
  faPenToSquare,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
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
    suspendDate = null,
    resumeDate = null,
  } = suspendInfo;

  const today = new Date().toISOString().split("T")[0];
const isActive = status === "Hoạt động";


  // format DD/MM/YYYY
  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // 👉 CHỈ disable khi chưa tới ngày suspend
  const isFutureSuspend = suspendInfo.isScheduledSuspend;


  // Text nút
  let toggleText = "";
  if (isActive) {
    toggleText = "Tạm ngưng";
  } else if (suspendDate && suspendDate > today) {
    toggleText = `Tạm ngưng (từ ${formatDate(suspendDate)})`;
  } else if (resumeDate && resumeDate > today) {
    toggleText = `Đang tạm ngưng (hoạt động lại ${formatDate(resumeDate)})`;
  } else if (suspendDate && resumeDate) {
    toggleText = `Đang tạm ngưng (${formatDate(suspendDate)} - ${formatDate(
      resumeDate
    )})`;
  } else {
    toggleText = "Kích hoạt";
  }

  // Tooltip
  let tooltipText = "";
  if (isActive) {
    tooltipText = "Chi nhánh đang hoạt động";
  } else if (suspendDate && suspendDate > today) {
    tooltipText = `Chi nhánh sẽ tạm ngưng từ ${formatDate(suspendDate)}`;
  } else if (resumeDate && resumeDate > today) {
    tooltipText = `Chi nhánh đang tạm ngưng, sẽ hoạt động lại từ ${formatDate(
      resumeDate
    )}`;
  } else if (suspendDate && resumeDate) {
    tooltipText = `Chi nhánh tạm ngưng từ ${formatDate(
      suspendDate
    )} đến ${formatDate(resumeDate)}`;
  } else {
    tooltipText = "Chi nhánh chưa hoạt động";
  }

  return (
    <div className={cx("card")}>
      <div className={cx("cardHeader")}>
        <h3>{name}</h3>
        <span className={cx("status", { inactive: !isActive })}>
          {isSuspended
            ? `Tạm ngưng (${formatDate(suspendDate)} - ${formatDate(
                resumeDate
              )})`
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

        <div className={cx("tooltipWrapper")}>
          <button
            className={cx("toggleBtn", { off: !isActive })}
            onClick={onToggle}
            disabled={isFutureSuspend}


          >
            <FontAwesomeIcon
              icon={isActive ? faToggleOn : faToggleOff}
            />{" "}
            {toggleText}
          </button>
          <span className={cx("tooltip")}>{tooltipText}</span>
        </div>
      </div>
    </div>
  );
}

export default BranchCard;

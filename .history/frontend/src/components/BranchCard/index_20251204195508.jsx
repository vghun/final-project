import React from "react";
import { faMapMarkerAlt, faPenToSquare, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./BranchCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

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
}) {
  const isActive = status === "Hoạt động";

  return (
    <div className={cx("card")}>
      <div className={cx("cardHeader")}>
        <h3>{name}</h3>
        <span className={cx("status", { active: isActive })}>{status}</span>
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
          onClick={onToggle}
        >
          <FontAwesomeIcon icon={isActive ? faToggleOn : faToggleOff} />{" "}
          {isActive ? "Tạm ngưng" : "Kích hoạt"}
        </button>
      </div>
    </div>
  );
}

export default BranchCard;

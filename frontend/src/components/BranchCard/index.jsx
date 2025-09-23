import React from "react";
import classNames from "classnames/bind";
import styles from "./BranchCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function BranchCard({ name, address, manager, staff, revenue, status }) {
  return (
    <div className={cx("card")}>
      <div className={cx("cardHeader")}>
        <h3>{name}</h3>
        <span className={cx("status")}>{status}</span>
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
        <button className={cx("editBtn")}>
          <FontAwesomeIcon icon={faPenToSquare} /> Sửa
        </button>
        <button className={cx("deleteBtn")}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

export default BranchCard;

import React from "react";
import classNames from "classnames/bind";
import styles from "./PromoCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function PromoCard({
  title,
  desc,
  discount,
  startDate,
  endDate,
  used,
  status,
}) {
  return (
    <div className={cx("card")}>
      <div className={cx("cardHeader")}>
        <div>
          <h3>{title}</h3>
          <p className={cx("desc")}>{desc}</p>
        </div>
        <span className={cx("status")}>{status}</span>
      </div>

      <div className={cx("infoRow")}>
        <div>
          <p className={cx("label")}>Giảm giá</p>
          <strong>{discount}</strong>
        </div>
        <div>
          <p className={cx("label")}>Ngày bắt đầu</p>
          <strong>{startDate}</strong>
        </div>
        <div>
          <p className={cx("label")}>Ngày kết thúc</p>
          <strong>{endDate}</strong>
        </div>
        <div>
          <p className={cx("label")}>Đã sử dụng</p>
          <strong>{used} lần</strong>
        </div>
      </div>

      <div className={cx("actions")}>
        <button className={cx("editBtn")}>
          <FontAwesomeIcon icon={faPenToSquare} /> Chỉnh sửa
        </button>
        <button className={cx("deleteBtn")}>
          <FontAwesomeIcon icon={faTrash} /> Xóa
        </button>
      </div>
    </div>
  );
}

export default PromoCard;

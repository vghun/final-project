import React from "react";
import classNames from "classnames/bind";
import styles from "./PromoCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function PromoCard({ voucher, onEdit, onDelete }) {
  if (!voucher) return null;

  const { title, description, discountPercent, startDate, expiryDate, usedCount, status } = voucher;

  return (
    <div className={cx("card")}>
      <div className={cx("cardHeader")}>
        <div>
          <h3>{title}</h3>
          <p className={cx("desc")}>{description}</p>
        </div>
        <span className={cx("status")}>{status ? "Active" : "Inactive"}</span>
      </div>

      <div className={cx("infoRow")}>
        <div>
          <p className={cx("label")}>Giảm giá</p>
          <strong>{discountPercent}%</strong>
        </div>
        <div>
          <p className={cx("label")}>Ngày bắt đầu</p>
          <strong>{startDate?.split("T")[0]}</strong>
        </div>
        <div>
          <p className={cx("label")}>Ngày kết thúc</p>
          <strong>{expiryDate?.split("T")[0]}</strong>
        </div>
        <div>
          <p className={cx("label")}>Đã sử dụng</p>
          <strong>{usedCount || 0} lần</strong>
        </div>
      </div>

      <div className={cx("actions")}>
        <button className={cx("editBtn")} onClick={() => onEdit(voucher)}>
          <FontAwesomeIcon icon={faPenToSquare} /> Chỉnh sửa
        </button>
        {onDelete && (
          <button className={cx("deleteBtn")} onClick={() => onDelete(voucher.idVoucher)}>
            <FontAwesomeIcon icon={faTrash} /> Xóa
          </button>
        )}
      </div>
    </div>
  );
}

export default PromoCard;

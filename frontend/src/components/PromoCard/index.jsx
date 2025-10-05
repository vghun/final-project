import React from "react";
import classNames from "classnames/bind";
import styles from "./PromoCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function PromoCard({ voucher, onEdit, onDelete }) {
  if (!voucher) return null;

  const {
    idVoucher,
    title,
    description,
    discountPercent,
    pointCost,
    totalQuantity,
    expiryDate,
    status,
  } = voucher;

  return (
    <div className={cx("card", { inactive: !status })}>
      {/* ===== Header ===== */}
      <div className={cx("cardHeader")}>
        <div>
          <h3 className={cx("title")}>{title}</h3>
          <p className={cx("desc")}>{description || "Không có mô tả"}</p>
        </div>
        <span className={cx("status", { inactive: !status })}>
          {status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* ===== Info Row ===== */}
      <div className={cx("infoRow")}>
        <div>
          <p className={cx("label")}>Giảm giá</p>
          <strong>{discountPercent}%</strong>
        </div>
        <div>
          <p className={cx("label")}>Điểm đổi</p>
          <strong>{pointCost}</strong>
        </div>
        <div>
          <p className={cx("label")}>Giới hạn</p>
          <strong>{totalQuantity ?? "Không giới hạn"}</strong>
        </div>
        <div>
          <p className={cx("label")}>Ngày hết hạn</p>
          <strong>{expiryDate?.split("T")[0]}</strong>
        </div>
      </div>

      {/* ===== Actions ===== */}
      <div className={cx("actions")}>
        <button className={cx("editBtn")} onClick={() => onEdit(voucher)}>
          <FontAwesomeIcon icon={faPenToSquare} /> Chỉnh sửa
        </button>

        {onDelete && (
          <button
            className={cx("deleteBtn")}
            onClick={() => onDelete(idVoucher)}
          >
            <FontAwesomeIcon icon={faTrash} /> Xóa
          </button>
        )}
      </div>
    </div>
  );
}

export default PromoCard;

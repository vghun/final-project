import React from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ServiceCard.module.scss";

const cx = classNames.bind(styles);

function ServiceCard({ id, image, category, name, description, price, duration }) {
  const navigate = useNavigate();

  return (
    <div className={cx("card")}>
      {/* Hình ảnh */}
      <div className={cx("image")} onClick={() => navigate(`/services/${id}`)}>
        <img src={image || "/service.png"} alt={name} />
      </div>

      {/* Nội dung */}
      <div className={cx("content")}>
        <span className={cx("category")}>{category}</span>
        <h4 className={cx("name")}>{name}</h4>

        <p className={cx("desc")}>{description}</p>

        {/* Giá + Thời lượng */}
        <div className={cx("priceDuration")}>
          <span className={cx("price")}>{Number(price).toLocaleString()}đ</span>
          <span className={cx("duration")}>{duration} phút</span>
        </div>

        {/* Button */}
        <div className={cx("actions")}>
          <button
            className={cx("btn", "outline")}
            onClick={() => navigate(`/services/${id}`)}
          >
            Xem chi tiết
          </button>
          <button
            className={cx("btn", "primary")}
            onClick={() => navigate(`/booking?service=${id}`)}
          >
            Đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;

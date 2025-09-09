import React from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ProductCard.module.scss";

const cx = classNames.bind(styles);

const ProductCard = ({
  id,
  image,
  badge,
  category,
  name,
  brand,
  rating,
  reviews,
  description,
  price,     // giá gốc
  discount,  // % giảm
  outOfStock
}) => {
  const navigate = useNavigate();

  const hasDiscount = discount && discount > 0;
  const finalPrice = hasDiscount
    ? Math.round(price * (1 - discount / 100))
    : price;

  return (
    <div className={cx("card")}>
      {/* Badge */}
      {(badge || hasDiscount) && (
        <span className={cx("badge", { danger: badge === "Hết hàng" })}>
          {badge || `-${discount}%`}
        </span>
      )}

      {/* Hình ảnh */}
      <div className={cx("image")} onClick={() => navigate(`/products/${id}`)}>
        <img src={image} alt={name} />
      </div>

      {/* Nội dung */}
      <div className={cx("content")}>
        <span className={cx("category")}>{category}</span>
        <h4 className={cx("name")}>{name}</h4>
        <p className={cx("brand")}>{brand}</p>

        {/* Rating */}
        <div className={cx("rating")}>
          <i className="fa-solid fa-star"></i>
          <span>{rating}</span>
          <span className={cx("reviews")}>({reviews})</span>
        </div>

        {/* Mô tả */}
        <p className={cx("desc")}>{description}</p>

        {/* Giá */}
        <div className={cx("price")}>
          <span className={cx("new")}>{finalPrice.toLocaleString()}đ</span>
          {hasDiscount && (
            <span className={cx("old")}>{price.toLocaleString()}đ</span>
          )}
        </div>

        {/* Buttons */}
        <div className={cx("actions")}>
          <button
            className={cx("btn", "outline")}
            onClick={() => navigate(`/products/${id}`)}
          >
            Xem chi tiết
          </button>
          <button className={cx("btn", "primary")} disabled={outOfStock}>
            {outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

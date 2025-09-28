import React from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ServiceCard.module.scss";

const cx = classNames.bind(styles);

function ServiceCard({ id, category, name, description, price, duration }) {
  const navigate = useNavigate();

  return (
    <div className={cx("card")} onClick={() => navigate(`/services/${id}`)}>
  <div className={cx("content")}>
    {category && <span className={cx("category")}>{category}</span>}
    
    <h4 className={cx("name")}>{name}</h4>
    <p className={cx("desc")}>{description}</p>

    <div className={cx("footer")}>
      <span className={cx("price")}>
        {Number(price).toLocaleString()}đ
      </span>
      <span className={cx("duration")}>{duration} phút</span>
    </div>
  </div>
</div>
  );
}

export default ServiceCard;

import React from "react";
import classNames from "classnames/bind";
import styles from "./KhuyenMai.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PromoCard from "~/components/PromoCard";

const cx = classNames.bind(styles);

const promotions = [
  {
    id: 1,
    title: "Giảm giá 20% dịch vụ cắt tóc",
    desc: "Áp dụng cho khách hàng mới",
    discount: "20%",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    used: 45,
    status: "Đang áp dụng",
  },
  {
    id: 2,
    title: "Combo cắt + gội + massage",
    desc: "Giảm 15% cho combo dịch vụ",
    discount: "15%",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    used: 28,
    status: "Đang áp dụng",
  },
];

function KhuyenMai() {
  return (
    <div className={cx("promoList")}>
      <div className={cx("header")}>
        <h2>Quản lý khuyến mãi</h2>
        <button className={cx("addBtn")}>
          <FontAwesomeIcon icon={faPlus} /> Tạo khuyến mãi
        </button>
      </div>

      <div className={cx("cards")}>
        {promotions.map((promo) => (
          <PromoCard key={promo.id} {...promo} />
        ))}
      </div>
    </div>
  );
}

export default KhuyenMai;

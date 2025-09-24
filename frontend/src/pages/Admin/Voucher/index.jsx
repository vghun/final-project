import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Voucher.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PromoCard from "~/components/PromoCard";       
import VoucherForm from "../../../components/VoucherForm";


const cx = classNames.bind(styles);

const initialPromotions = [
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

function Voucher() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [showForm, setShowForm] = useState(false);

  const handleAddVoucher = (newVoucher) => {
    setPromotions([
      ...promotions,
      { id: promotions.length + 1, ...newVoucher },
    ]);
  };

  return (
    <div className={cx("promoList")}>
      <div className={cx("header")}>
        <h2>Quản lý voucher</h2>
        <button className={cx("addBtn")} onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Tạo voucher
        </button>
      </div>

      <div className={cx("cards")}>
        {promotions.map((promo) => (
          <PromoCard key={promo.id} {...promo} />
        ))}
      </div>

      {showForm && (
        <VoucherForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddVoucher}
        />
      )}
    </div>
  );
}

export default Voucher;

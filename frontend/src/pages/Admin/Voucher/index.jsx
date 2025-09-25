import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Voucher.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PromoCard from "~/components/PromoCard";       
import VoucherForm from "../../../components/VoucherForm";
import { VoucherAPI } from "~/apis/voucherAPI";

const cx = classNames.bind(styles);

function Voucher() {
  const [promotions, setPromotions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchVouchers = async () => {
    try {
      const res = await VoucherAPI.getAll();
      if (res.success) {
        const mapped = res.data.map(v => ({
          id: v.idVoucher,
          title: v.title,
          desc: v.description || "",
          discount: `${v.discountPercent}%`,
          startDate: v.createdAt?.split("T")[0] || "",
          endDate: v.expiryDate?.split("T")[0] || "",
          used: 0, // nếu server không trả, để 0
          status: new Date(v.expiryDate) > new Date() ? "Đang áp dụng" : "Hết hạn",
        }));
        setPromotions(mapped);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách voucher:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

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
          onVoucherCreated={fetchVouchers} // reload danh sách sau khi tạo
        />
      )}
    </div>
  );
}

export default Voucher;

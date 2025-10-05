import React, { useState } from "react";
import classNames from "classnames/bind";

import styles from "./Admin.module.scss";
import BranchList from ".~/components/BranchList"; // 🟢 Thêm dòng này
import TabNav from "~/components/TabNav";
import ThongKe from "./ThongKe";
import ThoCatToc from "./ThoCatToc";
import Voucher from "./Voucher";
import LuongThuong from "./LuongThuong";
import QuanLyDiem from "./QuanLyDiem";
import DatLichThanhToan from "./DatLichThanhToan";

const cx = classNames.bind(styles);

const tabs = [
  { id: "thongke", label: "Thống kê" },
  { id: "chinhanh", label: "Chi nhánh" },
  { id: "tho", label: "Thợ cắt tóc" },
  { id: "voucher", label: "Quản lý voucher" },
  { id: "luong", label: "Lương thưởng" },
  { id: "booking", label: "Đặt lịch & Thanh toán" },
  { id: "loyalty", label: "Quản lý điểm" },
];

function Admin() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className={cx("wrapper")}>
      {/* ====== LOGO TRUNG TÂM ====== */}
      <div className={cx("logoBox")}>
        <img src="/keo.png" alt="Barbershop Logo" className={cx("logo")} />
        <h1 className={cx("brandName")}>BarberShop</h1>
      </div>

      {/* ====== DANH SÁCH CHI NHÁNH ====== */}
      <BranchList /> {/* 🟤 Thay phần thống kê bằng danh sách chi nhánh */}

      <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={cx("tabContent")}>
        {activeTab === "thongke" && <ThongKe />}
        {activeTab === "chinhanh" && <></>} {/* Có thể bỏ trống hoặc tái dùng */}
        {activeTab === "tho" && <ThoCatToc />}
        {activeTab === "voucher" && <Voucher />}
        {activeTab === "luong" && <LuongThuong />}
        {activeTab === "booking" && <DatLichThanhToan />}
        {activeTab === "loyalty" && <QuanLyDiem />}
      </div>
    </div>
  );
}

export default Admin;

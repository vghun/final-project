import React, { useState } from "react";
import classNames from "classnames/bind";

import styles from "./Admin.module.scss";
import BranchList from "~/components/BranchList";
import TabNav from "~/components/TabNav";
import ThongKe from "./ThongKe";
import ThoCatToc from "./ThoCatToc";
import Voucher from "./Voucher";
import LuongThuong from "./LuongThuong";
import QuanLyDiem from "./QuanLyDiem";
import DatLichThanhToan from "./DatLichThanhToan";
import TongQuan from "./TongQuan"; // 🆕 Thêm dòng này

const cx = classNames.bind(styles);

const tabs = [
  { id: "tongquan", label: "Tổng Quan" }, 
  { id: "thongke", label: "Thống kê" },
  { id: "chinhanh", label: "Chi nhánh" },
  { id: "tho", label: "Thợ cắt tóc" },
  { id: "voucher", label: "Quản lý voucher" },
  { id: "luong", label: "Lương thưởng" },
  { id: "booking", label: "Đặt lịch & Thanh toán" },
  { id: "loyalty", label: "Quản lý chính sách" },
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
      <BranchList />

      <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={cx("tabContent")}>
        {activeTab === "tongquan" && <TongQuan />} {/* 🆕 Tab tổng quan */}
        {activeTab === "thongke" && <ThongKe />}
        {activeTab === "chinhanh" && <></>}
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

import React, { useState } from "react";
import classNames from "classnames/bind";

import styles from "./Admin.module.scss";
import StatCard from "~/components/StatCard";
import TabNav from "~/components/TabNav";
import ThongKe from "./ThongKe";
import BranchList from "./BranchList"; // 🟢 thêm dòng này
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

      {/* ====== PHẦN CHỈ SỐ ====== */}
      <div className={cx("stats")}>
        <StatCard
          title="Doanh thu tháng"
          value="115.000.000đ"
          desc="+12.5% so với tháng trước"
        />
        <StatCard
          title="Tổng khách hàng"
          value="1247"
          desc="Khách hàng đã phục vụ"
        />
        <StatCard title="Lịch hẹn tháng" value="2156" desc="Tổng số lịch hẹn" />
        <StatCard title="Đánh giá TB" value="4.8" desc="Từ tất cả chi nhánh" />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={cx("tabContent")}>
        {activeTab === "thongke" && <ThongKe />}
        {activeTab === "chinhanh" && <BranchList />} {/* 🟢 Gọi ở đây */}
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

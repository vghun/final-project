import React, { useState } from "react";
import classNames from "classnames/bind";

import styles from "./Admin.module.scss";
import StatCard from "~/components/StatCard";
import TabNav from "~/components/TabNav";
import ThongKe from "./ThongKe";
import ChiNhanh from "./ChiNhanh";
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
  { id: "booking", label: "Đặt lịch & Thanh toán" },  // tab mới
  { id: "loyalty", label: "Quản lý điểm" },           // tab mới
];


function Admin() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <div>
          <h1 className={cx("title")}>Admin Dashboard</h1>
          <p className={cx("subtitle")}>Quản lý toàn bộ hệ thống barbershop</p>
        </div>
        <button className={cx("settingBtn")}>Cài đặt hệ thống</button>
      </div>

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
      {activeTab === "chinhanh" && <ChiNhanh />}
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

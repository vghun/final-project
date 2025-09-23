import React, { useState } from "react";
import classNames from "classnames/bind";

import styles from "./Admin.module.scss";
import StatCard from "~/components/StatCard";
import TabNav from "~/components/TabNav";
import ThongKe from "./ThongKe";
import ChiNhanh from "./ChiNhanh";
import ThoCatToc from "./ThoCatToc";
import KhuyenMai from "./KhuyenMai";
import LuongThuong from "./LuongThuong";

const cx = classNames.bind(styles);

const tabs = [
  { id: "thongke", label: "Thống kê" },
  { id: "chinhanh", label: "Chi nhánh" },
  { id: "tho", label: "Thợ cắt tóc" },
  { id: "khuyenmai", label: "Khuyến mãi" },
  { id: "luong", label: "Lương thưởng" },
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
        {activeTab === "khuyenmai" && <KhuyenMai />}
        {activeTab === "luong" && <LuongThuong />}
      </div>
    </div>
  );
}

export default Admin;

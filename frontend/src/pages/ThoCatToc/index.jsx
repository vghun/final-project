import React, { useState } from "react";
import classNames from "classnames/bind";

import styles from "./ThoCatToc.module.scss";
import StatCard from "~/components/StatCard";
import TabNav from "~/components/TabNav";

import LichHen from "./LichHen";
import HoSoCaNhan from "./HoSoCaNhan";
import VideoTayNghe from "./VideoTayNghe";
import SanPham from "./SanPham";
import Thuong from "./Thuong";

const cx = classNames.bind(styles);

const tabs = [
  { id: "lichhen", label: "Lịch hẹn hôm nay" },
  { id: "hoso", label: "Hồ sơ cá nhân" },
  { id: "video", label: "Video tay nghề" },
  { id: "sanpham", label: "Sản phẩm" },
  { id: "thuong", label: "Thưởng" },
];

function ThoCatToc() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className={cx("wrapper")}>
      {/* Header */}
      <div className={cx("header")}>
        <div>
          <h1 className={cx("title")}>Dashboard Thợ cắt tóc</h1>
          <p className={cx("subtitle")}>Chào mừng trở lại, Minh Tuấn!</p>
        </div>
        <button className={cx("settingBtn")}>Cài đặt</button>
      </div>

      {/* Stats */}
      <div className={cx("stats")}>
        <StatCard
          title="Lịch hẹn tuần này"
          value="28"
          desc="+12% so với tuần trước"
        />
        <StatCard
          title="Dịch vụ hoàn thành"
          value="25"
          desc="Tỷ lệ hoàn thành 89%"
        />
        <StatCard
          title="Doanh thu tuần"
          value="3.750.000đ"
          desc="+8% so với tuần trước"
        />
        <StatCard
          title="Đánh giá trung bình"
          value="4.9"
          desc="Từ 1247 khách hàng"
        />
      </div>

      {/* Tabs */}
      <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Nội dung tab */}
      <div className={cx("tabContent")}>
        {activeTab === "lichhen" && <LichHen />}
        {activeTab === "hoso" && <HoSoCaNhan />}
        {activeTab === "video" && <VideoTayNghe />}
        {activeTab === "sanpham" && <SanPham />}
        {activeTab === "thuong" && <Thuong />}
      </div>
    </div>
  );
}

export default ThoCatToc;

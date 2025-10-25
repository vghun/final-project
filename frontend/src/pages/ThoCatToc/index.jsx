import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ThoCatToc.module.scss";
import StatCard from "~/components/StatCard";
import TabNav from "~/components/TabNav";
import LichHen from "./LichHen";
import HoSoCaNhan from "./HoSoCaNhan";
import VideoTayNghe from "./VideoTayNghe";
import SanPham from "./SanPham";
import Thuong from "./Thuong";
import { fetchBarberDashboardStats } from "~/services/barberService";
import { useAuth } from "~/context/AuthContext";

const cx = classNames.bind(styles);

const formatCurrency = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return '0đ';
    return Math.round(num).toLocaleString("vi-VN") + "đ";
};

const tabs = [
    { id: "lichhen", label: "Lịch hẹn hôm nay" },
    { id: "hoso", label: "Hồ sơ cá nhân" },
    { id: "video", label: "Video tay nghề" },
    { id: "sanpham", label: "Sản phẩm" },
    { id: "thuong", label: "Thưởng" },
];

function ThoCatToc() {
    const { user, accessToken, loading: isAuthLoading } = useAuth();
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    
    const idBarber = user?.idUser;
    const barberName = user?.fullName || "Quý khách"; 

    useEffect(() => {
        // Kiểm tra điều kiện tải: Auth xong VÀ có ID Barber VÀ có Token
        if (isAuthLoading || !idBarber || !accessToken) {
            if (!isAuthLoading) setLoadingStats(false);
            return;
        }

        const loadStats = async () => {
            setLoadingStats(true);
            try {
                const data = await fetchBarberDashboardStats(idBarber, accessToken);
                // API trả về res (object chứa data), chúng ta cần lấy data bên trong
                // Giả định service đã trả về data (như trong hàm mẫu), nên ta dùng data
                setStats(data); 
            } catch (error) {
                console.error("Lỗi tải stats dashboard:", error);
                setStats(null);
            } finally {
                setLoadingStats(false);
            }
        };

        loadStats();
    }, [idBarber, accessToken, isAuthLoading]);

    if (isAuthLoading || loadingStats) {
        return <div className={cx("wrapper")}><p className={cx("loading")}>Đang tải Dashboard...</p></div>;
    }

    return (
        <div className={cx("wrapper")}>
            {/* Header */}
            <div className={cx("header")}>
                <div>
                    <h1 className={cx("title")}>Dashboard Thợ cắt tóc</h1>
                    <p className={cx("subtitle")}>Chào mừng trở lại, {barberName}!</p>
                </div>
            </div>

            {/* Stats - ĐÃ DÙNG DỮ LIỆU ĐỘNG */}
            <div className={cx("stats")}>
                {/* 1. Lịch hẹn tuần này */}
                <StatCard
                    title="Lịch hẹn tuần này"
                    value={stats.appointmentsCount.toLocaleString("vi-VN")}
                    desc={`+${stats.appointmentsChange}% so với tuần trước`}
                />
                {/* 2. Lượt xem Reels tuần */}
                <StatCard
                    title="Lượt xem Reels tuần"
                    value={stats.reelViews.toLocaleString("vi-VN")}
                    desc={`+${stats.reelViewsChange}% so với tuần trước`}
                />
                {/* 3. Doanh thu tuần */}
                <StatCard
                    title="Doanh thu tuần"
                    value={formatCurrency(stats.weeklyRevenue)}
                    desc={`+${stats.weeklyRevenueChange}% so với tuần trước`}
                />
                {/* 4. Đánh giá trung bình */}
                <StatCard
                    title="Đánh giá trung bình"
                    value={stats.avgRating.toFixed(1)}
                    desc={`Từ ${stats.totalRatings.toLocaleString("vi-VN")} khách hàng`}
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
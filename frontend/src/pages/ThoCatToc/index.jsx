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
    const value = parseFloat(num);
    if (isNaN(value)) return "0đ";
    return Math.round(value).toLocaleString("vi-VN") + "đ";
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
        if (isAuthLoading || !idBarber || !accessToken) {
            if (!isAuthLoading) setLoadingStats(false);
            return;
        }

        const loadStats = async () => {
            setLoadingStats(true);
            try {
                const data = await fetchBarberDashboardStats(idBarber, accessToken);
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
        return (
            <div className={cx("wrapper")}>
                <p className={cx("loading")}>Đang tải Dashboard...</p>
            </div>
        );
    }

    return (
        <div className={cx("wrapper")}>
            {/* Header */}
            <div className={cx("header")}>
                <div>
                    <h1 className={cx("title")}>Dashboard Thợ Cắt Tóc</h1>
                    <p className={cx("subtitle")}>Chào mừng trở lại, {barberName}!</p>
                </div>
            </div>

            {/* Stats */}
            <div className={cx("stats")}>
                <StatCard
                    title="Tổng lịch hẹn tuần này"
                    value={stats?.totalAppointmentsThisWeek?.toLocaleString("vi-VN") || "0"}
                    desc="Số cuộc hẹn (Pending + Completed)"
                />

                <StatCard
                    title="Tổng lượt xem"
                    value={stats?.totalReelViews?.toLocaleString("vi-VN") || "0"}
                    desc="Lượt xem video của bạn"
                />

                <StatCard
                    title="Doanh thu tháng này"
                    value={formatCurrency(stats?.monthlyRevenue)}
                    desc="Tổng doanh thu đã thanh toán (bao gồm Tip)"
                />

                <StatCard
                    title="Đánh giá trung bình"
                    value={stats?.avgRating ? Number(stats.avgRating).toFixed(1) : "0.0"}
                    desc="Điểm trung bình từ khách hàng"
                />
            </div>

            {/* Tabs */}
            <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Nội dung Tab */}
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

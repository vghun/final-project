import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import classNames from "classnames/bind";
import styles from "./ThongKe.module.scss";
import { StatisticsAPI } from "~/apis/statisticsAPI";
import { BranchAPI } from "~/apis/branchAPI";
import { RatingAPI } from "~/apis/ratingAPI";
import { SummaryAPI } from "~/apis/summaryAPI";

const cx = classNames.bind(styles);

// ================= Helper =================
const fullMonths = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

function getFullYearData(data, branches) {
  return fullMonths.map((m, index) => {
    const monthNumber = index + 1;
    const monthData = { month: m };
    branches.forEach((branch) => {
      const branchKey = branch.name.toLowerCase().replace(/\s+/g, "");
      const branchRevenueOfMonth = data.find(
        (d) => d.month === monthNumber && d.branchId === branch.idBranch
      );
      monthData[branchKey] = branchRevenueOfMonth?.totalRevenue || 0;
    });
    return monthData;
  });
}

function exportToExcel(data, fileName, sheetName = "Sheet1") {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

const branchColors = [
  "#6366F1",
  "#F43F5E",
  "#10B981",
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
];

// ================= Component =================
function ThongKe() {
  // === States ===
  const [branchList, setBranchList] = useState([]);
  const [branchLuong, setBranchLuong] = useState(null); // cho doanh thu thợ
  const [branchRating, setBranchRating] = useState(null); // cho đánh giá thợ
  const [filterLuong, setFilterLuong] = useState({ year: 2025, month: 9 });
  const [filterChiNhanh, setFilterChiNhanh] = useState({ year: 2025 });

  const [dataLuong, setDataLuong] = useState([]);
  const [dataChiNhanh, setDataChiNhanh] = useState([]);
  const [satisfactionData, setSatisfactionData] = useState([]);

  const [aiSummaries, setAiSummaries] = useState({
    barberRevenue: "Chọn bộ lọc để AI phân tích...",
    branchRevenue: "Chọn bộ lọc để AI phân tích...",
    ratings: "Chọn chi nhánh để AI phân tích...",
  });

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingLuong, setLoadingLuong] = useState(false);
  const [loadingChiNhanh, setLoadingChiNhanh] = useState(false);
  const [loadingSatisfaction, setLoadingSatisfaction] = useState(false);

  // === Fetch Branches ===
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await BranchAPI.getAll();
        setBranchList(res);
        if (res.length > 0) {
          setBranchLuong(res[0]);
          setBranchRating(res[0]);
        }
      } catch (err) {
        console.error("Lỗi load chi nhánh:", err);
      }
    };
    fetchBranches();
  }, []);

  // === Fetch AI Summary ===
  const fetchAiSummary = useCallback(async () => {
  if (!branchLuong || !branchRating) return;
  setLoadingSummary(true);
  setAiSummaries({
    barberRevenue: "AI đang phân tích...",
    branchRevenue: "AI đang phân tích...",
    ratings: "AI đang phân tích...",
  });

  try {
    const params = {
      branchIdLuong: branchLuong?.idBranch,
      branchIdRating: branchRating?.idBranch,
      yearLuong: filterLuong.year,
      monthLuong: filterLuong.month,
      yearChiNhanh: filterChiNhanh.year,
      charts: ["barberRevenue", "branchRevenue", "ratings"],
    };
    console.log("Params gửi lên AI Summary:", {
    branchIdLuong: branchLuong?.idBranch,
    branchIdRating: branchRating?.idBranch,
    yearLuong: filterLuong.year,
    monthLuong: filterLuong.month,
    yearChiNhanh: filterChiNhanh.year,
  });
    const res = await SummaryAPI.getSummary(params);
    setAiSummaries(res);
  } catch (err) {
    console.error("Lỗi load AI summary:", err);
    setAiSummaries({
      barberRevenue: "Lỗi khi phân tích. Vui lòng thử lại.",
      branchRevenue: "Lỗi khi phân tích. Vui lòng thử lại.",
      ratings: "Lỗi khi phân tích. Vui lòng thử lại.",
    });
  } finally {
    setLoadingSummary(false);
  }
}, [branchLuong, branchRating, filterLuong.year, filterLuong.month, filterChiNhanh.year]);


  // === Fetch Data ===
  const fetchBarberRevenue = useCallback(async () => {
    if (!branchLuong) return;
    setLoadingLuong(true);
    try {
      const res = await StatisticsAPI.getBarberRevenue({
        year: filterLuong.year,
        month: filterLuong.month,
        branchId: branchLuong.idBranch,
      });
      setDataLuong(res);
    } catch (err) {
      console.error("Lỗi load doanh thu thợ:", err);
      setDataLuong([]);
    } finally {
      setLoadingLuong(false);
    }
  }, [branchLuong, filterLuong]);

  const fetchBranchRevenue = useCallback(async () => {
    setLoadingChiNhanh(true);
    try {
      const res = await StatisticsAPI.getMonthlyBranchRevenue(filterChiNhanh.year);
      setDataChiNhanh(res);
    } catch (err) {
      console.error("Lỗi load doanh thu chi nhánh:", err);
      setDataChiNhanh([]);
    } finally {
      setLoadingChiNhanh(false);
    }
  }, [filterChiNhanh.year]);

  const fetchRatings = useCallback(async () => {
    if (!branchRating) return;
    setLoadingSatisfaction(true);
    try {
      const res = await RatingAPI.getByBranch(branchRating.idBranch);
      setSatisfactionData(
        res.map((b) => ({ name: b.user.fullName, score: b.ratingSummary?.avgRate || 0 }))
      );
    } catch (err) {
      console.error("Lỗi load đánh giá thợ:", err);
      setSatisfactionData([]);
    } finally {
      setLoadingSatisfaction(false);
    }
  }, [branchRating]);

  const handleFetchAllData = useCallback(() => {
    fetchBarberRevenue();
    fetchBranchRevenue();
    fetchRatings();
    fetchAiSummary();
  }, [fetchBarberRevenue, fetchBranchRevenue, fetchRatings, fetchAiSummary]);

  useEffect(() => {
    handleFetchAllData();
  }, [handleFetchAllData]);

  // === Render ===
  return (
    <div className={cx("thongke")}>
      {/* Doanh thu thợ */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Doanh thu theo thợ</h3>
        <div className={cx("filterBox")}>
          <select
            value={filterLuong.year}
            onChange={(e) =>
              setFilterLuong({ ...filterLuong, year: parseInt(e.target.value) })
            }
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
          <select
            value={filterLuong.month}
            onChange={(e) =>
              setFilterLuong({ ...filterLuong, month: parseInt(e.target.value) })
            }
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
          <select
            value={branchLuong?.idBranch || ""}
            onChange={(e) => {
              const selected = branchList.find(
                (b) => b.idBranch === parseInt(e.target.value)
              );
              if (selected) setBranchLuong(selected);
            }}
          >
            {branchList.map((b) => (
              <option key={b.idBranch} value={b.idBranch}>
                {b.name}
              </option>
            ))}
          </select>
          <button
            className={cx("update")}
            onClick={handleFetchAllData}
            disabled={loadingLuong || loadingSummary}
          >
            {loadingLuong || loadingSummary ? "Đang tải..." : "Xem & Phân tích"}
          </button>
          <button
            className={cx("excel")}
            onClick={() => exportToExcel(dataLuong, "DoanhThuTheoTho")}
            disabled={loadingLuong}
          >
            Xuất Excel
          </button>
        </div>
        <div className={cx("chartContent")}>
          <div className={cx("chartWrapper")}>
            <ResponsiveContainer
              width="100%"
              height={Math.max(400, dataLuong.length * 40)}
            >
              <BarChart
                data={dataLuong}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="barberName" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseSalary" stackId="a" fill="#3B82F6" name="Lương cố định" />
                <Bar dataKey="tips" stackId="a" fill="#10B981" name="Tiền tip" />
                <Bar dataKey="commission" stackId="a" fill="#F59E0B" name="Hoa hồng" />
                <Bar dataKey="bonus" stackId="a" fill="#EF4444" name="Thưởng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={cx("aiAnalysis")}>
            <h4>AI Phân tích</h4>
            <p className={cx({ "loading-text": loadingSummary })}>
              {aiSummaries.barberRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Doanh thu chi nhánh */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Doanh thu chi nhánh theo năm</h3>
        <div className={cx("filterBox")}>
          <select
            value={filterChiNhanh.year}
            onChange={(e) =>
              setFilterChiNhanh({ year: parseInt(e.target.value) })
            }
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
          <button
            className={cx("excel")}
            onClick={() =>
              exportToExcel(getFullYearData(dataChiNhanh, branchList), "DoanhThuChiNhanh")
            }
            disabled={loadingChiNhanh}
          >
            Xuất Excel
          </button>
        </div>
        <div className={cx("chartContent")}>
          <div className={cx("chartWrapper")}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={getFullYearData(dataChiNhanh, branchList)}
                margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {branchList.map((b, index) => {
                  const branchKey = b.name.toLowerCase().replace(/\s+/g, "");
                  return (
                    <Bar
                      key={b.idBranch}
                      dataKey={branchKey}
                      fill={branchColors[index % branchColors.length]}
                      name={b.name}
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={cx("aiAnalysis")}>
            <h4>AI Phân tích</h4>
            <p className={cx({ "loading-text": loadingSummary })}>
              {aiSummaries.branchRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Đánh giá thợ */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Đánh giá thợ từ khách hàng</h3>
        <div className={cx("filterBox")}>
          <select
            value={branchRating?.idBranch || ""}
            onChange={(e) => {
              const selected = branchList.find(
                (b) => b.idBranch === parseInt(e.target.value)
              );
              if (selected) setBranchRating(selected);
            }}
          >
            {branchList.map((b) => (
              <option key={b.idBranch} value={b.idBranch}>
                {b.name}
              </option>
            ))}
          </select>
          <button
            className={cx("excel")}
            onClick={() => exportToExcel(satisfactionData, `Hailong_${branchRating?.name}`)}
            disabled={loadingSatisfaction}
          >
            Xuất Excel
          </button>
        </div>
        <div className={cx("chartContent")}>
          <div className={cx("chartWrapper")}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={satisfactionData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#3B82F6" name="Điểm hài lòng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={cx("aiAnalysis")}>
            <h4>AI Phân tích</h4>
            <p className={cx({ "loading-text": loadingSummary })}>
              {aiSummaries.ratings}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThongKe;

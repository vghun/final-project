import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import classNames from "classnames/bind";
import styles from "./ThongKe.module.scss";
import { StatisticsAPI } from "~/apis/statisticsAPI";

const cx = classNames.bind(styles);

// ================== Helper ==================
const fullMonths = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

function getFullYearData(data) {
  // fullMonths là ['T1', 'T2', ...]
  return fullMonths.map((m, index) => {
    const monthNumber = index + 1; // 1..12
    const itemsOfMonth = data.filter((d) => d.month === monthNumber);

    return {
      month: m,
      quan1: itemsOfMonth.find((d) => d.branchId === 2)?.totalRevenue || 0,
      quan3: itemsOfMonth.find((d) => d.branchId === 3)?.totalRevenue || 0,
      thuduc: itemsOfMonth.find((d) => d.branchId === 1)?.totalRevenue || 0,
    };
  });
}


function exportToExcel(data, fileName, sheetName = "Sheet1") {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

// ================== Component ==================
// ================== Component ==================
function ThongKe() {
  // -------------------- State --------------------
  const [filterLuong, setFilterLuong] = useState({ year: 2025, month: "T1" });
  const [filterChiNhanh, setFilterChiNhanh] = useState({ year: 2025 });
  const [branch, setBranch] = useState("Quận 1");

  const [dataLuong, setDataLuong] = useState([]);
  const [dataChiNhanh, setDataChiNhanh] = useState([]);
  const [satisfactionData, setSatisfactionData] = useState([]);

  const [loadingLuong, setLoadingLuong] = useState(false);
  const [loadingChiNhanh, setLoadingChiNhanh] = useState(false);
  const [loadingSatisfaction, setLoadingSatisfaction] = useState(false);

  // -------------------- Fetch API --------------------
  const fetchBarberRevenue = async () => {
    setLoadingLuong(true);
    try {
      const res = await StatisticsAPI.getBarberRevenue({
        year: filterLuong.year,
        month: filterLuong.month,
        branchId: branch,
      });

      // Chuyển dữ liệu sang format chart
      const formattedData = res.map((item) => ({
        barberName: item.barberName,
        baseSalary: item.baseSalary,
        tips: item.tips,
        commission: item.commission,
        bonus: item.bonus,
        totalSalary: item.totalSalary,
      }));

      setDataLuong(formattedData);
    } catch (err) {
      console.error("Lỗi load doanh thu thợ:", err);
      setDataLuong([]);
    } finally {
      setLoadingLuong(false);
    }
  };

  const fetchBranchRevenue = async () => {
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
  };

  const fetchSatisfaction = async () => {
    setLoadingSatisfaction(true);
    try {
      const fakeData = {
        "Quận 1": [
          { name: "Anh A", score: 4.5 },
          { name: "Anh B", score: 4.7 },
        ],
        "Quận 3": [
          { name: "Chị C", score: 4.2 },
          { name: "Anh D", score: 4.6 },
        ],
        "Thủ Đức": [
          { name: "Anh E", score: 4.3 },
          { name: "Anh F", score: 4.8 },
        ],
      };
      setSatisfactionData(fakeData[branch] || []);
    } catch (err) {
      console.error("Lỗi load satisfaction:", err);
      setSatisfactionData([]);
    } finally {
      setLoadingSatisfaction(false);
    }
  };

  // -------------------- useEffect --------------------
  useEffect(() => {
    fetchBarberRevenue();
  }, [filterLuong, branch]);

  useEffect(() => {
    fetchBranchRevenue();
  }, [filterChiNhanh]);

  useEffect(() => {
    fetchSatisfaction();
  }, [branch]);

  // -------------------- AI summaries --------------------
  const aiSummaryLuong = "AI phân tích doanh thu thợ...";
  const aiSummaryChiNhanh = "AI phân tích doanh thu chi nhánh...";
  const aiSummarySatisfaction = "AI phân tích mức độ hài lòng...";

  // -------------------- Render --------------------
  return (
    <div className={cx("thongke")}>
      {/* ================== Doanh thu theo thợ ================== */}
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
              setFilterLuong({ ...filterLuong, month: e.target.value })
            }
          >
            {fullMonths.map((m) => (
              <option key={m} value={m}>
                Tháng {m.slice(1)}
              </option>
            ))}
          </select>
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="Quận 1">Quận 1</option>
            <option value="Quận 3">Quận 3</option>
            <option value="Thủ Đức">Thủ Đức</option>
          </select>
          <button className={cx("update")} onClick={fetchBarberRevenue} disabled={loadingLuong}>
            Xem
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
            <BarChart
              width={700}
              height={400}
              data={dataLuong}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="barberName" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="baseSalary" stackId="a" fill="#3B82F6" name="Lương cố định" />
              <Bar dataKey="tips" stackId="a" fill="#10B981" name="Tiền tip" />
              <Bar dataKey="commission" stackId="a" fill="#F59E0B" name="Hoa hồng" />
              <Bar dataKey="bonus" stackId="a" fill="#EF4444" name="Thưởng" />
            </BarChart>
          </div>
          <div className={cx("aiAnalysis")}>
            <h4>AI Phân tích</h4>
            <p>{aiSummaryLuong}</p>
          </div>
        </div>
      </div>

      {/* Phần Doanh thu chi nhánh và Hài lòng khách hàng giữ nguyên */}
    </div>
  );
}

export default ThongKe;

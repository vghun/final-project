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

const fullMonths = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

function getFullYearData(data) {
  return fullMonths.map((month) => {
    const item = data.find((d) => d.month === month);
    return item || { month, quan1: 0, quan3: 0, thuduc: 0 };
  });
}

function exportToExcel(data, fileName, sheetName = "Sheet1") {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

function ThongKe() {
  const [filterChiNhanh, setFilterChiNhanh] = useState({ year: 2025 });
  const [branch, setBranch] = useState("Quận 1");
  const [dataChiNhanh, setDataChiNhanh] = useState([]);
  const [loadingChiNhanh, setLoadingChiNhanh] = useState(false);

  // ================== Lấy dữ liệu từ API ==================
  const fetchBranchRevenue = async (year) => {
    setLoadingChiNhanh(true);
    try {
      const res = await StatisticsAPI.getMonthlyBranchRevenue(year);
      // res giả định về dạng [{ month: "T1", quan1: 30000000, quan3: 25000000, thuduc: 20000000 }, ...]
      setDataChiNhanh(res);
    } catch (error) {
      console.error("Lỗi load doanh thu chi nhánh:", error);
      setDataChiNhanh([]);
    } finally {
      setLoadingChiNhanh(false);
    }
  };

  useEffect(() => {
    fetchBranchRevenue(filterChiNhanh.year);
  }, [filterChiNhanh.year]);

  return (
    <div className={cx("thongke")}>
      {/* ================== Doanh thu chi nhánh ================== */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Doanh thu chi nhánh theo năm</h3>
        <div className={cx("filterBox")}>
          <select
            value={filterChiNhanh.year}
            onChange={(e) =>
              setFilterChiNhanh({ ...filterChiNhanh, year: e.target.value })
            }
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>

          <button
            className={cx("excel")}
            onClick={() =>
              exportToExcel(getFullYearData(dataChiNhanh), "DoanhThuChiNhanh")
            }
            disabled={loadingChiNhanh}
          >
            Xuất Excel
          </button>
        </div>

        <div className={cx("chartContent")}>
          <div className={cx("chartWrapper")}>
            <BarChart
              width={800}
              height={350}
              data={getFullYearData(dataChiNhanh)}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quan1" fill="#6366F1" name="Quận 1" />
              <Bar dataKey="quan3" fill="#F43F5E" name="Quận 3" />
              <Bar dataKey="thuduc" fill="#10B981" name="Thủ Đức" />
            </BarChart>
          </div>

          <div className={cx("aiAnalysis")}>
            <h4>AI Phân tích</h4>
            <p>AI phân tích doanh thu chi nhánh...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThongKe;

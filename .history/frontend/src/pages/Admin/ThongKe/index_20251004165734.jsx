import React, { useState } from "react";
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

const cx = classNames.bind(styles);

// ================== Fake Data ==================
// Doanh thu theo thợ
const dataLuong = [
  { name: "Anh A", baseSalary: 20000000, tips: 5000000, commission: 7000000 },
  { name: "Anh B", baseSalary: 22000000, tips: 6000000, commission: 8000000 },
  { name: "Chị C", baseSalary: 21000000, tips: 5500000, commission: 7500000 },
  { name: "Anh D", baseSalary: 25000000, tips: 7000000, commission: 9000000 },
];

// Doanh thu theo chi nhánh
const dataChiNhanh = [
  { month: "T1", quan1: 30000000, quan3: 25000000, thuduc: 20000000 },
  { month: "T2", quan1: 32000000, quan3: 27000000, thuduc: 21000000 },
  { month: "T3", quan1: 31000000, quan3: 26000000, thuduc: 22000000 },
  { month: "T4", quan1: 35000000, quan3: 28000000, thuduc: 23000000 },
];

// Mức độ hài lòng khách hàng
const satisfactionData = {
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

// ================== Export Excel ==================
function exportToExcel(data, fileName, sheetName = "Sheet1") {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

// ================== Helper ==================
const fullMonths = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

function getFullYearData(data) {
  return fullMonths.map((month) => {
    const item = data.find((d) => d.month === month);
    return item || { month, quan1: 0, quan3: 0, thuduc: 0 };
  });
}

// ================== Component ==================
function ThongKe() {
  const [filterLuong, setFilterLuong] = useState({ year: 2025, month: "T1" });
  const [filterChiNhanh, setFilterChiNhanh] = useState({ year: 2025 });
  const [branch, setBranch] = useState("Quận 1");

  // AI summaries (placeholder)
  const [aiSummaryLuong] = useState("AI phân tích doanh thu thợ...");
  const [aiSummaryChiNhanh] = useState("AI phân tích doanh thu chi nhánh...");
  const [aiSummarySatisfaction] = useState("AI phân tích mức độ hài lòng...");

  const satisfaction = satisfactionData[branch] || [];

  return (
    <div className={cx("thongke")}>

      {/* ================== Doanh thu theo thợ ================== */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Doanh thu theo thợ</h3>
        <div className={cx("filterBox")}>
          <select
            value={filterLuong.year}
            onChange={(e) =>
              setFilterLuong({ ...filterLuong, year: e.target.value })
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

          <button className={cx("update")} onClick={() => console.log(filterLuong, branch)}>Xem</button>
          <button className={cx("excel")} onClick={() => exportToExcel(dataLuong, "DoanhThuTheoTho")}>Xuất Excel</button>
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
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseSalary" stackId="a" fill="#3B82F6" name="Lương cố định" />
            <Bar dataKey="tips" stackId="a" fill="#10B981" name="Tiền tip" />
            <Bar dataKey="commission" stackId="a" fill="#F59E0B" name="Hoa hồng" />
            <Bar dataKey="bonus" stackId="a" fill="#EF4444" name="Thưởng" /> {/* thêm bonus */}
          </BarChart>
        </div>

          <div className={cx("aiAnalysis")}>
            <h4>AI Phân tích</h4>
            <p>{aiSummaryLuong}</p>
          </div>
        </div>
      </div>

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

          <button className={cx("excel")} onClick={() => exportToExcel(getFullYearData(dataChiNhanh), "DoanhThuChiNhanh")}>
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
            <p>{aiSummaryChiNhanh}</p>
          </div>
        </div>
      </div>

      {/* ================== Hài lòng khách hàng ================== */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Mức độ hài lòng khách hàng</h3>
        <div className={cx("filterBox")}>
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="Quận 1">Quận 1</option>
            <option value="Quận 3">Quận 3</option>
            <option value="Thủ Đức">Thủ Đức</option>
          </select>

          <button className={cx("excel")} onClick={() => exportToExcel(satisfaction, `Hailong_${branch}`)}>
            Xuất Excel
          </button>
        </div>

        <div className={cx("chartContent")}>
          <div className={cx("chartWrapper")}>
            <BarChart
              width={600}
              height={400}
              data={satisfaction}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#3B82F6" name="Điểm hài lòng" />
            </BarChart>
          </div>

          <div className={cx("aiAnalysis")}>
            <h4>AI Phân tích</h4>
            <p>{aiSummarySatisfaction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThongKe;

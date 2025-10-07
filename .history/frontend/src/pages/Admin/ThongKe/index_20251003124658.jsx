import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import * as XLSX from "xlsx";
import classNames from "classnames/bind";
import styles from "./ThongKe.module.scss";

const cx = classNames.bind(styles);

// Fake data doanh thu theo tháng (stacked bar chart)
const dataLuong = [
  { month: "T1", baseSalary: 20000000, tips: 5000000, commission: 7000000 },
  { month: "T2", baseSalary: 22000000, tips: 6000000, commission: 8000000 },
  { month: "T3", baseSalary: 21000000, tips: 5500000, commission: 7500000 },
  { month: "T4", baseSalary: 25000000, tips: 7000000, commission: 9000000 },
];

// Fake data doanh thu chi nhánh (grouped bar chart)
const dataChiNhanh = [
  { month: "T1", quan1: 30000000, quan3: 25000000, thuduc: 20000000 },
  { month: "T2", quan1: 32000000, quan3: 27000000, thuduc: 21000000 },
  { month: "T3", quan1: 31000000, quan3: 26000000, thuduc: 22000000 },
  { month: "T4", quan1: 35000000, quan3: 28000000, thuduc: 23000000 },
];

// Fake data mức độ hài lòng (radar chart)
const dataSatisfaction = [
  { criteria: "Kỹ năng", score: 4.5 },
  { criteria: "Thái độ", score: 4.7 },
  { criteria: "Đúng giờ", score: 4.2 },
  { criteria: "Tổng thể", score: 4.6 },
];

// Hàm export Excel
function exportToExcel(data, fileName) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

function ThongKe() {
  const [filter, setFilter] = useState({
    year: 2025,
    month: "T1",
    branch: "Tất cả",
  });

  return (
    <div className={cx("thongke")}>
      {/* Bộ lọc */}
      <div className={cx("filterBox")}>
        <select
          value={filter.year}
          onChange={(e) => setFilter({ ...filter, year: e.target.value })}
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
        <select
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: e.target.value })}
        >
          <option value="T1">T1</option>
          <option value="T2">T2</option>
          <option value="T3">T3</option>
          <option value="T4">T4</option>
        </select>
        <select
          value={filter.branch}
          onChange={(e) => setFilter({ ...filter, branch: e.target.value })}
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Quận 1">Quận 1</option>
          <option value="Quận 3">Quận 3</option>
          <option value="Thủ Đức">Thủ Đức</option>
        </select>
        <button onClick={() => exportToExcel(dataLuong, "DoanhThuThang")}>
          Xuất Excel
        </button>
      </div>

      {/* Biểu đồ cột ngang - doanh thu theo tháng */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Doanh thu hàng tháng (Chi tiết)</h3>
        <BarChart
          width={600}
          height={300}
          data={dataLuong}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="month" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="baseSalary" stackId="a" fill="#3B82F6" name="Lương cố định" />
          <Bar dataKey="tips" stackId="a" fill="#10B981" name="Tiền tip" />
          <Bar dataKey="commission" stackId="a" fill="#F59E0B" name="Hoa hồng" />
        </BarChart>
      </div>

      {/* Biểu đồ cột đứng - doanh thu theo chi nhánh */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Doanh thu chi nhánh theo tháng</h3>
        <BarChart
          width={700}
          height={300}
          data={dataChiNhanh}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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

      {/* Biểu đồ hài lòng khách hàng */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Mức độ hài lòng khách hàng</h3>
        <RadarChart
          cx={300}
          cy={200}
          outerRadius={120}
          width={600}
          height={400}
          data={dataSatisfaction}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="criteria" />
          <PolarRadiusAxis angle={30} domain={[0, 5]} />
          <Radar
            name="Hài lòng"
            dataKey="score"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </div>
    </div>
  );
}

export default ThongKe;

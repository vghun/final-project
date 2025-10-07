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
// Lương nhân viên theo tháng
// Doanh thu theo thợ (ví dụ tháng 1)
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
  // TODO: thêm từ T5 → T12
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

// ================== Component ==================
function ThongKe() {
  const [filterLuong, setFilterLuong] = useState({
    year: 2025,
    month: "T1",
  });

  const [filterChiNhanh, setFilterChiNhanh] = useState({
    year: 2025,
  });

  const [branch, setBranch] = useState("Quận 1");

  // Lấy data satisfaction theo chi nhánh
  const satisfaction = satisfactionData[branch] || [];

  return (
    <div className={cx("thongke")}>
      {/* ================== Doanh thu hàng tháng ================== */}
{/* ================== Doanh thu theo thợ ================== */}
<div className={cx("chartBox")}>
  <h3 className={cx("chartTitle")}>Doanh thu theo thợ</h3>
  <div className={cx("filterBox")}>
    {/* chọn năm / tháng / chi nhánh */}
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
      {Array.from({ length: 12 }, (_, i) => (
        <option key={i} value={`T${i + 1}`}>
          Tháng {i + 1}
        </option>
      ))}
    </select>

    <select
      value={branch}
      onChange={(e) => setBranch(e.target.value)}
    >
      <option value="Quận 1">Quận 1</option>
      <option value="Quận 3">Quận 3</option>
      <option value="Thủ Đức">Thủ Đức</option>
    </select>

    <button onClick={() => console.log("Load dữ liệu:", filterLuong, branch)}>
      Xem
    </button>

    <button
      onClick={() => exportToExcel(dataLuong, "DoanhThuTheoTho", "Luong")}
    >
      Xuất Excel
    </button>
  </div>

  <BarChart
    width={700}
    height={300}
    data={dataLuong}
    layout="vertical"
    margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" />
    <YAxis dataKey="name" type="category" />
    <Tooltip />
    <Legend />
    <Bar dataKey="baseSalary" stackId="a" fill="#3B82F6" name="Lương cố định" />
    <Bar dataKey="tips" stackId="a" fill="#10B981" name="Tiền tip" />
    <Bar dataKey="commission" stackId="a" fill="#F59E0B" name="Hoa hồng" />
  </BarChart>
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

          {/* Xuất Excel */}
          <button
            onClick={() =>
              exportToExcel(dataChiNhanh, "DoanhThuChiNhanh", "ChiNhanh")
            }
          >
            Xuất Excel
          </button>
        </div>

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

      {/* ================== Hài lòng khách hàng ================== */}
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Mức độ hài lòng khách hàng</h3>
        <div className={cx("filterBox")}>
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="Quận 1">Quận 1</option>
            <option value="Quận 3">Quận 3</option>
            <option value="Thủ Đức">Thủ Đức</option>
          </select>

          {/* Xuất Excel */}
          <button
            onClick={() =>
              exportToExcel(satisfaction, `Hailong_${branch}`, "Hailong")
            }
          >
            Xuất Excel
          </button>
        </div>

        <BarChart
          width={600}
          height={300}
          data={satisfaction}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#3B82F6" name="Điểm hài lòng" />
        </BarChart>
      </div>
    </div>
  );
}

export default ThongKe;

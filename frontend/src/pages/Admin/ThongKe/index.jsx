import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import classNames from "classnames/bind";
import styles from "./ThongKe.module.scss";

const cx = classNames.bind(styles);

const doanhThuThang = [
  { name: "T1", value: 90000000 },
  { name: "T2", value: 98000000 },
  { name: "T3", value: 102000000 },
  { name: "T4", value: 108000000 },
  { name: "T5", value: 115000000 },
  { name: "T6", value: 112000000 },
];

const doanhThuChiNhanh = [
  { name: "Quận 1", value: 39 },
  { name: "Quận 3", value: 33 },
  { name: "Thủ Đức", value: 28 },
];

function ThongKe() {
  return (
    <div className={cx("thongke")}>
      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Doanh thu theo tháng</h3>
        <LineChart
          width={500}
          height={300}
          data={doanhThuThang}
          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#059669"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </div>

      <div className={cx("chartBox")}>
        <h3 className={cx("chartTitle")}>Doanh thu theo chi nhánh</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={doanhThuChiNhanh}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {doanhThuChiNhanh.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={"#6366F1"} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}

export default ThongKe;

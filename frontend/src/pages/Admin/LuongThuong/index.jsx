import React from "react";
import classNames from "classnames/bind";
import styles from "./LuongThuong.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const salaries = [
  {
    id: 1,
    name: "Minh Tuấn",
    branch: "Chi nhánh Quận 1",
    revenue: "12.500.000đ",
    baseSalary: "5.000.000đ",
    commission: "8.750.000đ",
    total: "13.750.000đ",
    status: "Đã tính",
  },
  {
    id: 2,
    name: "Hoàng Nam",
    branch: "Chi nhánh Quận 1",
    revenue: "9.800.000đ",
    baseSalary: "5.000.000đ",
    commission: "6.860.000đ",
    total: "11.860.000đ",
    status: "Đã tính",
  },
  {
    id: 3,
    name: "Thanh Sơn",
    branch: "Chi nhánh Quận 3",
    revenue: "11.200.000đ",
    baseSalary: "5.000.000đ",
    commission: "7.840.000đ",
    total: "12.840.000đ",
    status: "Đã tính",
  },
];

function LuongThuong() {
  return (
    <div className={cx("salaryPage")}>
      <div className={cx("header")}>
        <h2>Tính lương tự động</h2>
        <button className={cx("calcBtn")}>
          <FontAwesomeIcon icon={faArrowTrendUp} /> Tính lương tháng này
        </button>
      </div>

      <div className={cx("salaryTable")}>
        <h3>Bảng lương tháng hiện tại</h3>
        <p className={cx("desc")}>
          Lương được tính dựa trên 70% doanh thu cá nhân
        </p>

        <table>
          <thead>
            <tr>
              <th>Thợ cắt tóc</th>
              <th>Chi nhánh</th>
              <th>Doanh thu</th>
              <th>Lương cơ bản</th>
              <th>Hoa hồng (70%)</th>
              <th>Tổng lương</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className={cx("employee")}>
                    <div className={cx("avatar")}>
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    {s.name}
                  </div>
                </td>
                <td>{s.branch}</td>
                <td>{s.revenue}</td>
                <td>{s.baseSalary}</td>
                <td>{s.commission}</td>
                <td className={cx("highlight")}>{s.total}</td>
                <td>
                  <span className={cx("status")}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LuongThuong;

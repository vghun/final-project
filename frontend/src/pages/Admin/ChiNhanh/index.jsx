import React from "react";
import classNames from "classnames/bind";
import styles from "./ChiNhanh.module.scss";
import BranchCard from "~/components/BranchCard";

const cx = classNames.bind(styles);

const branches = [
  {
    id: 1,
    name: "Chi nhánh Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    manager: "Nguyễn Văn A",
    staff: 8,
    revenue: "45.000.000đ",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Chi nhánh Quận 3",
    address: "456 Võ Văn Tần, Quận 3, TP.HCM",
    manager: "Trần Thị B",
    staff: 6,
    revenue: "38.000.000đ",
    status: "Hoạt động",
  },
  {
    id: 3,
    name: "Chi nhánh Thủ Đức",
    address: "789 Võ Văn Ngân, Thủ Đức, TP.HCM",
    manager: "Lê Văn C",
    staff: 5,
    revenue: "32.000.000đ",
    status: "Hoạt động",
  },
];

function ChiNhanh() {
  return (
    <div className={cx("branchList")}>
      <div className={cx("header")}>
        <h2>Quản lý chi nhánh</h2>
        <button className={cx("addBtn")}>+ Thêm chi nhánh</button>
      </div>

      <div className={cx("grid")}>
        {branches.map((branch) => (
          <BranchCard key={branch.id} {...branch} />
        ))}
      </div>
    </div>
  );
}

export default ChiNhanh;

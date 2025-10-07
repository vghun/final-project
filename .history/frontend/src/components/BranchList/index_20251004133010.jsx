import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import axios from "axios";
import styles from "./BranchList.module.scss";

const cx = classNames.bind(styles);

function BranchList() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách chi nhánh
    axios.get("/api/branches").then((res) => {
      setBranches(res.data);
    }).catch(err => {
      console.error("Lỗi tải chi nhánh:", err);
    });
  }, []);

  return (
    <div className={cx("branchList")}>
      <h3 className={cx("branchTitle")}>Danh sách chi nhánh</h3>
      <div className={cx("branchCards")}>
        {branches.map((b) => (
          <div key={b.id} className={cx("branchCard")}>
            <h4>{b.name}</h4>
            <p>{b.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BranchList;

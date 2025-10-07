import { useEffect, useState } from "react";
import styles from "./BranchList.Module.scss";

function BranchList() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        name: "Chi nhánh Nguyễn Trãi",
        address: "123 Nguyễn Trãi, Hà Nội",
        phone: "0123 456 789",
        employees: 12,
        avatar: "/branches/hanoi.jpg", // ảnh trong folder public
      },
      {
        id: 2,
        name: "Chi nhánh Lê Lợi",
        address: "456 Lê Lợi, TP.HCM",
        phone: "0987 654 321",
        employees: 9,
        avatar: "/branches/hcm.jpg",
      },
      {
        id: 3,
        name: "Chi nhánh Trần Phú",
        address: "789 Trần Phú, Đà Nẵng",
        phone: "0345 678 910",
        employees: 7,
        avatar: "/branches/danang.jpg",
      },
    ];
    setBranches(data);
  }, []);

  return (
    <div className={styles.branchList}>
      <h2 className={styles.title}>Danh sách chi nhánh</h2>
      <div className={styles.grid}>
        {branches.map((branch) => (
          <div key={branch.id} className={styles.branchItem}>
            <img
              src={branch.avatar}
              alt={branch.name}
              className={styles.avatar}
            />
            <h3 className={styles.branchName}>{branch.name}</h3>
            <p><strong>Địa chỉ:</strong> {branch.address}</p>
            <p><strong>Số điện thoại:</strong> {branch.phone}</p>
            <p><strong>Số lượng nhân viên:</strong> {branch.employees}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BranchList;

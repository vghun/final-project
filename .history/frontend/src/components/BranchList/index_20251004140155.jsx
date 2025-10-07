import { useEffect, useState } from "react";
import styles from "./BranchList.module.scss";

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
        avatar: "brand.jpg",
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
      <div className={styles.slider}>
        {branches.map((branch) => (
          <div key={branch.id} className={styles.card}>
            <img src="/branch.jpg" alt={branch.name} className={styles.avatar} />
            <div className={styles.info}>
              <h3>{branch.name}</h3>
              <div className={styles.details}>
                <p><strong>Địa chỉ:</strong> {branch.address}</p>
                <p><strong>Hotline:</strong> {branch.phone}</p>
                <p><strong>Nhân viên:</strong> {branch.employees}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BranchList;

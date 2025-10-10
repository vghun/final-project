import { useEffect, useState } from "react";
import styles from "./BranchList.module.scss";
<<<<<<< HEAD
import { BranchAPI } from "~/apis/branchAPI";

function BranchList() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await BranchAPI.getAll(); // trả về mảng branches
        setBranches(res || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách chi nhánh:", err);
        setError(err.message || "Không thể tải danh sách chi nhánh.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) return <p className={styles.loading}>Đang tải chi nhánh...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

=======

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

>>>>>>> origin/main
  return (
    <div className={styles.branchList}>
      <div className={styles.slider}>
        {branches.map((branch) => (
<<<<<<< HEAD
          <div key={branch.idBranch} className={styles.card}>
            <img
              src="/branch.jpg" // hoặc placeholder nếu ảnh chưa có
              alt={branch.name}
              className={styles.avatar}
            />
=======
          <div key={branch.id} className={styles.card}>
            <img src="/branch.jpg" alt={branch.name} className={styles.avatar} />
>>>>>>> origin/main
            <div className={styles.info}>
              <h3>{branch.name}</h3>
              <div className={styles.details}>
                <p><strong>Địa chỉ:</strong> {branch.address}</p>
<<<<<<< HEAD
                <p>
                  <strong>Giờ mở cửa:</strong> {branch.openTime} - {branch.closeTime}
                </p>
=======
                <p><strong>Hotline:</strong> {branch.phone}</p>
                <p><strong>Nhân viên:</strong> {branch.employees}</p>
>>>>>>> origin/main
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BranchList;

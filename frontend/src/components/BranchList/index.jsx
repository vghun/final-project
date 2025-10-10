import { useEffect, useState } from "react";
import styles from "./BranchList.module.scss";
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

  return (
    <div className={styles.branchList}>
      <div className={styles.slider}>
        {branches.map((branch) => (
          <div key={branch.idBranch} className={styles.card}>
            <img
              src="/branch.jpg" // hoặc placeholder nếu ảnh chưa có
              alt={branch.name}
              className={styles.avatar}
            />
            <div className={styles.info}>
              <h3>{branch.name}</h3>
              <div className={styles.details}>
                <p><strong>Địa chỉ:</strong> {branch.address}</p>
                <p>
                  <strong>Giờ mở cửa:</strong> {branch.openTime} - {branch.closeTime}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BranchList;

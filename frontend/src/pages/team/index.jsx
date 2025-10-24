import React, { useState, useEffect } from "react";
import styles from "./team.module.scss";
import { Search } from "lucide-react";
import BarberCard from "~/components/BarberCard";
import { BarberAPI } from "~/apis/barberAPI";

export default function BarberPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all / highRating
  const [branchFilter, setBranchFilter] = useState("all"); // chi nhánh
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const res = await BarberAPI.getBarberForHome();
        const list = Array.isArray(res.data) ? res.data : [];
        setBarbers(list);
      } catch (err) {
        console.error("Lỗi khi lấy thợ từ API:", err);
        setError("Không thể tải danh sách thợ");
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  // Filter barbers
  const filtered = barbers.filter((b) => {
    // Lọc theo rating
    if (filter === "highRating" && parseFloat(b.rating) < 4) return false;

    // Lọc theo chi nhánh
    if (branchFilter !== "all" && b.branch !== branchFilter) return false;

    // Lọc theo tìm kiếm
    if (!query) return true;
    return (
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.branch.toLowerCase().includes(query.toLowerCase())
    );
  });

  if (loading) return <div className={styles.main}>Đang tải…</div>;
  if (error) return <div className={styles.main}>{error}</div>;

  // Lấy danh sách chi nhánh duy nhất
  const branches = Array.from(new Set(barbers.map((b) => b.branch)));

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>BARBER <span>LAB</span></div>

        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            placeholder="Tìm thợ, chi nhánh..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <h4>Bộ lọc</h4>
          <button
            className={filter === "all" ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={filter === "highRating" ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter("highRating")}
          >
            Rating cao
          </button>

          <div className={styles.branchFilter}>
            <label>Chi nhánh:</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {branches.map((branch, idx) => (
                <option key={idx} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.quickInfo}>
          <h5>Hỗ trợ</h5>
          <p>
            Hotline: <strong>090-xxx-xxxx</strong>
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <header className={styles.headerMain}>
          <h1>Đội ngũ thợ</h1>
        </header>

        <section className={styles.listGrid}>
          {filtered.length === 0 ? (
            <p>Không tìm thấy thợ phù hợp</p>
          ) : (
            filtered.map((b, idx) => <BarberCard key={idx} barber={b} />)
          )}
        </section>
      </main>
    </div>
  );
}

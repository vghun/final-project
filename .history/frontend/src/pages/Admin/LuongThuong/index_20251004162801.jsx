import React, { useEffect, useState, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./LuongThuong.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SalaryAPI } from "~/apis/salaryAPI";

const cx = classNames.bind(styles);

function LuongThuong() {
  const [salaries, setSalaries] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Load bảng lương (memoized)
  const loadSalaries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SalaryAPI.getSalaries(month, year);
      console.log("Loaded salaries:", data);
      setSalaries(data);
    } catch (error) {
      console.error("Lỗi load bảng lương:", error);
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  // Tính lương
  const calculateSalary = async () => {
    setLoading(true);
    try {
      await SalaryAPI.calculateSalaries(month, year);
      alert(`Đã tính lương cho tháng ${month}/${year}`);
      loadSalaries(); // reload bảng lương
    } catch (error) {
      console.error("Lỗi khi tính lương:", error);
      alert("Tính lương thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Chạy khi month/year thay đổi
  useEffect(() => {
    loadSalaries();
  }, [loadSalaries]);

  // Kiểm tra có thể tính lương hay không
  const isPastMonth = () => {
    const now = new Date();
    return year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
  };
  const canCalculate = isPastMonth() && salaries.some((s) => s.status !== "Đã tính");

  // Filter theo search
  const filteredSalaries = salaries.filter(
    (s) =>
      s.barberName.toLowerCase().includes(search.toLowerCase()) ||
      (s.branchName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cx("salaryPage")}>
      {/* Header */}
      <div className={cx("header")}>
        <h2>Tính lương tự động</h2>

        {/* Controls */}
        <div className={cx("topControls")}>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={2023 + i}>
                {2023 + i}
              </option>
            ))}
          </select>

          <button className={cx("calcBtn")} onClick={loadSalaries} disabled={loading}>
            <FontAwesomeIcon icon={faArrowTrendUp} /> Xem doanh thu
          </button>

          <button
            className={cx("calcBtn")}
            onClick={calculateSalary}
            disabled={!canCalculate || loading}
            style={{
              background: canCalculate ? "#2563eb" : "#9ca3af",
              cursor: canCalculate ? "pointer" : "not-allowed",
            }}
          >
            Tính lương
          </button>
        </div>

        {/* Search */}
        <div className={cx("searchCenter")}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc chi nhánh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
      </div>

      {/* Salary Table */}
      <div className={cx("salaryTable")}>
        <h3>Bảng lương tháng {month}/{year}</h3>
        <p className={cx("desc")}>
          Lương = Lương cơ bản + Hoa hồng (15% doanh thu) + Tip + Thưởng
        </p>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Thợ cắt tóc</th>
                <th>Chi nhánh</th>
                <th>Doanh thu</th>
                <th>Lương cơ bản</th>
                <th>Hoa hồng (15%)</th>
                <th>Tip</th>
                <th>Thưởng</th>
                <th>Tổng lương</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.length > 0 ? (
               {filteredSalaries.map((s, idx) => {
                  return (
                    <tr key={idx}>
                      <td>
                        <div className={cx("employee")}>
                          <div className={cx("avatar")}>{s.barberName.charAt(0).toUpperCase()}</div>
                          {s.barberName}
                        </div>
                      </td>
                      <td>{s.branchName}</td>
                      <td>{Number(s.serviceRevenue || 0).toLocaleString()}đ</td>
                      <td>{Number(s.baseSalary || 0).toLocaleString()}đ</td>
                      <td>{Number(s.commission || 0).toLocaleString()}đ</td>
                      <td>{Number(s.tip || 0).toLocaleString()}đ</td>
                      <td>{Number(s.bonus || 0).toLocaleString()}đ</td>
                      <td className={cx("highlight")}>{Number(s.totalSalary || 0).toLocaleString()}đ</td>
                      <td>
                        <span className={cx("status", s.status === "Đã tính" ? "calculated" : "pending")}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LuongThuong;

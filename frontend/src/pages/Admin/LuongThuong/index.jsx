import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./LuongThuong.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SalaryAPI } from "~/apis/salaryAPI";

const cx = classNames.bind(styles);

function LuongThuong() {
  const [salaries, setSalaries] = useState([]);
  const [overview, setOverview] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------- Lấy dữ liệu bảng lương + overview -----------------
const fetchData = async (m, y) => {
  setLoading(true);
  try {
    const overviewData = await SalaryAPI.getSalaryOverview({
      month: m,
      year: y,
    });

    setOverview(overviewData);

    const monthData = overviewData.find(
      item => item.month === m && item.year === y
    );

    setSalaries(monthData?.salaries || []);
  } catch (error) {
    console.error("Lỗi load dữ liệu:", error);
    setSalaries([]);
    setOverview([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData(month, year);
  }, [month, year]);

  // ----------------- Tính lương -----------------
  const calculateSalary = async () => {
  setLoading(true);
  try {
    const result = await SalaryAPI.calculateSalaries(month, year);
    alert(result.message);

    const overviewData = await SalaryAPI.getSalaryOverview({
      month,
      year,
    });

    setOverview(overviewData);

    const monthData = overviewData.find(
      item => item.month === month && item.year === year
    );

    setSalaries(monthData?.salaries || []);
  } catch (err) {
    console.error(err);
    alert("Tính lương thất bại!");
  } finally {
    setLoading(false);
  }
};

  // ----------------- Kiểm tra nút Tính lương -----------------
  const now = new Date();
  const monthOverview = overview.find(item => item.month === month && item.year === year);

  let canClick = false;
  if (monthOverview) {
    if (!monthOverview.isCurrentMonth && monthOverview.canCalculate) {
      canClick = true; // Tháng trước chưa tính → bật nút
    }
  }

  // ----------------- Filter bảng lương theo search -----------------
  const filteredSalaries = salaries.filter(s =>
    (s.barberName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.branchName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cx("salaryPage")}>
      <div className={cx("header")}>
        <h2>Tính lương tự động</h2>

        <div className={cx("topControls")}>
          <select value={month} onChange={e => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
            ))}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))}>
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={2023 + i}>{2023 + i}</option>
            ))}
          </select>

          <button className={cx("calcBtn")} onClick={() => fetchData(month, year)} disabled={loading}>
            <FontAwesomeIcon icon={faArrowTrendUp} /> Xem doanh thu
          </button>

          <button
            className={cx("calcBtn")}
            onClick={calculateSalary}
            disabled={!canClick || loading}
            style={{
              background: canClick ? "#2563eb" : "#9ca3af",
              cursor: canClick ? "pointer" : "not-allowed",
            }}
          >
            Tính lương
          </button>
        </div>

        <div className={cx("searchCenter")}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc chi nhánh..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
      </div>

      <div className={cx("salaryTable")}>
        <h3>Bảng lương tháng {month}/{year}</h3>
        <p className={cx("desc")}>
          Lương = Lương cơ bản + Hoa hồng (15% doanh thu) + Tip + Thưởng
        </p>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <div className={cx("tableWrapper")}>
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
                {filteredSalaries.length > 0 ? filteredSalaries.map((s, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className={cx("employee")}>
                        <div className={cx("avatar")}>{(s.barberName || "").charAt(0).toUpperCase()}</div>
                        {s.barberName}
                      </div>
                    </td>
                    <td>{s.branchName}</td>
                    <td>{Number(s.serviceRevenue).toLocaleString()}đ</td>
                    <td>{Number(s.baseSalary).toLocaleString()}đ</td>
                    <td>{Number(s.commission).toLocaleString()}đ</td>
                    <td>{Number(s.tip).toLocaleString()}đ</td>
                    <td>{Number(s.bonus).toLocaleString()}đ</td>
                    <td className={cx("highlight")}>{Number(s.totalSalary).toLocaleString()}đ</td>
                    <td>
                      <span className={cx("status", s.status === "Đã tính" ? "calculated" : "pending")}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LuongThuong;

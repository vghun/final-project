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

  // Lấy dữ liệu bảng lương + overview
  const fetchData = async (m, y) => {
    setLoading(true);
    try {
      const overviewData = await SalaryAPI.getSalaryOverview();
      setOverview(overviewData);

      const salaryData = await SalaryAPI.getSalaries(m, y);

      // Gán status từ overview
      const monthData = overviewData.find(item => item.month === m && item.year === y);
      const statusMap = new Map();
      monthData?.salaries?.forEach(s => statusMap.set(s.idBarber, s.status));

      const dataWithStatus = salaryData.map(s => ({
        ...s,
        status: statusMap.get(s.idBarber) === "Đã tính" ? "Đã tính" : "Chưa tính"
      }));

      setSalaries(dataWithStatus);
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

  // Tính lương: update trực tiếp trạng thái cột
  const calculateSalary = async () => {
    setLoading(true);
    try {
      await SalaryAPI.calculateSalaries(month, year);
      alert(`Đã tính lương cho tháng ${month}/${year}`);

      // Cập nhật trực tiếp trạng thái từng thợ
      setSalaries(prev => prev.map(s => ({ ...s, status: "Đã tính" })));

      // Cập nhật overview để nút không bấm được nữa
      setOverview(prev => {
        const newOverview = [...prev];
        const idx = newOverview.findIndex(o => o.month === month && o.year === year);
        if (idx >= 0) newOverview[idx].canCalculate = false;
        return newOverview;
      });

    } catch (error) {
      console.error("Lỗi khi tính lương:", error);
      alert("Tính lương thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra nút Tính lương: disable nếu tháng tương lai hoặc đã tính
  const now = new Date();
  const isFutureMonth = year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1);
  const monthOverview = overview.find(item => item.month === month && item.year === year);
  const canClick = !(isFutureMonth || (monthOverview && monthOverview.canCalculate === false));

  // Filter bảng lương theo search
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

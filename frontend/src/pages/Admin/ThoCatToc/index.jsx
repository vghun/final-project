import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ThoCatToc.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPenToSquare,
  faTrash,
  faPlus,
  faLock,
  faLockOpen,
  faMapMarkerAlt,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { BarberAPI } from "~/apis/barberAPI";
import { BranchAPI } from "~/apis/branchAPI";

const cx = classNames.bind(styles);

function ThoCatToc() {
  const [barbers, setBarbers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showChangeBranch, setShowChangeBranch] = useState(false);

  const [formData, setFormData] = useState({
    idUser: "",
    idBranch: "",
    profileDescription: "",
  });

  const [selectedBarber, setSelectedBarber] = useState(null);
  const [newBranchId, setNewBranchId] = useState("");

  // 🔹 Lấy danh sách
  const fetchBarbers = async () => {
    try {
      const data = await BarberAPI.getAll();
      setBarbers(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách barber:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const data = await BranchAPI.getAll();
      setBranches(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách chi nhánh:", error);
    }
  };

  useEffect(() => {
    fetchBarbers();
    fetchBranches();
  }, []);

  // 🔹 Khóa / mở khóa
  const handleToggleLock = async (barber) => {
    try {
      if (barber.isLocked) {
        await BarberAPI.unlock(barber.idBarber);
        alert(`🔓 Đã mở khóa thợ: ${barber.fullName}`);
      } else {
        await BarberAPI.lock(barber.idBarber);
        alert(`🔒 Đã khóa thợ: ${barber.fullName}`);
      }
      await fetchBarbers();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái khóa:", error);
      alert("❌ Lỗi khi thay đổi trạng thái thợ!");
    }
  };

  // 🔹 Mở modal thêm thợ
  const openAddModal = () => {
    setFormData({ idUser: "", idBranch: "", profileDescription: "" });
    setShowModal(true);
  };

  // 🔹 Xử lý nhập form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Thêm thợ mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await BarberAPI.assignUser(formData);
      alert("✅ Thêm thợ thành công!");
      setShowModal(false);
      await fetchBarbers();
    } catch (error) {
      console.error("Lỗi khi thêm thợ:", error);
      alert("❌ Không thể thêm thợ!");
    }
  };

  // 🔹 Đổi chi nhánh
  const openChangeBranchModal = (barber) => {
    setSelectedBarber(barber);
    setNewBranchId("");
    setShowChangeBranch(true);
  };

  const handleChangeBranch = async (e) => {
    e.preventDefault();
    if (!selectedBarber || !newBranchId) {
      alert("⚠️ Vui lòng chọn chi nhánh mới!");
      return;
    }
    try {
      await BarberAPI.assignBranch({
        idBarber: selectedBarber.idBarber,
        idBranch: newBranchId,
      });
      alert(`✅ Đã chuyển ${selectedBarber.fullName} sang chi nhánh mới!`);
      setShowChangeBranch(false);
      await fetchBarbers();
    } catch (error) {
      console.error("Lỗi khi đổi chi nhánh:", error);
      alert("❌ Không thể đổi chi nhánh!");
    }
  };

  if (loading)
    return <div className={cx("loading")}>Đang tải danh sách thợ...</div>;

  return (
    <div className={cx("barberList")}>
      <div className={cx("header")}>
        <h2>Quản lý thợ cắt tóc</h2>
        <button className={cx("addBtn")} onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Thêm thợ cắt tóc
        </button>
      </div>

      {barbers.length === 0 ? (
        <p className={cx("noData")}>Không có dữ liệu thợ cắt tóc.</p>
      ) : (
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>Thợ cắt tóc</th>
              <th>Chi nhánh</th>
              <th>Kinh nghiệm</th>
              <th>Đánh giá</th>
              <th>Khách hàng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {barbers.map((b) => (
              <tr key={b.idBarber}>
                <td>
                  <div className={cx("barberCell")}>
                    <span className={cx("avatar")}>
                      {b.fullName?.charAt(0) || "?"}
                    </span>
                    <span>{b.fullName || "Chưa có tên"}</span>
                  </div>
                </td>

                <td className={cx("branchCell")}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className={cx("branchIcon")}
                  />
                  {b.branchName || "Chưa có"}
                  <button
                    className={cx("editBranchBtn")}
                    onClick={() => openChangeBranchModal(b)}
                    title="Đổi chi nhánh làm việc"
                  >
                    <FontAwesomeIcon icon={faExchangeAlt} />
                  </button>
                </td>

                <td>{b.exp || "—"}</td>
                <td className={cx("rating")}>
                  <FontAwesomeIcon icon={faStar} className={cx("star")} />{" "}
                  {b.rating || "0.0"}
                </td>
                <td>{b.customers || 0}</td>

                <td>
                  <div className={cx("statusCell")}>
                    <span
                      className={cx("status", {
                        locked: b.isLocked,
                        active: !b.isLocked,
                      })}
                    >
                      {b.isLocked ? "Khóa" : "Hoạt động"}
                    </span>
                    <button
                      className={cx("lockBtn")}
                      onClick={() => handleToggleLock(b)}
                      title={b.isLocked ? "Mở khóa thợ" : "Khóa thợ"}
                    >
                      <FontAwesomeIcon
                        icon={b.isLocked ? faLockOpen : faLock}
                      />
                    </button>
                  </div>
                </td>

                <td>
                  <div className={cx("actions")}>
                    <button className={cx("editBtn")}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className={cx("deleteBtn")}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =============== MODAL THÊM THỢ =============== */}
      {showModal && (
        <div className={cx("modalOverlay")}>
          <div className={cx("modal")}>
            <h3>Thêm thợ cắt tóc mới</h3>
            <form onSubmit={handleSubmit}>
              <label>ID người dùng (User ID)</label>
              <input
                type="number"
                name="idUser"
                value={formData.idUser}
                onChange={handleChange}
                required
                placeholder="Nhập ID user cần gán"
              />

              <label>Chi nhánh làm việc</label>
              <select
                name="idBranch"
                value={formData.idBranch}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map((br) => (
                  <option key={br.idBranch} value={br.idBranch}>
                    {br.name}
                  </option>
                ))}
              </select>

              <label>Mô tả hồ sơ (Profile Description)</label>
              <textarea
                name="profileDescription"
                value={formData.profileDescription}
                onChange={handleChange}
                rows="3"
                placeholder="VD: 5 năm kinh nghiệm cắt tóc nam, chuyên fade..."
              />

              <div className={cx("modalActions")}>
                <button type="submit" className={cx("saveBtn")}>
                  Thêm thợ
                </button>
                <button
                  type="button"
                  className={cx("cancelBtn")}
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============== MODAL ĐỔI CHI NHÁNH =============== */}
      {showChangeBranch && (
        <div className={cx("modalOverlay")}>
          <div className={cx("modal")}>
            <h3>Đổi chi nhánh cho {selectedBarber?.fullName}</h3>
            <form onSubmit={handleChangeBranch}>
              <label>Chọn chi nhánh mới</label>
              <select
                value={newBranchId}
                onChange={(e) => setNewBranchId(e.target.value)}
                required
              >
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map((br) => (
                  <option key={br.idBranch} value={br.idBranch}>
                    {br.name}
                  </option>
                ))}
              </select>

              <div className={cx("modalActions")}>
                <button type="submit" className={cx("saveBtn")}>
                  Cập nhật
                </button>
                <button
                  type="button"
                  className={cx("cancelBtn")}
                  onClick={() => setShowChangeBranch(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThoCatToc;

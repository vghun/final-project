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
  const [showEditModal, setShowEditModal] = useState(false);
  const [unavailabilities, setUnavailabilities] = useState({});
  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    idBranch: "",
    profileDescription: "",
  });

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveData, setLeaveData] = useState({
    idBarber: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const openLeaveModal = (barber) => {
    setLeaveData({
      idBarber: barber.idBarber,
      startDate: "",
      endDate: "",
      reason: "",
    });
    setShowLeaveModal(true);
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      await BarberAPI.addUnavailability(leaveData);
      alert("✅ Đã thêm lịch nghỉ phép cho thợ!");
      setShowLeaveModal(false);
    } catch (error) {
      console.error("Lỗi khi thêm nghỉ phép:", error);
      alert(error?.response?.data?.message || "❌ Không thể thêm lịch nghỉ!");
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
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
      await fetchBarberUnavailabilities(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách barber:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarberUnavailabilities = async (barbersList) => {
    try {
      const dataMap = {};
      for (const barber of barbersList) {
        const res = await BarberAPI.getUnavailabilitiesByBarber(
          barber.idBarber
        );
        dataMap[barber.idBarber] = res?.unavailabilities || [];
      }
      setUnavailabilities(dataMap);
    } catch (error) {
      console.error("Lỗi khi tải lịch nghỉ:", error);
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
    setFormData({
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      idBranch: "",
      profileDescription: "",
    });
    setShowModal(true);
  };

  const openEditModal = async (barber) => {
    setSelectedBarber(barber);
    try {
      // 🔹 Gọi API lấy thông tin chi tiết thợ
      const detail = await BarberAPI.getProfile(barber.idBarber);

      setEditData({
        fullName: detail.fullName || "",
        phoneNumber: detail.phoneNumber || "",
        email: detail.email || "",
        password: "",
        idBranch: detail.idBranch || "",
        profileDescription: detail.profileDescription?.trim() || "",
      });

      setShowEditModal(true);
    } catch (error) {
      console.error("❌ Lỗi khi tải chi tiết thợ:", error);
      alert("Không thể tải thông tin thợ để chỉnh sửa!");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await BarberAPI.updateBarber(selectedBarber.idBarber, editData);
      alert("✅ Cập nhật thông tin thợ thành công!");
      setShowEditModal(false);
      await fetchBarbers();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert(error?.response?.data?.message || "❌ Không thể cập nhật thợ!");
    }
  };
  const handleDelete = async (barber) => {
    if (!window.confirm(`⚠️ Xác nhận xóa thợ ${barber.fullName}?`)) return;
    try {
      await BarberAPI.deleteBarber(barber.idBarber);
      alert("🗑️ Đã xóa thợ thành công!");
      await fetchBarbers();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert(error?.response?.data?.message || "❌ Không thể xóa thợ!");
    }
  };

  // 🔹 Xử lý nhập form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Thêm thợ mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await BarberAPI.createBarber(formData);
      alert("✅ Tạo thợ cắt tóc thành công!");
      setShowModal(false);
      await fetchBarbers();
    } catch (error) {
      console.error("Lỗi khi tạo thợ:", error);
      alert(error?.response?.data?.message || "❌ Không thể tạo thợ mới!");
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

  const getLeaveText = (idBarber) => {
    const leaves = unavailabilities[idBarber];
    if (!leaves || leaves.length === 0) return "Không có";
    return leaves
      .map((l) => `${l.startDate} → ${l.endDate} (${l.reason})`)
      .join(";\n"); // thêm xuống dòng
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
              <th>Ngày nghỉ phép</th>
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
                <td style={{ whiteSpace: "pre-line" }}>
                  {getLeaveText(b.idBarber)}
                </td>

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
                    <button
                      className={cx("editBtn")}
                      onClick={() => openEditModal(b)}
                      title="Sửa thông tin thợ"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      className={cx("deleteBtn")}
                      onClick={() => handleDelete(b)}
                      title="Xóa thợ"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className={cx("leaveBtn")}
                      onClick={() => openLeaveModal(b)}
                      title="Thêm lịch nghỉ phép"
                    >
                      📅
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
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Nhập email thợ"
              />

              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu"
              />

              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên"
              />

              <label>Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Nhập số điện thoại"
              />

              <label>Chi nhánh làm việc (tùy chọn)</label>
              <select
                name="idBranch"
                value={formData.idBranch}
                onChange={handleChange}
              >
                <option value="">-- Không chọn --</option>
                {branches.map((br) => (
                  <option key={br.idBranch} value={br.idBranch}>
                    {br.name}
                  </option>
                ))}
              </select>

              <label>Mô tả hồ sơ</label>
              <textarea
                name="profileDescription"
                value={formData.profileDescription}
                onChange={handleChange}
                rows="3"
                placeholder="VD: 5 năm kinh nghiệm, chuyên fade, uốn tóc..."
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
      {/* =============== MODAL SỬA THÔNG TIN THỢ =============== */}
      {showEditModal && (
        <div className={cx("modalOverlay")}>
          <div className={cx("modal")}>
            <h3>Cập nhật thông tin thợ</h3>
            <form onSubmit={handleEditSubmit}>
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={editData.fullName}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                required
              />

              <label>Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                value={editData.phoneNumber}
                onChange={(e) =>
                  setEditData({ ...editData, phoneNumber: e.target.value })
                }
                required
              />

              <label>Mật khẩu (để trống nếu không đổi)</label>
              <input
                type="password"
                name="password"
                value={editData.password}
                onChange={(e) =>
                  setEditData({ ...editData, password: e.target.value })
                }
                placeholder="Nhập mật khẩu mới nếu muốn"
              />

              <label>Chi nhánh</label>
              <select
                name="idBranch"
                value={editData.idBranch}
                onChange={(e) =>
                  setEditData({ ...editData, idBranch: e.target.value })
                }
              >
                <option value="">-- Không chọn --</option>
                {branches.map((br) => (
                  <option key={br.idBranch} value={br.idBranch}>
                    {br.name}
                  </option>
                ))}
              </select>

              <label>Mô tả hồ sơ</label>
              <textarea
                name="profileDescription"
                value={editData.profileDescription}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    profileDescription: e.target.value,
                  })
                }
                rows="3"
              />

              <div className={cx("modalActions")}>
                <button type="submit" className={cx("saveBtn")}>
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  className={cx("cancelBtn")}
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showLeaveModal && (
        <div className={cx("modalOverlay")}>
          <div className={cx("modal")}>
            <h3>Thêm lịch nghỉ phép cho thợ</h3>
            <form onSubmit={handleLeaveSubmit}>
              <label>Từ ngày</label>
              <input
                type="date"
                name="startDate"
                value={leaveData.startDate}
                onChange={(e) =>
                  setLeaveData({ ...leaveData, startDate: e.target.value })
                }
                required
              />

              <label>Đến ngày</label>
              <input
                type="date"
                name="endDate"
                value={leaveData.endDate}
                onChange={(e) =>
                  setLeaveData({ ...leaveData, endDate: e.target.value })
                }
                required
              />

              <label>Lý do</label>
              <textarea
                name="reason"
                value={leaveData.reason}
                onChange={(e) =>
                  setLeaveData({ ...leaveData, reason: e.target.value })
                }
                rows="3"
                placeholder="VD: Nghỉ ốm, đi công việc riêng..."
                required
              />

              <div className={cx("modalActions")}>
                <button type="submit" className={cx("saveBtn")}>
                  Lưu nghỉ phép
                </button>
                <button
                  type="button"
                  className={cx("cancelBtn")}
                  onClick={() => setShowLeaveModal(false)}
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

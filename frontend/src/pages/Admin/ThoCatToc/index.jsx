import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ThoCatToc.module.scss";
import Toast from "~/components/Toast";
import { faLock ,faLockOpen } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPenToSquare,
  faTrash,
  faPlus,
  faMapMarkerAlt,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { BarberAPI } from "~/apis/barberAPI";
import { BranchAPI } from "~/apis/branchAPI";

const cx = classNames.bind(styles);

function ThoCatToc() {
  const [toastList, setToastList] = useState([]);

  const showToast = (type, text, duration = 3000) => {
    const id = Date.now();
    setToastList((prev) => [...prev, { id, type, text, duration }]);
  };

  const [barbers, setBarbers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showChangeBranch, setShowChangeBranch] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    idBranch: "",
    profileDescription: "",
  });
// 🔹 Khóa tài khoản thợ
// 🔹 Khóa/Mở khóa tài khoản thợ
const handleToggleAccount = async (barber) => {
  const isLocked = barber.status === "locked" || barber.status === "LOCKED";
  const action = isLocked ? "mở" : "khóa";

  if (!window.confirm(`Xác nhận ${action} tài khoản của ${barber.fullName}?`)) return;

  try {
    if (isLocked) {
      await BarberAPI.unlock(barber.idBarber);
      showToast("success", "Tài khoản đã được mở khóa!");
    } else {
      await BarberAPI.lock(barber.idBarber);
      showToast("success", "Tài khoản đã bị khóa!");
    }

    // Cập nhật trạng thái ngay trong state
    setBarbers((prev) =>
      prev.map((b) =>
        b.idBarber === barber.idBarber
          ? { ...b, status: isLocked ? "active" : "locked" }
          : b
      )
    );
  } catch (error) {
    showToast(
      "error",
      error?.response?.data?.message || `Không thể ${action} tài khoản!`
    );
  }
};



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

  // 🔹 Modal thêm thợ
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await BarberAPI.createBarber(formData);
      showToast("success", "Tạo tài khoản cho thợ cắt tóc thành công!");
      setShowModal(false);
      await fetchBarbers();
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Không thể tạo thợ mới!");
    }
  };

  // 🔹 Modal sửa thợ
  const openEditModal = async (barber) => {
    setSelectedBarber(barber);
    try {
      const detail = await BarberAPI.getProfile(barber.idBarber);
      setEditData({
        fullName: detail.fullName || "",
        phoneNumber: detail.phoneNumber || "",
        email: detail.email || "",
        idBranch: detail.idBranch || "",
        profileDescription: detail.profileDescription?.trim() || "",
      });
      setShowEditModal(true);
    } catch (error) {
      showToast("error", "Không thể tải thông tin thợ để chỉnh sửa!");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await BarberAPI.updateBarber(selectedBarber.idBarber, editData);
      showToast("success", "Cập nhật thông tin thợ thành công!");
      setShowEditModal(false);
      await fetchBarbers();
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Không thể cập nhật thợ!");
    }
  };

  // 🔹 Đổi chi nhánh
  const openChangeBranchModal = (barber) => {
    setSelectedBarber(barber);
    setNewBranchId(barber.idBranch || "");
    setShowChangeBranch(true);
  };
const handleChangeBranch = async (e) => {
  e.preventDefault();
  if (!selectedBarber || !newBranchId) {
    showToast("error", "Vui lòng chọn chi nhánh mới!");
    return;
  }
  try {
    const res = await BarberAPI.assignBranch({
      idBarber: selectedBarber.idBarber,
      idBranch: newBranchId,
    });

    // Kiểm tra thật kỹ success
    if (res.success) {
      showToast("success", res.message);
      setShowChangeBranch(false);
      await fetchBarbers();
    } else {
      showToast("error", res.message);
    }
  } catch (error) {
    showToast(
      "error",
      error?.message || "Không thể đổi chi nhánh!"
    );
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
              <th>Đánh giá</th>
              <th>Tổng số khách hàng phục vụ</th>
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

                <td className={cx("rating")}>
                  <FontAwesomeIcon icon={faStar} className={cx("star")} />{" "}
                  {b.rating || "0.0"}
                </td>
                <td>{b.customers || 0}</td>

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
  className={cx(b.status === "locked" ? "unlockBtn" : "lockBtn")}
  onClick={() => handleToggleAccount(b)}
  title={b.status === "locked" ? "Mở tài khoản" : "Khóa tài khoản"}
>
<FontAwesomeIcon icon={b.status === "locked" ? faLockOpen : faLock} />

</button>


  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= MODAL THÊM THỢ ================= */}
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

      {/* ================= MODAL ĐỔI CHI NHÁNH ================= */}
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

      {/* ================= MODAL SỬA THÔNG TIN THỢ ================= */}
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

      {/* Toasts */}
      <div className={cx("toastContainer")}>
        {toastList.map((t) => (
          <Toast
            key={t.id}
            type={t.type}
            text={t.text}
            duration={t.duration}
            onClose={() =>
              setToastList((prev) => prev.filter((toast) => toast.id !== t.id))
            }
          />
        ))}
      </div>
    </div>
  );
}

export default ThoCatToc;

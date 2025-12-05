import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChiNhanh.module.scss";
import BranchCard from "~/components/BranchCard";
import Toast from "~/components/Toast"; // ✅ import Toast
import { BranchAPI } from "~/apis/branchAPI";

const cx = classNames.bind(styles);

function ChiNhanh() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    openTime: "08:00",
    closeTime: "20:00",
    slotDuration: 30,
    managerId: "",
  });

  const [toast, setToast] = useState(null); // ✅ state Toast toàn cục

  // ======================= LẤY DANH SÁCH CHI NHÁNH =======================
  const fetchBranches = async () => {
    try {
      const data = await BranchAPI.getAll();
      const mapped = data.map((b) => ({
        id: b.idBranch,
        name: b.name,
        address: b.address,
        openTime: b.openTime,
        closeTime: b.closeTime,
        slotDuration: b.slotDuration,
        managerId: b.managerId,
        manager: b.manager?.fullName || "Chưa có quản lý",
        staff: b.totalBarbers || 0,
        revenue: b.revenue || "Đang cập nhật",
        status: b.status === "Active" ? "Hoạt động" : "Tạm ngưng",
      }));
      setBranches(mapped);
    } catch (error) {
      console.error("Lỗi khi tải chi nhánh:", error);
      setToast({ type: "error", text: "❌ Lỗi khi tải chi nhánh", duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const openCreateForm = () => {
    setEditingBranch(null);
    setFormData({
      name: "",
      address: "",
      openTime: "08:00",
      closeTime: "20:00",
      slotDuration: 30,
      managerId: "",
    });
    setShowForm(true);
  };

  const openEditForm = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      openTime: branch.openTime || "08:00",
      closeTime: branch.closeTime || "20:00",
      slotDuration: branch.slotDuration || 30,
      managerId: branch.managerId || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await BranchAPI.update(editingBranch.id, formData);
        setToast({ type: "success", text: "Cập nhật chi nhánh thành công!", duration: 2000 });
      } else {
        await BranchAPI.create(formData);
        setToast({ type: "success", text: " Thêm chi nhánh thành công!", duration: 2000 });
      }
      setShowForm(false);
      await fetchBranches();
    } catch (error) {
      console.error("Branch create/update error:", error);
      setToast({ type: "error", text: "Lỗi khi lưu chi nhánh!", duration: 2000 });
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const result = await BranchAPI.toggleStatus(id);
      setToast({
        type: "success",
        text: `Trạng thái chi nhánh đã đổi sang: ${
          result.status === "Active" ? "Hoạt động" : "Tạm ngưng"
        }`,
        duration: 2000,
      });
      await fetchBranches();
    } catch (error) {
      console.error("Toggle status error:", error);
      setToast({ type: "error", text: "Lỗi khi cập nhật trạng thái chi nhánh!", duration: 2000 });
    }
  };

  if (loading) return <div className={cx("loading")}>Đang tải dữ liệu...</div>;

  return (
    <div className={cx("branchList")}>
      <div className={cx("header")}>
        <h2>Quản lý chi nhánh</h2>
        <button className={cx("addBtn")} onClick={openCreateForm}>
          + Thêm chi nhánh
        </button>
      </div>

      <div className={cx("grid")}>
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            {...branch}
            onEdit={() => openEditForm(branch)}
            onToggle={() => handleToggleStatus(branch.id)}
          />
        ))}
      </div>

      {/* ======================= MODAL FORM ======================= */}
      {showForm && (
        <div className={cx("modalOverlay")}>
          <div className={cx("modal")}>
            <h3>
              {editingBranch ? "Cập nhật chi nhánh" : "Thêm chi nhánh mới"}
            </h3>
            <form onSubmit={handleSubmit}>
              <label>Tên chi nhánh</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Địa chỉ</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <label>Giờ mở cửa</label>
              <input
                type="time"
                name="openTime"
                value={formData.openTime}
                onChange={handleChange}
                required
              />
              <label>Giờ đóng cửa</label>
              <input
                type="time"
                name="closeTime"
                value={formData.closeTime}
                onChange={handleChange}
                required
              />
              <label>Thời lượng slot (phút)</label>
              <input
                type="number"
                name="slotDuration"
                value={formData.slotDuration}
                onChange={handleChange}
                min="10"
                max="120"
                required
              />
              <label>ID quản lý</label>
              <input
                name="managerId"
                type="number"
                value={formData.managerId}
                onChange={handleChange}
                required
              />

              <div className={cx("modalActions")}>
                <button type="submit" className={cx("saveBtn")}>
                  {editingBranch ? "Lưu thay đổi" : "Thêm mới"}
                </button>
                <button
                  type="button"
                  className={cx("cancelBtn")}
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= TOAST ======================= */}
      {toast && (
        <Toast
          type={toast.type}
          text={toast.text}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default ChiNhanh;

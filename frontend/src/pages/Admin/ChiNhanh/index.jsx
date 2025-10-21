import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChiNhanh.module.scss";
import BranchCard from "~/components/BranchCard";
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // ======================= XỬ LÝ FORM =======================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mở form thêm
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

  // Mở form sửa
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

  // ======================= THÊM / SỬA =======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await BranchAPI.update(editingBranch.id, formData);
        alert("✏️ Cập nhật chi nhánh thành công!");
      } else {
        await BranchAPI.create(formData);
        alert("✅ Thêm chi nhánh thành công!");
      }
      setShowForm(false);
      await fetchBranches();
    } catch (error) {
      alert("❌ Lỗi khi lưu chi nhánh!");
      console.error("Branch create/update error:", error);
    }
  };

  // ======================= XÓA =======================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chi nhánh này không?")) return;
    try {
      await BranchAPI.delete(id);
      alert("🗑️ Đã xóa chi nhánh thành công!");
      await fetchBranches();
    } catch (error) {
      console.error("Branch delete error:", error);
      alert("❌ Lỗi khi xóa chi nhánh!");
    }
  };

  // ======================= BẬT / TẮT TRẠNG THÁI =======================
  const handleToggleStatus = async (id) => {
    try {
      const result = await BranchAPI.toggleStatus(id);
      alert(
        `✅ Trạng thái chi nhánh đã đổi sang: ${
          result.status === "Active" ? "Hoạt động" : "Tạm ngưng"
        }`
      );
      await fetchBranches();
    } catch (error) {
      console.error("Toggle status error:", error);
      alert("❌ Lỗi khi cập nhật trạng thái chi nhánh!");
    }
  };

  // ======================= HIỂN THỊ GIAO DIỆN =======================
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
            onDelete={() => handleDelete(branch.id)}
            onToggle={() => handleToggleStatus(branch.id)} // 👈 toggle trạng thái
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
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Địa chỉ</label>
              <input
                type="text"
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
                min="10"
                max="120"
                value={formData.slotDuration}
                onChange={handleChange}
                required
              />

              <label>ID quản lý (managerId)</label>
              <input
                type="number"
                name="managerId"
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
    </div>
  );
}

export default ChiNhanh;

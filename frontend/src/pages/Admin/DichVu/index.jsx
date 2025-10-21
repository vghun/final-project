import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./DichVu.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faLock,
  faLockOpen,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import ServiceAPI from "~/apis/serviceAPI";

const cx = classNames.bind(styles);

function DichVu() {
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    status: "Active",
  });

  const [editingService, setEditingService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBranches, setSelectedBranches] = useState([]);

  // ==========================================================
  // 🔹 Hàm tải danh sách dịch vụ + chi nhánh
  // ==========================================================
  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await ServiceAPI.getAll();
      setServices(data);

      // gom danh sách chi nhánh duy nhất từ tất cả service
      const allBranches = [];
      data.forEach((s) => {
        s.branches?.forEach((b) => {
          if (!allBranches.find((x) => x.idBranch === b.idBranch)) {
            allBranches.push(b);
          }
        });
      });
      setBranches(allBranches);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách dịch vụ:", error);
      alert("Không thể tải danh sách dịch vụ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ==========================================================
  // 🔹 Xử lý form input
  // ==========================================================
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ==========================================================
  // 🔹 Mở modal thêm / sửa
  // ==========================================================
  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      image: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const openEditModal = (s) => {
    setEditingService(s);
    setFormData({
      name: s.name,
      description: s.description,
      price: s.price,
      duration: s.duration,
      image: s.image || "",
      status: s.status,
    });
    setShowModal(true);
  };

  // ==========================================================
  // 🔹 Submit form (thêm / cập nhật)
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // ⚡ Chặn nhấn liên tục
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("status", formData.status);
      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      if (editingService) {
        await ServiceAPI.update(editingService.idService, formDataToSend);
        alert("✅ Cập nhật dịch vụ thành công!");
      } else {
        await ServiceAPI.create(formDataToSend);
        alert("✅ Thêm dịch vụ mới thành công!");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi lưu dịch vụ:", error);
      alert("❌ Không thể lưu dịch vụ!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================
  // 🔹 Xóa dịch vụ
  // ==========================================================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      await ServiceAPI.delete(id);
      alert("🗑️ Đã xóa dịch vụ!");
      await fetchServices();
    } catch (error) {
      console.error("❌ Lỗi khi xóa dịch vụ:", error);
      alert("Không thể xóa dịch vụ!");
    }
  };

  // ==========================================================
  // 🔹 Đổi trạng thái hoạt động (Active / Inactive)
  // ==========================================================
  const handleToggleStatus = async (service) => {
    try {
      const newStatus = service.status === "Active" ? "Inactive" : "Active";
      const formDataToSend = new FormData();
      formDataToSend.append("name", service.name);
      formDataToSend.append("description", service.description);
      formDataToSend.append("price", service.price);
      formDataToSend.append("duration", service.duration);
      formDataToSend.append("status", newStatus);
      if (service.image) formDataToSend.append("image", service.image);

      await ServiceAPI.update(service.idService, formDataToSend);
      await fetchServices();
    } catch (error) {
      console.error("❌ Lỗi toggle trạng thái:", error);
      alert("Không thể cập nhật trạng thái!");
    }
  };

  // ==========================================================
  // 🔹 Modal quản lý chi nhánh
  // ==========================================================
  const openBranchModal = (service) => {
    setSelectedService(service);
    setSelectedBranches(service.branches?.map((b) => b.idBranch) || []);
    setShowBranchModal(true);
  };

  const toggleBranch = (idBranch) => {
    setSelectedBranches((prev) =>
      prev.includes(idBranch)
        ? prev.filter((b) => b !== idBranch)
        : [...prev, idBranch]
    );
  };

  const handleSaveBranches = async () => {
    try {
      const oldIds = selectedService.branches?.map((b) => b.idBranch) || [];
      const toAdd = selectedBranches.filter((id) => !oldIds.includes(id));
      const toRemove = oldIds.filter((id) => !selectedBranches.includes(id));

      for (const idBranch of toAdd) {
        await ServiceAPI.assignBranch(selectedService.idService, idBranch);
      }
      for (const idBranch of toRemove) {
        await ServiceAPI.unassignBranch(selectedService.idService, idBranch);
      }

      alert("✅ Cập nhật chi nhánh thành công!");
      await fetchServices();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật chi nhánh:", error);
      alert("Không thể cập nhật chi nhánh!");
    } finally {
      setShowBranchModal(false);
    }
  };

  // ==========================================================
  if (loading) return <div className={cx("loading")}>Đang tải dữ liệu...</div>;

  return (
    <div className={cx("serviceList")}>
      <div className={cx("header")}>
        <h2>Quản lý dịch vụ</h2>
        <button className={cx("addBtn")} onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Thêm dịch vụ
        </button>
      </div>

      {services.length === 0 ? (
        <p className={cx("noData")}>Không có dữ liệu dịch vụ.</p>
      ) : (
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Thời lượng</th>
              <th>Chi nhánh</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.idService}>
                <td>
                  <div className={cx("barberCell")}>{s.name}</div>
                </td>
                <td>{s.description}</td>
                <td>{parseInt(s.price).toLocaleString()} đ</td>
                <td>{s.duration} phút</td>
                <td>
                  <div className={cx("branchCell")}>
                    {s.branches?.map((b) => b.name).join(", ") || "—"}
                    <button
                      className={cx("branchEditBtn")}
                      title="Quản lý chi nhánh"
                      onClick={() => openBranchModal(s)}
                    >
                      <FontAwesomeIcon icon={faBuilding} />
                    </button>
                  </div>
                </td>
                <td>
                  <div className={cx("statusCell")}>
                    <span
                      className={cx("status", {
                        active: s.status === "Active",
                        locked: s.status === "Inactive",
                      })}
                    >
                      {s.status === "Active" ? "Hoạt động" : "Ngừng"}
                    </span>
                    <button
                      className={cx("lockBtn")}
                      onClick={() => handleToggleStatus(s)}
                    >
                      <FontAwesomeIcon
                        icon={s.status === "Active" ? faLock : faLockOpen}
                      />
                    </button>
                  </div>
                </td>
                <td>
                  <div className={cx("actions")}>
                    <button
                      className={cx("editBtn")}
                      onClick={() => openEditModal(s)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      className={cx("deleteBtn")}
                      onClick={() => handleDelete(s.idService)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL THÊM / SỬA */}
      {showModal && (
        <div className={cx("modalOverlay")}>
          <div className={cx("modal")}>
            <h3>{editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Tên dịch vụ</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />

              <label>Giá (VNĐ)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <label>Thời lượng (phút)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />

              <label>Ảnh (File)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, imageFile: e.target.files[0] })
                }
              />

              <label>Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Ngừng</option>
              </select>

              <div className={cx("modalActions")}>
                <button
                  type="submit"
                  className={cx("saveBtn")}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Đang lưu..."
                    : editingService
                    ? "Cập nhật"
                    : "Thêm mới"}
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

      {/* MODAL PHÂN CHI NHÁNH */}
      {showBranchModal && (
        <div className={cx("modalOverlay")}>
          <div className={cx("modal")}>
            <h3>Phân chi nhánh cho {selectedService.name}</h3>
            <div className={cx("branchListModal")}>
              {branches.map((b) => (
                <label key={b.idBranch} className={cx("branchItem")}>
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes(b.idBranch)}
                    onChange={() => toggleBranch(b.idBranch)}
                  />
                  {b.name}
                </label>
              ))}
            </div>
            <div className={cx("modalActions")}>
              <button className={cx("saveBtn")} onClick={handleSaveBranches}>
                Lưu
              </button>
              <button
                className={cx("cancelBtn")}
                onClick={() => setShowBranchModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DichVu;

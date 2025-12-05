import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ServiceFormModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import ServiceAPI from "~/apis/serviceAPI";

const cx = classNames.bind(styles);

export default function ServiceFormModal({ show, onClose, service, branches, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    status: "",
    imageFile: null,
    branches: [],
  });

  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data vào form
  useEffect(() => {
    if (!service) return;

    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      status: service.status,
      imageFile: null,
      branches: service.branches?.map(b => b.idBranch) || [],
    });
    setEditMode(false);
  }, [service]);

  if (!show) return null;

  // Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleBranch = (id) => {
    setForm((prev) => ({
      ...prev,
      branches: prev.branches.includes(id)
        ? prev.branches.filter((x) => x !== id)
        : [...prev.branches, id],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("duration", form.duration);
      formData.append("status", form.status);

      if (form.imageFile) formData.append("image", form.imageFile);

      // Gửi update service
      await ServiceAPI.update(service.idService, formData);

      // Cập nhật chi nhánh
      const oldList = service.branches?.map(b => b.idBranch) || [];
      const add = form.branches.filter(x => !oldList.includes(x));
      const remove = oldList.filter(x => !form.branches.includes(x));

      for (const id of add) await ServiceAPI.assignBranch(service.idService, id);
      for (const id of remove) await ServiceAPI.unassignBranch(service.idService, id);

      onUpdated();
      setEditMode(true);
      alert("Đã cập nhật dịch vụ!");
    } catch (error) {
      console.error(error);
      alert("Không thể cập nhật!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cx("overlay")}>
      <div className={cx("modal")}>
        <div className={cx("header")}>
          <h3>Chi tiết dịch vụ</h3>
          <button onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
        </div>

        <div className={cx("body")}>
          <label>Tên dịch vụ</label>
          <input
            disabled={editMode}
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <label>Mô tả</label>
          <textarea
            disabled={editMode}
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Giá</label>
          <input
            type="number"
            disabled={editMode}
            name="price"
            value={form.price}
            onChange={handleChange}
          />

          <label>Thời lượng (phút)</label>
          <input
            type="number"
            disabled={editMode}
            name="duration"
            value={form.duration}
            onChange={handleChange}
          />

          <label>Chi nhánh</label>
          <div className={cx("branchList")}>
            {branches.map((b) => (
              <label key={b.idBranch}>
                <input
                  type="checkbox"
                  disabled={editMode}
                  checked={form.branches.includes(b.idBranch)}
                  onChange={() => toggleBranch(b.idBranch)}
                />
                {b.name}
              </label>
            ))}
          </div>

          <label>Trạng thái</label>
          <div
            className={cx("statusToggle")}
            onClick={() => !editMode && setForm({ ...form, status: form.status === "Active" ? "Inactive" : "Active" })}
          >
            <FontAwesomeIcon icon={form.status === "Active" ? faToggleOn : faToggleOff} />
            <span>{form.status === "Active" ? "Hoạt động" : "Ngừng"}</span>
          </div>

          <label>Hình ảnh</label>
          <input
            type="file"
            disabled={editMode}
            onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
          />
        </div>

        <div className={cx("footer")}>
          {!editMode ? (
            <button className={cx("save")} disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Đang lưu..." : "Sửa"}
            </button>
          ) : (
            <>
              <button className={cx("save")} onClick={onClose}>Đóng</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

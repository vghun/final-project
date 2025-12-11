import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ServiceFormModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import ServiceAPI from "~/apis/serviceAPI";
import Toast from "~/components/Toast";

const cx = classNames.bind(styles);

export default function ServiceFormModal({ show, onClose, serviceId, branches, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    status: "Active",
    imageFile: null,
    branches: [],
  });

  const [serviceDetail, setServiceDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [toast, setToast] = useState(null);

  // ⭐ FIX QUAN TRỌNG: Nếu serviceId = null → tạo mới
  useEffect(() => {
    if (!show) return;

    if (!serviceId) {
      // → Tạo mới, không gọi API
      setForm({
        name: "",
        description: "",
        price: "",
        duration: "",
        status: "Active",
        imageFile: null,
        branches: [],
      });

      setEditMode(true);
      setServiceDetail(null);
      setLoadingDetail(false);
      return;
    }

    // → Chỉnh sửa: tải dữ liệu từ API
    const loadDetail = async () => {
      setLoadingDetail(true);

      const data = await ServiceAPI.getById(serviceId);
      setServiceDetail(data);

      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        status: data.status,
        imageFile: null,
        branches: data.branches?.map(b => b.idBranch) || [],
      });

      setEditMode(false);
      setLoadingDetail(false);
    };

    loadDetail();
  }, [show, serviceId]);

  if (!show) return null;

  if (loadingDetail)
    return (
      <div className={cx("overlay")}>
        <div className={cx("modal")}>Đang tải...</div>
      </div>
    );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleClose = () => {
    if (editMode) setShowConfirmClose(true);
    else onClose();
  };

  const toggleBranch = (id) => {
    setForm((prev) => ({
      ...prev,
      branches: prev.branches.includes(id)
        ? prev.branches.filter((x) => x !== id)
        : [...prev.branches, id],
    }));
  };

  const handleEditClick = async () => {
    const result = await ServiceAPI.checkAndHide(serviceId);

    if (result.success) {
      setEditMode(true);
      setToast({ type: "success", text: result.message, duration: 3000 });
    } else {
      setToast({ type: "error", text: result.message, duration: 3000 });
    }
  };

  
  const handleSubmit = async () => {
  // Validate trước khi gửi API
  if (!form.name.trim()) {
    setToast({ type: "error", text: "Tên dịch vụ không được để trống", duration: 3000 });
    return;
  }

  const numericPrice = parseFloat(form.price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    setToast({ type: "error", text: "Giá phải là số lớn hơn 0", duration: 3000 });
    return;
  }

  const numericDuration = parseInt(form.duration);
  if (isNaN(numericDuration) || numericDuration <= 0) {
    setToast({ type: "error", text: "Thời lượng phải là số nguyên lớn hơn 0", duration: 3000 });
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", numericPrice);
    formData.append("duration", numericDuration);
    formData.append("status", form.status);
    formData.append("branches", JSON.stringify(form.branches));
    if (form.imageFile) formData.append("image", form.imageFile);

    let res;
    if (!serviceId) {
      res = await ServiceAPI.create(formData);
    } else {
      res = await ServiceAPI.update(serviceId, formData);
    }

    setToast({
      type: "success",
      text: res.data?.message || "Thành công!",
      duration: 3000,
    });

    setTimeout(() => {
      onUpdated();
      onClose();
    }, 900);
  } catch (error) {
    setToast({
      type: "error",
      text: error.response?.data?.error || "Lỗi khi lưu dữ liệu!",
      duration: 3000,
    });
  }
};

  return (
    <>
      <div className={cx("overlay")}>
        <div className={cx("modal")}>
          {/* HEADER */}
          <div className={cx("header")}>
            <h3>{serviceId ? "Chi tiết dịch vụ" : "Thêm dịch vụ mới"}</h3>
            <button onClick={handleClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* BODY */}
          <div className={cx("body")}>
            <div className={cx("leftImage")}>
              <div className={cx("imagePreview")}>
                <img
                  src={
                    form.imageFile
                      ? URL.createObjectURL(form.imageFile)
                      : serviceDetail?.image ||
                        "https://via.placeholder.com/200?text=No+Image"
                  }
                  alt="service"
                />
              </div>
              <label className={cx("fileButton")}>
                Chọn ảnh
                <input
                  type="file"
                  hidden
                  disabled={!editMode}
                  onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
                />
              </label>
            </div>

            <div className={cx("rightInfo")}>
              <label>Tên dịch vụ</label>
              <input disabled={!editMode} name="name" value={form.name} onChange={handleChange} />

              <label>Mô tả</label>
              <textarea disabled={!editMode} name="description" value={form.description} onChange={handleChange} />

              <label>Giá</label>
              <input type="number" disabled={!editMode} name="price" value={form.price} onChange={handleChange} />

              <label>Thời lượng (phút)</label>
              <input type="number" disabled={!editMode} name="duration" value={form.duration} onChange={handleChange} />

              <label>Chi nhánh</label>
              <div className={cx("branchList")}>
                {branches.map((b) => (
                  <label key={b.idBranch}>
                    <input
                      type="checkbox"
                      disabled={!editMode}
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
                onClick={() =>
                  editMode && setForm({ ...form, status: form.status === "Active" ? "Inactive" : "Active" })
                }
              >
                <FontAwesomeIcon icon={form.status === "Active" ? faToggleOn : faToggleOff} />
                <span>{form.status === "Active" ? "Hoạt động" : "Ngừng"}</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className={cx("footer")}>
            <button className={cx("save")} onClick={handleSubmit}>
              {serviceId ? (editMode ? "Lưu thay đổi" : "Chỉnh sửa") : "Tạo dịch vụ"}
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <Toast
            type={toast.type}
            text={toast.text}
            duration={toast.duration}
            onClose={() => setToast(null)}
          />
        )}
      </div>

      {/* Xác nhận đóng */}
      {showConfirmClose && (
        <div className={cx("confirmOverlay")}>
          <div className={cx("confirmModal")}>
            <p>Bạn có chắc muốn tắt khi chưa lưu không?</p>
            <div className={cx("confirmButtons")}>
              <button
                onClick={() => {
                  setShowConfirmClose(false);
                  onClose();
                }}
              >
                Có
              </button>
              <button onClick={() => setShowConfirmClose(false)}>Không</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

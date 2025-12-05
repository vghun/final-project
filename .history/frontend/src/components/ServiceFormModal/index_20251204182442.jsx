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
    status: "",
    imageFile: null,
    branches: [],
  });
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [toast, setToast] = useState(null); // state quản lý Toast

  useEffect(() => {
    if (!show || !serviceId) return;

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

     setEditMode(data.status === "Inactive"); 
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
    if (editMode) {
        setShowConfirmClose(true); // hiển thị modal xác nhận
    } else {
        onClose(); // chưa chỉnh sửa → đóng luôn
    }
    };


  const toggleBranch = (id) => {
    setForm((prev) => ({
      ...prev,
      branches: prev.branches.includes(id)
        ? prev.branches.filter((x) => x !== id)
        : [...prev.branches, id],
    }));
  };

  // Khi bấm Chỉnh sửa
  const handleEditClick = async () => {
  try {
    const result = await ServiceAPI.checkAndHide(serviceId);
    if (result.success) {
      setEditMode(true);
      setToast({ type: "success", text: result.message, duration: 3000 });
    } else {
      setToast({ type: "error", text: result.message, duration: 3000 });
    }
  } catch (error) {
    setToast({ type: "error", text: "Không thể chuyển sang chế độ chỉnh sửa!", duration: 3000 });
  }
};

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("duration", form.duration);
      formData.append("status", "Active"); // mở lại dịch vụ sau khi cập nhật

      if (form.imageFile) formData.append("image", form.imageFile);

      await ServiceAPI.update(serviceId, formData);

      const oldBranches = serviceDetail.branches?.map((b) => b.idBranch) || [];
      const add = form.branches.filter((x) => !oldBranches.includes(x));
      const remove = oldBranches.filter((x) => !form.branches.includes(x));

      for (const id of add) await ServiceAPI.assignBranch(serviceId, id);
      for (const id of remove) await ServiceAPI.unassignBranch(serviceId, id);

      setToast({ type: "success", text: "Đã cập nhật dịch vụ!", duration: 3000 });
      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      setToast({ type: "error", text: "Không thể cập nhật!", duration: 3000 });
    }
  };

  return (
    <>
    <div className={cx("overlay")}>
      <div className={cx("modal")}>
        {/* HEADER */}
        <div className={cx("header")}>
          <h3>Chi tiết dịch vụ</h3>
         <button onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
        </button>
        </div>

        {/* BODY */}
        <div className={cx("body")}>
          <div className={cx("leftImage")}>
            <div className={cx("imagePreview")}>
              <img
                src={form.imageFile ? URL.createObjectURL(form.imageFile) : serviceDetail?.image}
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
          {editMode ? (
            <button className={cx("save")} onClick={handleSubmit}>
              Lưu thay đổi
            </button>
          ) : (
            <button className={cx("save")} onClick={handleEditClick}>
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* Render Toast */}
      {toast && (
        <Toast
          type={toast.type}
          text={toast.text}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
    {/* Modal xác nhận đóng */}
    {showConfirmClose && (
      <div className={cx("confirmOverlay")}>
        <div className={cx("confirmModal")}>
          <p>Bạn có chắc muốn tắt khi chưa cập nhật không?</p>
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

import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ServiceFormModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import ServiceAPI from "~/apis/serviceAPI";

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

  const [serviceDetail, setServiceDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [editMode, setEditMode] = useState(false);

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

      setEditMode(false);
      setLoadingDetail(false);
    };

    loadDetail();
  }, [show, serviceId]);

  if (!show) return null;
  if (loadingDetail) return <div className={cx("overlay")}><div className={cx("modal")}>Đang tải...</div></div>;

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
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("duration", form.duration);
      formData.append("status", form.status);

      if (form.imageFile) formData.append("image", form.imageFile);

      await ServiceAPI.update(serviceId, formData);

      const oldBranches = serviceDetail.branches?.map(b => b.idBranch) || [];
      const add = form.branches.filter(x => !oldBranches.includes(x));
      const remove = oldBranches.filter(x => !form.branches.includes(x));

      for (const id of add) await ServiceAPI.assignBranch(serviceId, id);
      for (const id of remove) await ServiceAPI.unassignBranch(serviceId, id);

      alert("Đã cập nhật dịch vụ!");
      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Không thể cập nhật!");
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

  <div className={cx("contentRow")}>

    {/* CỘT 1: HÌNH ẢNH */}
    <div className={cx("leftImage")}>

      <div className={cx("imagePreview")}>
        <img
          src={
            form.imageFile
              ? URL.createObjectURL(form.imageFile)
              : serviceDetail?.image
          }
          alt="service"
        />
      </div>

      <input
        type="file"
        disabled={editMode}
        onChange={(e) =>
          setForm({ ...form, imageFile: e.target.files[0] })
        }
      />
    </div>

    {/* CỘT 2: THÔNG TIN */}
    <div className={cx("rightInfo")}>

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
        onClick={() =>
          !editMode &&
          setForm({
            ...form,
            status:
              form.status === "Active" ? "Inactive" : "Active",
          })
        }
      >
        <FontAwesomeIcon
          icon={form.status === "Active" ? faToggleOn : faToggleOff}
        />
        <span>
          {form.status === "Active" ? "Hoạt động" : "Ngừng"}
        </span>
      </div>

    </div>

  </div>



        <div className={cx("footer")}>
          {!editMode ? (
            <button className={cx("save")} onClick={handleSubmit}>
              Lưu thay đổi
            </button>
          ) : (
            <button className={cx("save")} onClick={onClose}>Đóng</button>
          )}
        </div>
      </div>
    </div>
  );
}

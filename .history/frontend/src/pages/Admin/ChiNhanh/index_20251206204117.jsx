import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChiNhanh.module.scss";
import BranchCard from "~/components/BranchCard";
import Toast from "~/components/Toast";
import { BranchAPI } from "~/apis/branchAPI";
import serviceApi  from "~/apis/serviceAPI"; // ✅ API dịch vụ

const cx = classNames.bind(styles);

function ChiNhanh() {
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]); // ✅ dịch vụ
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [toast, setToast] = useState(null);
  // ======================= AUTOCOMPLETE ADDRESS =======================
  const [allProvinces, setAllProvinces] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

const [formData, setFormData] = useState({
  name: "",
  address: "",
  openTime: "08:00",
  closeTime: "20:00",
  slotDuration: 30,
  managerId: "",
  selectedServices: [],
  startDate: "", // ➕ thêm ngày bắt đầu
});


  // ======================= FETCH DATA =======================
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
        services: b.services || [], // 
      }));
      setBranches(mapped);
    } catch (error) {
      console.error(error);
      setToast({ type: "error", text: "Lỗi khi tải chi nhánh", duration: 2000 });
    }
  };

  const fetchServices = async () => {
    try {
      const data = await serviceApi.getAll();
      setServices(data);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "Không tải được dịch vụ!", duration: 2000 });
    }
  };
  useEffect(() => {
  // Load dữ liệu tỉnh – quận – phường
  Promise.all([
    fetch("https://provinces.open-api.vn/api/p/").then(res => res.json()),
    fetch("https://provinces.open-api.vn/api/d/").then(res => res.json()),
    fetch("https://provinces.open-api.vn/api/w/").then(res => res.json())
  ]).then(([p, d, w]) => {
    setAllProvinces(p);
    setAllDistricts(d);
    setAllWards(w);
  });
}, []);


  useEffect(() => {
    fetchBranches();
    fetchServices();
    setLoading(false);
  }, []);

  // ======================= FORM HANDLERS =======================

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleService = (id) => {
    setFormData((prev) => {
      const exists = prev.selectedServices.includes(id);
      return {
        ...prev,
        selectedServices: exists
          ? prev.selectedServices.filter((s) => s !== id)
          : [...prev.selectedServices, id],
      };
    });
  };
// =================== SMART AUTOCOMPLETE ADDRESS ===================

// Làm sạch chuỗi: bỏ dấu tiếng Việt
// =================== SMART AUTOCOMPLETE ADDRESS ===================

// =================== SMART AUTOCOMPLETE ADDRESS ===================

// Xóa dấu tiếng Việt
const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Tách đường ra khỏi phần còn lại
const extractStreet = (value) => {
  const parts = value.trim().split(" ");
  if (parts.length <= 1) return { street: "", keyword: value };

  // street = từ đầu đến trước từ khóa hành chính tìm thấy
  return {
    street: value,
    keyword: normalize(value)
  };
};
const handleAddressChange = (e) => {
  const value = e.target.value;
  setFormData({ ...formData, address: value });

  if (!value.trim()) return setSuggestions([]);

  const keyword = normalize(value);
  const results = [];

  // ----------------- Tách phần tên đường -----------------
  const [streetPart, ...rest] = value.split(","); 
  const street = streetPart.trim(); // Tên đường do user nhập
  const keywordAddress = normalize(rest.join(",")).trim();

  // Nếu user chỉ nhập tên đường => vẫn tìm theo ward/district/province
  const actualKeyword = keywordAddress || normalize(street);

  // ----------------- Tìm theo Xã / Phường -----------------
  allWards.forEach((w) => {
    if (normalize(w.name).includes(actualKeyword)) {
      const district = allDistricts.find((d) => d.code === w.district_code);
      const province = allProvinces.find((p) => p.code === district?.province_code);

      results.push(
        `${street ? street + ", " : ""}${w.name}, ${district?.name}, ${province?.name}`
      );
    }
  });

  // ----------------- Tìm theo Huyện -----------------
  allDistricts.forEach((d) => {
    if (normalize(d.name).includes(actualKeyword)) {
      const province = allProvinces.find((p) => p.code === d.province_code);

      results.push(
        `${street ? street + ", " : ""}${d.name}, ${province?.name}`
      );
    }
  });

  // ----------------- Tìm theo Tỉnh -----------------
  allProvinces.forEach((p) => {
    if (normalize(p.name).includes(actualKeyword)) {
      results.push(
        `${street ? street + ", " : ""}${p.name}`
      );
    }
  });

  setSuggestions(results.slice(0, 10));
};

const selectSuggestion = (fullAddress) => {
  setFormData({ ...formData, address: fullAddress });
  setSuggestions([]);
};

const openCreateForm = () => {
  setEditingBranch(null);
  setFormData({
    name: "",
    address: "",
    openTime: "08:00",
    closeTime: "20:00",
    slotDuration: 30,
    managerId: "",
    selectedServices: [],
    startDate: "", // ➕ thêm vào
  });
  setShowForm(true);
};


const openEditForm = (branch) => {
  setEditingBranch(branch);

  // Kiểm tra status
  const isEditable = branch.status === "Tạm ngưng"; // Inactive mới được sửa

  if (!isEditable) {
    setToast({
      type: "info",
      text: "Chi nhánh đang hoạt động, chỉ có thể xem thông tin!",
      duration: 3000,
    });
  }

  setFormData({
    name: branch.name,
    address: branch.address,
    openTime: branch.openTime,
    closeTime: branch.closeTime,
    slotDuration: branch.slotDuration,
    selectedServices: branch.services?.map((s) => s.idService) || [],
    startDate: branch.resumeDate || "", // nếu có
    isEditable, // ➕ thêm flag để form disable input khi không được phép sửa
  });

  setShowForm(true);
};

  // ======================= SUBMIT =======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await BranchAPI.update(editingBranch.id, formData);
        setToast({ type: "success", text: "Cập nhật chi nhánh thành công!", duration: 2000 });
      } else {
        await BranchAPI.create(formData);
        setToast({ type: "success", text: "Thêm chi nhánh thành công!", duration: 2000 });
      }

      setShowForm(false);
      fetchBranches();
    } catch (error) {
      console.error(error);
      setToast({ type: "error", text: "Lỗi khi lưu chi nhánh!", duration: 2000 });
    }
  };

  // ======================= TOGGLE STATUS =======================
  const handleToggleStatus = async (id) => {
    try {
      const result = await BranchAPI.toggleStatus(id);
      setToast({
        type: "success",
        text: `Đã đổi sang: ${result.status === "Active" ? "Hoạt động" : "Tạm ngưng"}`,
        duration: 2000,
      });
      fetchBranches();
    } catch (error) {
      console.error(error);
      setToast({ type: "error", text: "Lỗi khi đổi trạng thái!", duration: 2000 });
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
      <h3>{editingBranch ? "Cập nhật chi nhánh" : "Thêm chi nhánh mới"}</h3>

      <form onSubmit={handleSubmit}>
        <div className={cx("formGrid")}>
          <div>
            <label>Tên chi nhánh</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={formData.isEditable === false}
            />
          </div>

          <div style={{ position: "relative" }}>
            <label>Địa chỉ</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleAddressChange}
              placeholder="Nhập địa chỉ…"
              autoComplete="off"
              required
              disabled={formData.isEditable === false}
            />

            {suggestions.length > 0 && formData.isEditable !== false && (
              <ul className={cx("suggestList")}>
                {suggestions.map((item, idx) => (
                  <li key={idx} onClick={() => selectSuggestion(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!editingBranch && (
            <div>
              <label>Ngày bắt đầu hoạt động</label>
              <input
                type="date"
                name="startDate"
                required
                min={new Date(Date.now() + 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]}
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label>Giờ mở cửa</label>
            <input
              type="time"
              name="openTime"
              value={formData.openTime}
              onChange={handleChange}
              disabled={formData.isEditable === false}
            />
          </div>

          <div>
            <label>Giờ đóng cửa</label>
            <input
              type="time"
              name="closeTime"
              value={formData.closeTime}
              onChange={handleChange}
              disabled={formData.isEditable === false}
            />
          </div>

          <div>
            <label>Thời lượng slot (phút)</label>
            <input
              type="number"
              name="slotDuration"
              min="10"
              max="120"
              value={formData.slotDuration}
              onChange={handleChange}
              disabled={formData.isEditable === false}
            />
          </div>
        </div>

        <label>Dịch vụ áp dụng</label>
        <div className={cx("serviceListModal")}>
          {services.map((s) => (
            <label key={s.idService} className={cx("serviceItem")}>
              <input
                type="checkbox"
                checked={formData.selectedServices.includes(s.idService)}
                onChange={() => toggleService(s.idService)}
                disabled={formData.isEditable === false}
              />
              {s.name}
            </label>
          ))}
        </div>

        <div className={cx("modalActions")}>
          {formData.isEditable !== false && (
            <button className={cx("saveBtn")}>Lưu</button>
          )}
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

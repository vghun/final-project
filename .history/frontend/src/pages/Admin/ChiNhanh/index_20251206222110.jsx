import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChiNhanh.module.scss";
import BranchCard from "~/components/BranchCard";
import Toast from "~/components/Toast";
import { BranchAPI } from "~/apis/branchAPI";
import serviceApi from "~/apis/serviceAPI";

const cx = classNames.bind(styles);

function ChiNhanh() {
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState(getEmptyFormData());

  const [showSuspendForm, setShowSuspendForm] = useState(false);
  const [suspendBranch, setSuspendBranch] = useState(null);
  const [suspendFormData, setSuspendFormData] = useState({ suspendDate: "", resumeDate: "" });

  const [allProvinces, setAllProvinces] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // ======================= HELPER =======================
  function getEmptyFormData() {
    return {
      name: "",
      address: "",
      openTime: "08:00",
      closeTime: "20:00",
      slotDuration: 30,
      managerId: "",
      selectedServices: [],
      startDate: "",
      isEditable: true,
    };
  }

  const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // ======================= FETCH DATA =======================
  const fetchBranches = async () => {
    try {
      const data = await BranchAPI.getAll();
      const list = Array.isArray(data) ? data : [];
      setBranches(
        list.map((b) => ({
          ...b,
          id: b.idBranch,
          manager: b.manager?.fullName || "Chưa có quản lý",
          staff: b.totalBarbers || 0,
          revenue: b.revenue || "Đang cập nhật",
          status: b.status === "Active" ? "Hoạt động" : "Tạm ngưng",
        }))
      );
    } catch (err) {
      console.error(err);
      showToast("error", "Lỗi khi tải chi nhánh");
    }
  };

  const fetchServices = async () => {
    try {
      const data = await serviceApi.getAll();
      setServices(data);
    } catch (err) {
      console.error(err);
      showToast("error", "Không tải được dịch vụ!");
    }
  };

  const showToast = (type, text, duration = 2000) => setToast({ type, text, duration });

  useEffect(() => {
    // Load tỉnh – quận – phường
    Promise.all([
      fetch("https://provinces.open-api.vn/api/p/").then((res) => res.json()),
      fetch("https://provinces.open-api.vn/api/d/").then((res) => res.json()),
      fetch("https://provinces.open-api.vn/api/w/").then((res) => res.json()),
    ]).then(([p, d, w]) => {
      setAllProvinces(p);
      setAllDistricts(d);
      setAllWards(w);
    });

    fetchBranches();
    fetchServices();
    setLoading(false);
  }, []);

  // ======================= FORM HANDLERS =======================
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleService = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }));
  };

  // =================== AUTOCOMPLETE ADDRESS ===================
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });

    if (!value.trim()) return setSuggestions([]);

    const [streetPart, ...rest] = value.split(",");
    const street = streetPart.trim();
    const keywordAddress = normalize(rest.join(",")).trim();
    const actualKeyword = keywordAddress || normalize(street);

    const results = [];

    allWards.forEach((w) => {
      if (normalize(w.name).includes(actualKeyword)) {
        const district = allDistricts.find((d) => d.code === w.district_code);
        const province = allProvinces.find((p) => p.code === district?.province_code);
        results.push(`${street ? street + ", " : ""}${w.name}, ${district?.name}, ${province?.name}`);
      }
    });

    allDistricts.forEach((d) => {
      if (normalize(d.name).includes(actualKeyword)) {
        const province = allProvinces.find((p) => p.code === d.province_code);
        results.push(`${street ? street + ", " : ""}${d.name}, ${province?.name}`);
      }
    });

    allProvinces.forEach((p) => {
      if (normalize(p.name).includes(actualKeyword)) {
        results.push(`${street ? street + ", " : ""}${p.name}`);
      }
    });

    setSuggestions(results.slice(0, 10));
  };

  const selectSuggestion = (address) => {
    setFormData({ ...formData, address });
    setSuggestions([]);
  };

  // =================== OPEN FORM ===================
  const openCreateForm = () => {
    setEditingBranch(null);
    setFormData(getEmptyFormData());
    setShowForm(true);
  };

  const openEditForm = (branch) => {
    const isEditable = branch.status === "Tạm ngưng";
    if (!isEditable) showToast("info", "Chi nhánh đang hoạt động, chỉ có thể xem thông tin!", 3000);

    setEditingBranch(branch);
    setFormData({
      ...branch,
      selectedServices: branch.services?.map((s) => s.idService) || [],
      isEditable,
      startDate: "",
    });
    setShowForm(true);
  };

  // =================== SUSPEND HANDLERS ===================
  const openSuspendForm = (branch) => {
    setSuspendBranch(branch);
    setSuspendFormData({ suspendDate: branch.suspendDate || "", resumeDate: branch.resumeDate || "" });
    setShowSuspendForm(true);
  };

  const handleSuspendChange = (e) =>
    setSuspendFormData({ ...suspendFormData, [e.target.name]: e.target.value });

  const handleSuspendSubmit = async (e) => {
    e.preventDefault();
    const { suspendDate, resumeDate } = suspendFormData;

    if (!suspendDate || !resumeDate) return showToast("error", "Vui lòng điền đủ ngày!");
    if (new Date(resumeDate) <= new Date(suspendDate))
      return showToast("error", "Ngày hoạt động trở lại phải lớn hơn ngày ngừng!");

    try {
      await BranchAPI.setSuspend(suspendBranch.id, suspendDate, resumeDate);
      showToast("success", "Đã đặt ngày tạm ngưng thành công!");
      setShowSuspendForm(false);
      fetchBranches();
    } catch (err) {
      console.error(err);
      showToast("error", "Lỗi khi lưu ngày tạm ngưng!");
    }
  };
const formatDate = (d) => {
  if (!d) return null;
  return `${d} 00:00:00`;  // d = "2025-12-07"
};
  // =================== SUBMIT FORM ===================
  // =================== SUBMIT FORM ===================
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Chuẩn hóa startDate: giữ nguyên string "YYYY-MM-DD"
    const payload = {
      ...formData,
      startDate: formatDate(formData.startDate), // không dùng new Date() → tránh lệch timezone
      selectedServices: formData.selectedServices,
    };

    if (editingBranch) {
      await BranchAPI.update(editingBranch.id, payload);
    } else {
      await BranchAPI.create(payload);
    }

    showToast(
      "success",
      editingBranch ? "Cập nhật chi nhánh thành công!" : "Thêm chi nhánh thành công!"
    );
    setShowForm(false);
    fetchBranches();
  } catch (err) {
    console.error(err);
    showToast("error", "Lỗi khi lưu chi nhánh!");
  }
};


  // =================== TOGGLE STATUS ===================
  const handleToggleStatus = async (id) => {
    try {
      const result = await BranchAPI.toggleStatus(id);
      showToast("success", `Đã đổi sang: ${result.status === "Active" ? "Hoạt động" : "Tạm ngưng"}`);
      fetchBranches();
    } catch (err) {
      console.error(err);
      showToast("error", "Lỗi khi đổi trạng thái!");
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
            onToggle={() => {
              const alreadySet = branch.suspendDate && branch.resumeDate;
              if (alreadySet)
                showToast(
                  "info",
                  `Chi nhánh đã đặt tạm ngưng từ ${new Date(branch.suspendDate).toLocaleDateString()} đến ${new Date(branch.resumeDate).toLocaleDateString()}`,
                  3000
                );
              else openSuspendForm(branch);
            }}
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
                  <input name="name" value={formData.name} onChange={handleChange} required disabled={!formData.isEditable} />
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
                    disabled={!formData.isEditable}
                  />
                  {suggestions.length > 0 && formData.isEditable && (
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
                      min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div>
                  <label>Giờ mở cửa</label>
                  <input type="time" name="openTime" value={formData.openTime} onChange={handleChange} disabled={!formData.isEditable} />
                </div>

                <div>
                  <label>Giờ đóng cửa</label>
                  <input type="time" name="closeTime" value={formData.closeTime} onChange={handleChange} disabled={!formData.isEditable} />
                </div>

                <div>
                  <label>Thời lượng slot (phút)</label>
                  <input type="number" name="slotDuration" min="10" max="120" value={formData.slotDuration} onChange={handleChange} disabled={!formData.isEditable} />
                </div>
              </div>

              <label>Dịch vụ áp dụng</label>
              <div className={cx("serviceListModal")}>
                {services.map((s) => (
                  <label key={s.idService} className={cx("serviceItem")}>
                    <input type="checkbox" checked={formData.selectedServices.includes(s.idService)} onChange={() => toggleService(s.idService)} disabled={!formData.isEditable} />
                    {s.name}
                  </label>
                ))}
              </div>

              <div className={cx("modalActions")}>
                {formData.isEditable && <button className={cx("saveBtn")}>Lưu</button>}
                <button type="button" className={cx("cancelBtn")} onClick={() => setShowForm(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL SUSPEND ======================= */}
      {showSuspendForm && (
        <div className={cx("modalOverlay")}>
          <div className={cx("modal")}>
            <h3>Đặt ngày tạm ngưng chi nhánh</h3>
            <form onSubmit={handleSuspendSubmit}>
              <div className={cx("formGrid")}>
                <div>
                  <label>Ngày bắt đầu tạm ngưng</label>
                  <input type="date" name="suspendDate" value={suspendFormData.suspendDate} onChange={handleSuspendChange} required />
                </div>
                <div>
                  <label>Ngày hoạt động trở lại</label>
                  <input type="date" name="resumeDate" value={suspendFormData.resumeDate} onChange={handleSuspendChange} required />
                </div>
              </div>
              <div className={cx("modalActions")}>
                <button className={cx("saveBtn")}>Lưu</button>
                <button type="button" className={cx("cancelBtn")} onClick={() => setShowSuspendForm(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= TOAST ======================= */}
      {toast && <Toast type={toast.type} text={toast.text} duration={toast.duration} onClose={() => setToast(null)} />}
    </div>
  );
}

export default ChiNhanh;

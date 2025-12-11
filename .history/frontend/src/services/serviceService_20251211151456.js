import serviceApi from "~/apis/serviceAPI";

// Lấy dịch vụ hot có phân trang
export const fetchHotServicesPaged = async (page, limit) => {
  const res = await serviceApi.getHotPaged(page, limit);
  return res.data;
};

// Lấy chi tiết dịch vụ
export const fetchServiceById = async (id) => {
  const res = await serviceApi.getById(id);
  return res.data;
};
// utils/validateService.js
export const validateServiceData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Tên dịch vụ không được để trống");
  }

  const price = parseFloat(data.price);
  if (isNaN(price) || price <= 0) {
    errors.push("Giá phải là số lớn hơn 0");
  }

  const duration = parseInt(data.duration);
  if (isNaN(duration) || duration <= 0) {
    errors.push("Thời lượng phải là số nguyên lớn hơn 0");
  }

  // branches là tùy chọn, không cần validate bắt buộc

  return {
    valid: errors.length === 0,
    errors,
    data: {
      ...data,
      price,
      duration,
    },
  };
};

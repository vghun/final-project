import * as request from "~/apis/configs/httpRequest";

// 📋 Lấy tất cả chi nhánh
export const getAllBranches = async () => {
  try {
    const res = await request.get("/api/branches");
    console.log("API getAllBranches trả về:", res);
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API getAllBranches:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};
function normalizeDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${year}-${month}-${day}T00:00:00`;
}

// 📋 Tạo chi nhánh mới
export const createBranch = async (data) => {
  try {
    // ========================== VALIDATION ==========================

    if (!data || typeof data !== "object") {
      throw { message: "Dữ liệu không hợp lệ!" };
    }

    if (!data.name || data.name.trim().length < 2) {
      throw { message: "Tên chi nhánh không hợp lệ!" };
    }

    if (!data.address || data.address.trim().length < 5) {
      throw { message: "Địa chỉ phải dài hơn 5 ký tự!" };
    }

    if (!data.openTime || !data.closeTime) {
      throw { message: "Thiếu giờ mở cửa hoặc đóng cửa!" };
    }

    if (data.openTime >= data.closeTime) {
      throw { message: "Giờ mở cửa phải nhỏ hơn giờ đóng cửa!" };
    }

    // slotDuration phải là số > 0
    if (!data.slotDuration || isNaN(data.slotDuration) || data.slotDuration <= 0) {
      throw { message: "Thời lượng slot không hợp lệ!" };
    }

    // selectedServices phải là array
    if (!Array.isArray(data.selectedServices)) {
      throw { message: "Danh sách dịch vụ không hợp lệ!" };
    }
      if (!data.startDate) {
    throw { message: "Ngày bắt đầu hoạt động là bắt buộc!" };
    }


    // ======================== LOẠI BỎ MANAGER ID ========================
   const cleanedData = {
    name: data.name,
    address: data.address,
    openTime: data.openTime,
    closeTime: data.closeTime,
    slotDuration: data.slotDuration,
    selectedServices: data.selectedServices,
    startDate: normalizeDate(data.startDate), // ➕ thêm vào đây
  };


    // ======================== GỬI API ========================
    const res = await request.post("/api/branches", cleanedData);
    return res;

  } catch (error) {
    console.error(
      "Lỗi khi createBranch:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};


// 📋 Cập nhật chi nhánh
export const updateBranch = async (id, data) => {
  try {
    const res = await request.put(`/api/branches/${id}`, data);
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API updateBranch:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};
// 📋 Xoá chi nhánh
export const deleteBranch = async (id) => {
  try {
    const res = await request.del(`/api/branches/${id}`);
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API deleteBranch:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

// 📋 Chuyển trạng thái chi nhánh
export const toggleBranchStatus = async (id) => {
  try {
    const res = await request.patch(`/api/branches/${id}/toggle`);
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API toggleBranchStatus:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

// 📋 Gán dịch vụ cho chi nhánh
export const assignServiceToBranch = async (idBranch, idService) => {
  try {
    const res = await request.post("/api/branches/assign-service", {
      idBranch,
      idService,
    });
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API assignServiceToBranch:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

// 📋 Bỏ gán dịch vụ khỏi chi nhánh
export const unassignServiceFromBranch = async (idBranch, idService) => {
  try {
    const res = await request.del("/api/branches/unassign-service", {
      data: { idBranch, idService },
    });
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API unassignServiceFromBranch:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

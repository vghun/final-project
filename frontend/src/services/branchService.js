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

// 📋 Tạo chi nhánh mới
export const createBranch = async (data) => {
  try {
    const res = await request.post("/api/branches", data);
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API createBranch:",
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

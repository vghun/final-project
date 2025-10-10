import * as request from "~/apis/configs/httpRequest";

// 📋 Lấy tất cả chi nhánh
export const getAllBranches = async () => {
  try {
    const res = await request.get("/api/branches");
    console.log("API getAllBranches trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi gọi API getAllBranches:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// services/statisticsService.js
import * as request from "~/apis/configs/httpRequest";

// Lấy doanh thu tất cả thợ
// filter = { month, year, branchId }
export const getBarberRevenue = async (filter = {}) => {
  try {
    const res = await request.get("/api/statistics/barbers", { params: filter });
    console.log("API getBarberRevenue trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi gọi API getBarberRevenue:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Lấy tổng doanh thu từng tháng của các chi nhánh trong năm
export const getMonthlyBranchRevenue = async (year) => {
  try {
    const res = await request.get("/api/statistics/branches", { params: { year } });
    console.log("API getMonthlyBranchRevenue trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi gọi API getMonthlyBranchRevenue:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

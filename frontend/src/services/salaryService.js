import * as request from "~/apis/configs/httpRequest";

/**
 * Lấy bảng lương thợ cắt tóc theo tháng và năm
 * @param {number} month Tháng
 * @param {number} year Năm
 * @returns {Promise<Array>} Mảng dữ liệu lương
 */
export const fetchBarberSalaries = async (month, year) => {
  try {
    const res = await request.get(`/api/salary?month=${month}&year=${year}`);
    console.log("fetchBarberSalaries trả về:", res);
    return res; // trả về dữ liệu lương từ backend
  } catch (error) {
    console.error("Lỗi khi fetch bảng lương:", error);
    throw error.response?.data || error;
  }
};

/**
 * Gửi yêu cầu lưu/tính lương cho tháng/năm
 * @param {number} month Tháng
 * @param {number} year Năm
 * @returns {Promise<any>}
 */
export const calculateBarberSalaries = async (month, year) => {
  try {
    const res = await request.post(`/api/salary/confirm`, { month, year });
    console.log("calculateBarberSalaries trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi tính lương:", error);
    throw error.response?.data || error;
  }
};

/**
 * Lấy tổng quan lương các tháng (có hỗ trợ month/year)
 * @param {Object} params
 * @param {number} params.month - Tháng (1-12)
 * @param {number} params.year - Năm (YYYY)
 * @returns {Promise<Array>}
 */
export const fetchSalaryOverview = async ({ month, year }) => {
  console.log("params nhận được:", { month, year });

  try {
    const res = await request.get("/api/salary/overview", {
      params: { month, year },
      
    });
    

    return res;
  } catch (error) {
    console.error("Lỗi khi fetch salary overview:", error);
    throw error.response?.data || error;
  }
};
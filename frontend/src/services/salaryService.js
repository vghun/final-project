// salaryService.js
import * as request from "~/apis/configs/httpRequest";

/**
 * Lấy bảng lương thợ cắt tóc theo tháng và năm
 * @param {number} month Tháng
 * @param {number} year Năm
 * @returns {Promise<Array>} Mảng dữ liệu lương
 */
export const fetchBarberSalaries = async (month, year) => {
  try {
    const res = await request.get(`/api/salary?month=${month}&year=${year}`); // thêm /
    console.log("API fetchBarberSalaries trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi fetch bảng lương:", error);
    throw error.response?.data || error;
  }
};

/**
 * Gửi yêu cầu tính lương cho tháng/năm
 * @param {number} month Tháng
 * @param {number} year Năm
 * @returns {Promise<any>}
 */
export const calculateBarberSalaries = async (month, year) => {
  try {
    const res = await request.post(`/api/salary`, { month, year }); // thêm /
    console.log("API calculateBarberSalaries trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi tính lương:", error);
    throw error.response?.data || error;
  }
};

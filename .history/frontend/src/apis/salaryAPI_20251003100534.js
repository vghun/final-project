// SalaryAPI.js
import * as salaryService from "~/services/salaryService";

export const SalaryAPI = {
  /**
   * Lấy bảng lương thợ cắt tóc theo tháng và năm
   * @param {number} month Tháng
   * @param {number} year Năm
   */
  getSalaries: async (month, year) => {
    try {
      const res = await salaryService.fetchBarberSalaries(month, year);
      console.log("SalaryAPI.getSalaries trả về:", res);
      return res; // res đã là dữ liệu từ salaryService
    } catch (error) {
      console.error("Lỗi SalaryAPI.getSalaries:", error);
      throw error;
    }
  },

  /**
   * Tính lương thợ cắt tóc cho tháng và năm (nếu backend có endpoint tính lương)
   * @param {number} month Tháng
   * @param {number} year Năm
   */
  calculateSalaries: async (month, year) => {
    try {
      const res = await salaryService.calculateBarberSalaries?.(month, year);
      console.log("SalaryAPI.calculateSalaries trả về:", res);
      return res;
    } catch (error) {
      console.error("Lỗi SalaryAPI.calculateSalaries:", error);
      throw error;
    }
  },
};

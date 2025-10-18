// StatisticsAPI.js
import * as statisticsService from "~/services/statisticsService";

export const StatisticsAPI = {
  /**
   * Lấy doanh thu tất cả thợ
   * @param {Object} filter - { month, year, branchId }
   */
  getBarberRevenue: async (filter = {}) => {
    try {
      const res = await statisticsService.getBarberRevenue(filter);
      console.log("StatisticsAPI.getBarberRevenue trả về:", res);
      return res;
    } catch (error) {
      console.error("Lỗi StatisticsAPI.getBarberRevenue:", error);
      throw error;
    }
  },

  /**
   * Lấy tổng doanh thu từng tháng của các chi nhánh trong năm
   * @param {number} year
   */
  getMonthlyBranchRevenue: async (year) => {
    try {
      const res = await statisticsService.getMonthlyBranchRevenue(year);
      console.log("StatisticsAPI.getMonthlyBranchRevenue trả về:", res);
      return res;
    } catch (error) {
      console.error("Lỗi StatisticsAPI.getMonthlyBranchRevenue:", error);
      throw error;
    }
  },

  /**
   * Lấy toàn bộ số liệu dashboard
   * @param {Object} params - { month, year }
   */
  getDashboardOverview: async (params = {}) => {
    try {
      const res = await statisticsService.getDashboardOverview(params);
      console.log("StatisticsAPI.getDashboardOverview trả về:", res);
      return res;
    } catch (error) {
      console.error("Lỗi StatisticsAPI.getDashboardOverview:", error);
      throw error;
    }
  },
};

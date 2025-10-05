import * as bonusService from "~/services/bonusRuleService";

export const BonusRuleAPI = {
  // Tạo rule mới
  create: async (ruleData) => {
    try {
      const result = await bonusService.createBonusRule(ruleData);
      return result;
    } catch (error) {
      console.error("BonusRuleAPI.create lỗi:", error);
      throw error;
    }
  },

  // Lấy tất cả rule
  getAll: async () => {
    try {
      const result = await bonusService.getAllBonusRules();
      return result;
    } catch (error) {
      console.error("BonusRuleAPI.getAll lỗi:", error);
      throw error;
    }
  },

  // Lấy các rule đang active
  getActive: async () => {
    try {
      const result = await bonusService.getActiveBonusRules();
      return result;
    } catch (error) {
      console.error("BonusRuleAPI.getActive lỗi:", error);
      throw error;
    }
  },

  // Lấy rule theo id
  getById: async (id) => {
    try {
      const result = await bonusService.getBonusRuleById(id);
      return result;
    } catch (error) {
      console.error("BonusRuleAPI.getById lỗi:", error);
      throw error;
    }
  },

  // Cập nhật rule
  update: async (id, updateData) => {
    try {
      const result = await bonusService.updateBonusRule(id, updateData);
      return result;
    } catch (error) {
      console.error("BonusRuleAPI.update lỗi:", error);
      throw error;
    }
  },

  // Xoá rule
  delete: async (id) => {
    try {
      const result = await bonusService.deleteBonusRule(id);
      return result;
    } catch (error) {
      console.error("BonusRuleAPI.delete lỗi:", error);
      throw error;
    }
  },

  // Lấy rule áp dụng theo doanh thu
  getApplicable: async (revenue) => {
    try {
      const result = await bonusService.getApplicableBonusRule(revenue);
      return result;
    } catch (error) {
      console.error("BonusRuleAPI.getApplicable lỗi:", error);
      throw error;
    }
  }
};

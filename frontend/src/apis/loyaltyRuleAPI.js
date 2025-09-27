import * as loyaltyService from "~/services/loyaltyRuleService";

export const LoyaltyRuleAPI = {
  // Tạo rule mới
  create: async (ruleData) => {
    try {
      const result = await loyaltyService.createLoyaltyRule(ruleData);
      return result;
    } catch (error) {
      console.error("LoyaltyRuleAPI.create lỗi:", error);
      throw error;
    }
  },

  // Lấy tất cả rule
  getAll: async () => {
    try {
      const result = await loyaltyService.getAllLoyaltyRules();
      return result;
    } catch (error) {
      console.error("LoyaltyRuleAPI.getAll lỗi:", error);
      throw error;
    }
  },

  // Lấy rule mặc định
  getDefault: async () => {
    try {
      const result = await loyaltyService.getDefaultLoyaltyRule();
      return result;
    } catch (error) {
      console.error("LoyaltyRuleAPI.getDefault lỗi:", error);
      throw error;
    }
  },

  // Lấy các rule đang active
  getActive: async () => {
    try {
      const result = await loyaltyService.getActiveLoyaltyRules();
      return result;
    } catch (error) {
      console.error("LoyaltyRuleAPI.getActive lỗi:", error);
      throw error;
    }
  },

  // Lấy rule áp dụng hiện tại
  getApplicable: async () => {
    try {
      const result = await loyaltyService.getApplicableLoyaltyRule();
      return result;
    } catch (error) {
      console.error("LoyaltyRuleAPI.getApplicable lỗi:", error);
      throw error;
    }
  },

  // Lấy rule theo id
  getById: async (id) => {
    try {
      const result = await loyaltyService.getLoyaltyRuleById(id);
      return result;
    } catch (error) {
      console.error("LoyaltyRuleAPI.getById lỗi:", error);
      throw error;
    }
  },

  // Cập nhật rule
  update: async (id, updateData) => {
    try {
      const result = await loyaltyService.updateLoyaltyRule(id, updateData);
      return result;
    } catch (error) {
      console.error("LoyaltyRuleAPI.update lỗi:", error);
      throw error;
    }
  },

  // Xoá rule
  delete: async (id) => {
    try {
      const result = await loyaltyService.deleteLoyaltyRule(id);
      return result;
    } catch (error) {
      console.error("LoyaltyRuleAPI.delete lỗi:", error);
      throw error;
    }
  }
};

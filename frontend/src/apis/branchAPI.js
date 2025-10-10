import * as branchService from "~/services/branchService";

export const BranchAPI = {

  getAll: async () => {
    try {
      const result = await branchService.getAllBranches();
      return result;
    } catch (error) {
      console.error("BranchAPI.getAll lỗi:", error);
      throw error;
    }
  },
};

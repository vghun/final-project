import * as voucherService from "~/services/voucherService";

export const VoucherAPI = {
  create: async (voucherData) => {
    try {
      const result = await voucherService.createVoucher(voucherData);
      return result;
    } catch (error) {
      console.error("VoucherAPI.create lỗi:", error);
      throw error;
    }
  },
  getAll: async () => {
    try {
      const result = await voucherService.getAllVouchers();
      return result;
    } catch (error) {
      console.error("VoucherAPI.getAll lỗi:", error);
      throw error;
    }
  },

  // Sau này có thể thêm các API khác như update, delete, getAll...
};

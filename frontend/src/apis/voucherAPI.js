import * as voucherService from "~/services/voucherService";

export const VoucherAPI = {
  // Tạo voucher mới
  create: async (voucherData) => {
    try {
      const result = await voucherService.createVoucher(voucherData);
      return result;
    } catch (error) {
      console.error("VoucherAPI.create lỗi:", error);
      throw error;
    }
  },

  // Lấy tất cả voucher
  getAll: async () => {
    try {
      const result = await voucherService.getAllVouchers();
      return result;
    } catch (error) {
      console.error("VoucherAPI.getAll lỗi:", error);
      throw error;
    }
  },

  // Cập nhật voucher
  update: async (idVoucher, updateData) => {
    try {
      const result = await voucherService.updateVoucher(idVoucher, updateData);
      return result;
    } catch (error) {
      console.error("VoucherAPI.update lỗi:", error);
      throw error;
    }
  },

  // Soft delete voucher (chỉ set status = false)
  delete: async (idVoucher) => {
    try {
      const result = await voucherService.deleteVoucher(idVoucher);
      return result;
    } catch (error) {
      console.error("VoucherAPI.delete lỗi:", error);
      throw error;
    }
  }
};

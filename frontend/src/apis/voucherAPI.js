import * as voucherService from "~/services/voucherService";

export const VoucherAPI = {
  // CRUD
  create: async (voucherData) => voucherService.createVoucher(voucherData),
  getAll: async () => voucherService.getAllVouchers(),
  getById: async (idVoucher) => voucherService.getVoucherById(idVoucher),
  update: async (idVoucher, updateData) => voucherService.updateVoucher(idVoucher, updateData),
  delete: async (idVoucher) => voucherService.deleteVoucher(idVoucher),

  // Khách hàng
  getCustomerVouchers: async () => voucherService.getCustomerVouchers(),
  getAvailableVouchersByPoint: async () => voucherService.getAvailableVouchersByPoint(),
  exchangeVoucher: async (idVoucher) => voucherService.exchangeVoucher(idVoucher),
};

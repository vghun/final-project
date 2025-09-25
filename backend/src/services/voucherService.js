import db from "../models/index.js";

class VoucherService {
  async createVoucher(data) {
    try {
      const voucher = await db.Voucher.create({
        title: data.title,
        discountPercent: data.discountPercent,
        pointCost: data.pointCost,
        totalQuantity: data.totalQuantity,
        expiryDate: data.expiryDate,
        description: data.description,
      });
      return voucher;
    } catch (error) {
      throw new Error("Error creating voucher: " + error.message);
    }
  }

  async getAllVouchers() {
    return await db.Voucher.findAll();
  }

  async getVoucherById(idVoucher) {
    return await db.Voucher.findByPk(idVoucher);
  }
}

export default new VoucherService();

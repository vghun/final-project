import db from "../models/index.js";

class VoucherService {
  // Tạo voucher mới
  async createVoucher(data) {
    try {
      const voucher = await db.Voucher.create({
        title: data.title,
        discountPercent: data.discountPercent,
        pointCost: data.pointCost,
        totalQuantity: data.totalQuantity,
        expiryDate: data.expiryDate,
        description: data.description,
        status: true, // mặc định active
      });
      return voucher;
    } catch (error) {
      throw new Error("Error creating voucher: " + error.message);
    }
  }

  // Lấy tất cả voucher (chỉ active)
  async getAllVouchers() {
    return await db.Voucher.findAll({
      where: { status: true },
    });
  }

  // Lấy voucher theo id (chỉ active)
  async getVoucherById(idVoucher) {
    return await db.Voucher.findOne({
      where: { idVoucher, status: true },
    });
  }

  // Cập nhật voucher
  async updateVoucher(idVoucher, data) {
    const voucher = await db.Voucher.findByPk(idVoucher);
    if (!voucher) throw new Error("Voucher not found");

    return await voucher.update({
      title: data.title ?? voucher.title,
      discountPercent: data.discountPercent ?? voucher.discountPercent,
      pointCost: data.pointCost ?? voucher.pointCost,
      totalQuantity: data.totalQuantity ?? voucher.totalQuantity,
      expiryDate: data.expiryDate ?? voucher.expiryDate,
      description: data.description ?? voucher.description,
      status: data.status ?? voucher.status, // có thể update active/inactive
    });
  }

  // Xoá voucher (soft delete)
  async deleteVoucher(idVoucher) {
    const voucher = await db.Voucher.findByPk(idVoucher);
    if (!voucher) throw new Error("Voucher not found");

    return await voucher.update({ status: false });
  }
}

export default new VoucherService();

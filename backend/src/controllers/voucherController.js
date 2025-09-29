import voucherService from "../services/voucherService.js";

class VoucherController {
  async create(req, res) {
    try {
      const voucher = await voucherService.createVoucher(req.body);
      res.status(201).json({ success: true, data: voucher });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const vouchers = await voucherService.getAllVouchers();
      res.status(200).json({ success: true, data: vouchers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const voucher = await voucherService.getVoucherById(id);
      if (!voucher) {
        return res.status(404).json({ success: false, message: "Voucher not found" });
      }
      res.status(200).json({ success: true, data: voucher });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Cập nhật voucher
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedVoucher = await voucherService.updateVoucher(id, req.body);
      res.status(200).json({ success: true, data: updatedVoucher });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Xoá voucher (soft delete)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedVoucher = await voucherService.deleteVoucher(id);
      res.status(200).json({ success: true, data: deletedVoucher });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new VoucherController();

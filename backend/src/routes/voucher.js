import express from "express";
import voucherController from "../controllers/voucherController.js";

const router = express.Router();

// POST /api/vouchers - tạo voucher
router.post("/", voucherController.create);

// GET /api/vouchers - lấy tất cả voucher
router.get("/", voucherController.getAll);

// GET /api/vouchers/:id - lấy voucher theo id
router.get("/:id", voucherController.getById);

// PUT /api/vouchers/:id - cập nhật voucher
router.put("/:id", voucherController.update);

// DELETE /api/vouchers/:id - xoá voucher (soft delete)
router.delete("/:id", voucherController.delete);

export default router;

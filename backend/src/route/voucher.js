import express from "express";
import voucherController from "../controllers/voucherController.js";

const router = express.Router();

// POST /api/vouchers
router.post("/", voucherController.create);

// GET /api/vouchers
router.get("/", voucherController.getAll);

// GET /api/vouchers/:id
router.get("/:id", voucherController.getById);

export default router;

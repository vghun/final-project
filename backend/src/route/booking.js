import express from "express";
import { getBranches, getBranchDetails, createBooking } from "../controllers/bookingController.js";

const router = express.Router();

// Lấy tất cả chi nhánh
router.get("/branches", getBranches);

// Lấy chi tiết 1 chi nhánh (barber + dịch vụ)
router.get("/branches/:idBranch/details", getBranchDetails);

// Tạo booking
router.post("/", createBooking);

export default router;

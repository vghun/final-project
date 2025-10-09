import express from "express";
import { getBranches, getBranchDetails, createBooking, getBookingsByBarber } from "../controllers/bookingController.js";

const router = express.Router();

// Lấy tất cả chi nhánh
router.get("/branches", getBranches);

// Lấy chi tiết 1 chi nhánh (barber + dịch vụ)
router.get("/branches/:idBranch", getBranchDetails);

// Tạo booking
router.post("/create", createBooking);

// Lấy tất cả booking của 1 barber
router.get("/barbers/:idBarber", getBookingsByBarber);

export default router;

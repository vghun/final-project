import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import {
  getBranches,
  getBranchDetails,
  createBooking,
  completeBooking,
  getBookingsByBarber,
  upload,
  getAllBookingDetails,
  payBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// 🧾 Lấy tất cả chi nhánh
router.get("/branches", getBranches);

// 🧩 Lấy chi tiết 1 chi nhánh (barber + dịch vụ)
router.get("/branches/:idBranch", getBranchDetails);

// 🧑‍💼 Lấy tất cả booking của 1 barber (theo id)
router.get("/barbers/:idBarber", getBookingsByBarber);

router.get("/details", getAllBookingDetails);

router.put("/:idBooking/pay", payBooking);

// 📅 Lấy booking của barber theo ngày (tùy query start-end)
router.get("/barber", bookingController.getBookingsForBarber);

// ✅ Hoàn tất booking (upload ảnh 4 góc)
router.post(
  "/:id/complete",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "left", maxCount: 1 },
    { name: "right", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  completeBooking
);

// ✍️ Tạo booking mới
router.post("/create", createBooking);

export default router;

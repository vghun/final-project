import express from "express";
import * as bookingController from "../controllers/bookingController.js";

const router = express.Router();

// 🧾 Lấy tất cả chi nhánh
router.get("/branches", bookingController.getBranches);

// 🧩 Lấy chi tiết 1 chi nhánh (barber + dịch vụ)
router.get("/branches/:idBranch/details", bookingController.getBranchDetails);

// 🧑‍💼 Lấy tất cả booking của 1 barber (theo id)
router.get("/barbers/:idBarber", bookingController.getBookingsByBarber);

// 📅 Lấy booking của barber theo ngày (tùy query start-end)
router.get("/barber", bookingController.getBookingsForBarber);
router.get("/barbers/:idBarber/booked-slots", bookingController.getBookedSlotsByBarber);



// ✅ Hoàn tất booking (upload ảnh 4 góc)
router.post(
  "/:id/complete",
  bookingController.upload.fields([
    { name: "front", maxCount: 1 },
    { name: "left", maxCount: 1 },
    { name: "right", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  bookingController.completeBooking
);

// ✍️ Tạo booking mới
router.post("/create", bookingController.createBooking);

export default router;

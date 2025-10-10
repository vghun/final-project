import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { getBranches, getBranchDetails, createBooking, completeBooking, upload} from "../controllers/bookingController.js";


const router = express.Router();
// GET /api/bookings/barber?start=2025-10-06&end=2025-10-12
router.get("/barber", bookingController.getBookingsForBarber);

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

router.get("/branches", getBranches);

// Lấy chi tiết 1 chi nhánh (barber + dịch vụ)
router.get("/branches/:idBranch/details", getBranchDetails);

// Tạo booking
router.post("/", createBooking);

export default router;
// routes/statisticsRoutes.js
import express from "express";
import statisticsController from "../controllers/statisticsController.js";

const router = express.Router();

// Doanh thu tất cả thợ
// GET /statistics/barbers?month=..&year=..&branchId=..
router.get("/barbers", statisticsController.getBarberRevenue);

// Doanh thu theo chi nhánh


// Tổng doanh thu từng tháng của các chi nhánh trong năm
// GET /statistics/branches/monthly?year=..
router.get("/branches", statisticsController.getMonthlyBranchRevenue);

export default router;

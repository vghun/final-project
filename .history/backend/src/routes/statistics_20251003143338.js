import express from "express";
import * as statisticsController from "../controllers/statisticsController.js";

const router = express.Router();

// Nếu có endpoint thống kê hot (nếu bạn muốn)
router.get("/hot", statisticsController.getHot);

// Lấy thống kê theo id (hoặc branch, thợ,...)
router.get("/:id", statisticsController.getById);

// Lấy doanh thu chi nhánh theo tháng trong năm
router.get("/monthly-branch-revenue", statisticsController.getMonthlyBranchRevenue);

export default router;

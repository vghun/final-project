import express from "express";
import * as salaryController from "../controllers/salaryController.js";

const router = express.Router();
router.get("/", salaryController.getSalaries);

// router.post("/", calculateSalaries);

export default router;

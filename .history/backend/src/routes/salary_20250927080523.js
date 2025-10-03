import express from "express";
import { getSalaries } from "../controllers/salaryController.js";

const router = express.Router();
router.get("/", getSalaries);

// router.post("/", calculateSalaries);

export default router;

import express from "express";
import {
  getAllBarbers,
  syncBarbers,
  assignBarberToBranch,
  approveBarber,
  lockBarber,
} from "../controllers/barberController.js";

const router = express.Router();

// Các route
router.post("/", syncBarbers);
router.get("/", getAllBarbers);
router.post("/assign-branch", assignBarberToBranch);
router.post("/approve", approveBarber);
router.post("/lock", lockBarber);

export default router;

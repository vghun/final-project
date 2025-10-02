import express from "express";
import barberController from "../controllers/barberController.js";
import barber from "../models/barber.js";
import { assignBarberToBranch, approveBarber, lockBarber  } from "../controllers/barberController.js";

const router = express.Router();

router.post("/", barberController.syncBarbers);
router.get("/", barberController.getAllBarbers);
router.post("/assign-branch", assignBarberToBranch);
router.post("/approve", approveBarber);
router.post("/lock", lockBarber);
export default router;

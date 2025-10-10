import express from "express";
<<<<<<< HEAD
import barberController from "../controllers/barberController.js";
import barber from "../models/barber.js";
const router = express.Router();

router.post("/", barberController.syncBarbers);
router.get("/", barberController.getAllBarbers);
router.post("/assign-branch", barberController.assignBarberToBranch);
router.post("/approve", barberController.approveBarber);
router.post("/lock", barberController.lockBarber);
=======
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

>>>>>>> origin/main
export default router;

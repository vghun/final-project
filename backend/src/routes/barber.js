import express from "express";
import barberController from "../controllers/barberController.js";
const router = express.Router();

router.post("/", barberController.syncBarbers);
router.get("/", barberController.getAllBarbers);

router.post("/assign-user", barberController.assignUserAsBarber);
router.post("/assign-branch", barberController.assignBarberToBranch);
// router.post("/approve", barberController.approveBarber);
router.post("/lock", barberController.lockBarber);
router.post("/unlock", barberController.unlockBarber);
router.get("/reward/:idBarber", barberController.getBarberReward);

export default router;

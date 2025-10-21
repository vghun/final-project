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

router.post("/create", barberController.createBarberWithUser);
router.put("/update/:idBarber", barberController.updateBarber);
router.delete("/delete/:idBarber", barberController.deleteBarber);
router.post("/unavailability", barberController.addBarberUnavailability);
router.get("/unavailability/:idBarber", barberController.getBarberUnavailabilities);

export default router;

import express from "express";
import barberController from "../controllers/barberController.js";
import barber from "../models/barber.js";

const router = express.Router();

router.post("/", barberController.syncBarbers);
router.get("/", barberController.getAllBarbers);

export default router;

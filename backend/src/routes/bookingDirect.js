import express from "express";
import { findCustomerByPhone } from "../controllers/bookingDirectController.js";

const router = express.Router();

router.get("/find", findCustomerByPhone);

export default router;

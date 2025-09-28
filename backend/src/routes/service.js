import express from "express";
import * as serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.get("/hot", serviceController.getHot);
router.get("/:id", serviceController.getById);

export default router;

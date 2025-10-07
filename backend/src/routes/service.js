import express from "express";
import * as serviceController from "../controllers/serviceController.js";
import { 
  assignServiceToBranch,   
  createService,
  updateService,
  deleteService,
  getAllServices, } from "../controllers/serviceController.js";

const router = express.Router();

router.get("/hot", serviceController.getHot);
router.get("/:id", serviceController.getById);
router.post("/assign-branch", assignServiceToBranch);

router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);
router.get("/", getAllServices);
export default router;

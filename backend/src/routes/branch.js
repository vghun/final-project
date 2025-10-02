import express from "express";
import {
  createBranch,
  updateBranch,
  deleteBranch,
  toggleBranchStatus,
  getAllBranches,
} from "../controllers/branchController.js";

const router = express.Router();

router.post("/", createBranch);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);
router.patch("/:id/toggle", toggleBranchStatus);
router.get("/", getAllBranches);

export default router;
import express from "express";
import {
  createBranch,
  updateBranch,
  deleteBranch,
  toggleBranchStatus,
  getAllBranches,
  syncBranchesToPinecone,
  assignServiceToBranch,   
  unassignServiceFromBranch,
} from "../controllers/branchController.js";

const router = express.Router();

router.post("/", createBranch);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);
router.patch("/:id/toggle", toggleBranchStatus);
router.get("/", getAllBranches);
router.post("/sync-pinecone", syncBranchesToPinecone);
router.post("/assign-service", assignServiceToBranch);
router.delete("/unassign-service", unassignServiceFromBranch);
export default router;
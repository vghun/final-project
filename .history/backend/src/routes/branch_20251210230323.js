import express from "express";
import {
  createBranch,
  updateBranch,
  deleteBranch,
  getAllBranches,
  syncBranchesToPinecone,
} from "../controllers/branchController.js";

const router = express.Router();

router.post("/", createBranch);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);
router.get("/", getAllBranches);
router.post("/sync-pinecone", syncBranchesToPinecone);
export default router;
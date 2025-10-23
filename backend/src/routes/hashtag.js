import express from "express";
import { getHashtags } from "../controllers/hashtagController.js";

const router = express.Router();

router.get("/", getHashtags);

export default router;

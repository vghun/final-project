import express from "express";
import * as reelController from "../controllers/reelController.js";
import { uploadReel } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ✅ Search reels phải đặt trước /:id
router.get("/search", reelController.searchReels);

// Danh sách reels
router.get("/", reelController.getAll);

// Upload video
router.post(
  "/upload",
  uploadReel.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  reelController.uploadReel
);

// Ghi nhận lượt xem (POST vì nó thay đổi DB)
router.post("/:id/view", reelController.trackView);

// Like / Unlike reel
router.post("/:id/like", reelController.toggleLike);

// Lấy chi tiết reel (Phải đặt cuối để tránh :id bắt lấy 'search')
router.get("/:id", reelController.getById);

export default router;

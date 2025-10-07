import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import db from "../models/index.js";

const router = express.Router();

// Lấy danh sách reels
// Lấy danh sách reels
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, idUser } = req.query;

    const reels = await db.Reel.findAll({
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
      include: [
        { model: db.ReelLike, as: "ReelLikes", attributes: ["idUser"] },
        { model: db.ReelComment, as: "ReelComments", attributes: ["idComment"] },
      ],
    });

    const result = reels.map((r) => {
      const plain = r.get({ plain: true });
      return {
        ...plain,
        likesCount: plain.ReelLikes.length,
        commentsCount: plain.ReelComments.length,
        isLiked: idUser ? plain.ReelLikes.some((like) => like.idUser == idUser) : false,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể lấy reels" });
  }
});


// Upload video
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith("video/")) {
      return { folder: "reels", resource_type: "video" };
    }
    return { folder: "reels/thumbnails", resource_type: "image" };
  },
});
const upload = multer({ storage });

router.post(
  "/upload",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, idBarber } = req.body;
      const videoFile = req.files["video"]?.[0];
      const thumbnailFile = req.files["thumbnail"]?.[0];

      if (!videoFile) {
        return res.status(400).json({ error: "Cần upload video" });
      }

      let thumbnailUrl = null;
      if (thumbnailFile) {
        thumbnailUrl = thumbnailFile.path;
      } else {
        // tự sinh thumb từ video
        thumbnailUrl = videoFile.path.replace("/upload/", "/upload/so_1/").replace(/\.mp4$/, ".jpg");
      }

      const newReel = await db.Reel.create({
        idBarber,
        title,
        description,
        url: videoFile.path,
        thumbnail: thumbnailUrl,
        viewCount: 0,
      });

      res.json(newReel);
    } catch (err) {
      console.error("Upload reel lỗi:", err);
      res.status(500).json({ error: "Upload reel thất bại" });
    }
  }
);

// Lấy chi tiết 1 reel
// Lấy chi tiết 1 reel
router.get("/:id", async (req, res) => {
  try {
    const { idUser } = req.query;

    const reel = await db.Reel.findByPk(req.params.id, {
      include: [
        { model: db.ReelComment, as: "ReelComments" },
        { model: db.ReelLike, as: "ReelLikes", attributes: ["idUser"] },
      ],
    });

    if (!reel) return res.status(404).json({ error: "Không tìm thấy reel" });

    const plain = reel.get({ plain: true });

    res.json({
      ...plain,
      likesCount: plain.ReelLikes.length,
      commentsCount: plain.ReelComments.length,
      isLiked: idUser ? plain.ReelLikes.some((like) => like.idUser == idUser) : false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy chi tiết reel" });
  }
});


// Like / Unlike reel
router.post("/:id/like", async (req, res) => {
  try {
    const { idUser } = req.body;
    const idReel = req.params.id;

    const existing = await db.ReelLike.findOne({ where: { idReel, idUser } });
    if (existing) {
      await existing.destroy();
    } else {
      await db.ReelLike.create({ idReel, idUser });
    }

    // Đếm lại
    const count = await db.ReelLike.count({ where: { idReel } });

    res.json({
      liked: !existing,
      likesCount: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi like/unlike" });
  }
});


export default router;

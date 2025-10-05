import express from "express";
import db from "../models/index.js";

const router = express.Router();

// GET /api/reels/:id/comments
router.get("/:id/comments", async (req, res) => {
  try {
    const idReel = req.params.id;
    const comments = await db.ReelComment.findAll({
      where: { idReel },
      include: [
        {
          model: db.User,
          attributes: ["idUser", "fullName", "image"], // chỉ lấy trường cần
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(comments);
  } catch (err) {
    console.error("Lỗi lấy comment:", err);
    res.status(500).json({ error: "Không thể lấy comment" });
  }
});


// Thêm comment mới
router.post("/:id/comment", async (req, res) => {
  try {
    const { idUser, content } = req.body;
    const idReel = req.params.id;

    const comment = await db.ReelComment.create({
      idReel,
      idUser,
      content,
      parentCommentId: null,
    });

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi tạo comment" });
  }
});

// Thêm reply cho comment
router.post("/comment/:id/reply", async (req, res) => {
  try {
    const { idUser, content } = req.body;
    const parentCommentId = req.params.id;

    const parent = await db.ReelComment.findByPk(parentCommentId);
    if (!parent) return res.status(404).json({ error: "Comment không tồn tại" });

    const reply = await db.ReelComment.create({
      idReel: parent.idReel,
      idUser,
      content,
      parentCommentId,
    });

    res.json(reply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi tạo reply" });
  }
});

// Sửa comment/reply
router.put("/comment/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await db.ReelComment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: "Không tìm thấy comment" });

    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi sửa comment" });
  }
});

// Xoá comment/reply
router.delete("/comment/:id", async (req, res) => {
  try {
    const comment = await db.ReelComment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: "Không tìm thấy comment" });

    await comment.destroy();
    res.json({ message: "Đã xoá comment/reply" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi xoá comment/reply" });
  }
});

export default router;

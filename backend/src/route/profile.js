import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { getUserProfile, updateUserProfile } from "../services/profileService.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.put("/", authenticate, upload.single("avatar"), async (req, res) => {
  try {
    const { fullName, email, phoneNumber } = req.body;
    const avatarFile = req.file;

    const user = await updateUserProfile(req.user.id, { fullName, email, phoneNumber, avatarFile });
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    res.json({ user });
  } catch (err) {
    console.error("Lỗi update profile:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;

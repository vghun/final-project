import * as profileService from "../services/profileService.js";

const getProfile = async (req, res) => {
  try {
    const user = await profileService.getUserProfile(req.user.id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber } = req.body;
    const avatarFile = req.file;

    const user = await profileService.updateUserProfile(req.user.id, { fullName, email, phoneNumber, avatarFile });
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export default {
  getProfile,
  updateProfile
};

import profileService from "../services/profileService.js";

const getProfile = async (req, res) => {
  try {
    console.log("Authorization Header:", req.headers.authorization); // check token
    console.log("req.user:", req.user); // check middleware decode

    const { idUser, role } = req.user || {};
    if (!idUser) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu idUser" });
    }

    const user = await profileService.getUserProfileWithRole(idUser);
    console.log("User from DB:", user);

    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    const plain = user.get({ plain: true });

    // Nếu role là customer mà chưa có bản ghi customer
    if (role === "customer" && !plain.customer) {
      return res.status(404).json({ message: "Thông tin customer chưa được tạo" });
    }
    // Nếu role là barber mà chưa có bản ghi barber
    if (role === "barber" && !plain.barber) {
      return res.status(404).json({ message: "Thông tin barber chưa được tạo" });
    }

    const profile = {
      idUser: plain.idUser,
      email: plain.email,
      fullName: plain.fullName,
      phoneNumber: plain.phoneNumber,
      image: plain.image,
      role: plain.role,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
      profileDetail:
        role === "customer" ? plain.customer : role === "barber" ? plain.barber : null,
    };

    return res.json({ profile });
  } catch (err) {
    console.error("Lỗi getProfile:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { idUser } = req.user || {};
    if (!idUser) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu idUser" });
    }

    const user = await profileService.updateUserProfile(idUser, {
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      avatarFile: req.file,
    });
    console.log("Updated user:", user);

    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    const { password, ...userData } = user.dataValues;
    res.json({ user: userData });
  } catch (err) {
    console.error("Lỗi updateProfile:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export default {
  getProfile,
  updateProfile,
};

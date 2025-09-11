import db from "../models/index.js";
import cloudinary from "../config/cloudinary.js";

// Lấy profile
export const getUserProfile = async (userId) => {
  const user = await db.User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  return user;
};

// Hàm upload buffer lên Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Cập nhật profile
export const updateUserProfile = async (userId, { fullName, email, phoneNumber, avatarFile }) => {
  const user = await db.User.findByPk(userId);
  if (!user) return null;

  let imageUrl = user.image; // đổi avatar -> image

  if (avatarFile) {
    const uploadResult = await uploadToCloudinary(avatarFile.buffer);
    imageUrl = uploadResult.secure_url;
  }

  await user.update({ fullName, email, phoneNumber, image: imageUrl }); // update trường image
  return user;
};

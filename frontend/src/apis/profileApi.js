import * as profileService from "~/services/userService";

export const ProfileAPI = {
  // Lấy thông tin profile
  getProfile: async (token) => {
    try {
      const res = await profileService.getProfile(token);
      console.log("ProfileAPI.getProfile trả về:", res);
      return res; // res đã là res.data từ userService
    } catch (error) {
      console.error("Lỗi ProfileAPI.getProfile:", error);
      throw error;
    }
  },

  // Cập nhật thông tin profile
  updateProfile: async (token, data) => {
    try {
      const res = await profileService.updateProfile(token, data);
      console.log("ProfileAPI.updateProfile trả về:", res);
      return res; // res đã là res.data từ userService
    } catch (error) {
      console.error("Lỗi ProfileAPI.updateProfile:", error);
      throw error;
    }
  },
};

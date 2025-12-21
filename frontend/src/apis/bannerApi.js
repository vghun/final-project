// src/apis/bannerApi.js
import axios from "axios";

const API_URL = "http://localhost:8088/api/banners"; // Route mới

const bannerApi = {
  /**
   * Public - Lấy banner active cho Home
   */
  getActiveBanners: () => axios.get(API_URL),

  /**
   * Admin - Tạo banner mới
   */
  createBanner: (formData, token) =>
    axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default bannerApi;
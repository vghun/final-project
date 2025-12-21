// src/apis/notificationApi.js
import axios from "axios";

const API_URL = "http://localhost:8088/api/notifications";

const notificationApi = {
  /**
   * Lấy thông báo của user hiện tại
   */
  getMyNotifications: (token) =>
    axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  /**
   * Đánh dấu đã đọc
   */
  markAsRead: (id, token) =>
    axios.put(`${API_URL}/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default notificationApi;
import axios from "axios";

// Tạo instance axios
const request = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Log baseURL để kiểm tra
console.log("Axios baseURL:", request.defaults.baseURL);

// === Interceptor Request: Gắn accessToken vào header ===
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Interceptor Response: Xử lý 401 (token hết hạn) ===
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lấy refreshToken từ localStorage
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("NO_REFRESH_TOKEN");
        }

        // Gọi API refresh token
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // Lưu lại accessToken mới
        localStorage.setItem("accessToken", newAccessToken);

        // Gắn token mới vào header và retry request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return request(originalRequest);
      } catch (err) {
        // Nếu refresh fail → logout user
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Wrapper GET
export const get = async (url, options = {}) => {
  const res = await request.get(url, options);
  return res.data;
};

// Wrapper POST
export const post = async (url, data = {}, options = {}) => {
  const res = await request.post(url, data, options);
  return res.data;
};

// Wrapper PUT
export const put = async (url, data = {}, options = {}) => {
  const res = await request.put(url, data, options);
  return res.data;
};

// Wrapper DELETE
export const del = async (url, options = {}) => {
  const res = await request.delete(url, options);
  return res.data;
};

export default request;

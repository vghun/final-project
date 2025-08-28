import * as request from "~/apis/configs/httpRequest";
// Đăng nhập
export const login = async ({ email, password }) => {
  try {
    const res = await request.post("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
// Gửi OTP khi đăng ký
export const register = async ({ name, email, password }) => {
  try {
    const res = await request.post("/register", { name, email, password });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Xác thực OTP và tạo user
export const verifyOtp = async ({ email, otp }) => {
  try {
    const res = await request.post("/verify-otp", { email, otp });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Quên mật khẩu → gửi OTP
export const forgotPassword = async ({ email }) => {
  try {
    const res = await request.post("/forgot-password", { email });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Xác thực OTP quên mật khẩu
export const verifyForgotOtp = async ({ email, otp }) => {
  try {
    const res = await request.post("/verify-forgot-otp", { email, otp });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Đặt lại mật khẩu mới
export const resetPassword = async ({ email, newPassword }) => {
  try {
    const res = await request.post("/reset-password", { email, newPassword });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

import * as request from "~/apis/configs/httpRequest";
// Đăng nhập
export const login = async ({ email, password }) => {
  try {
    const res = await request.post("/login", { email, password });
    console.log("API login trả về:", res); 
    return res; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Gửi OTP khi đăng ký
export const register = async ({ fullName, email, password, phoneNumber }) => {
  try {
    const payload = { fullName, email, password, phoneNumber };
    console.log("Register payload gửi xuống backend:", payload);

    const res = await request.post("/register", payload);
    return res; // 
  } catch (error) {
    console.error("Lỗi khi gọi API register:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Xác thực OTP và tạo user
export const verifyOtp = async ({ email, otp }) => {
  try {
    const res = await request.post("/verify-otp", { email, otp });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Quên mật khẩu → gửi OTP
export const forgotPassword = async ({ email }) => {
  try {
    const res = await request.post("/forgot-password", { email });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Xác thực OTP quên mật khẩu
export const verifyForgotOtp = async ({ email, otp }) => {
  try {
    const res = await request.post("/verify-forgot-otp", { email, otp });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Đặt lại mật khẩu mới
export const resetPassword = async ({ email, newPassword }) => {
  try {
    const res = await request.post("/reset-password", { email, newPassword });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

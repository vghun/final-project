import * as request from "~/apis/configs/httpRequest";

// Đăng nhập
export const login = async ({ email, password }) => {
  try {
    const res = await request.post("/auth/login", { email, password });
    console.log("API login trả về:", res);
    return res;
  } catch (error) {
    throw error;
  }
};

// Gửi OTP khi đăng ký
export const register = async ({ fullName, email, phoneNumber, password, confirmPassword }) => {
  try {
    // 1️⃣ Validate dữ liệu trước khi gửi xuống backend
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    // 2️⃣ Email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email không hợp lệ");
    }

    // 3️⃣ Số điện thoại hợp lệ (10-15 số)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    // 4️⃣ Password trùng confirmPassword
    if (password !== confirmPassword) {
      throw new Error("Mật khẩu và xác nhận mật khẩu không khớp");
    }

    // ✅ Chuẩn bị payload gửi xuống API (chỉ gửi 1 password)
    const payload = { fullName, email, phoneNumber, password };
    console.log("Register payload gửi xuống backend:", payload);

    // 5️⃣ Gọi API
    const res = await request.post("/auth/register", payload);
    return res;

  }catch (error) {
  console.error("Lỗi khi gọi API register:", error.response?.data || error.message);
  const message = error.response?.data?.error || error.message;
  throw message;
}
};
// Xác thực OTP và tạo user
export const verifyOtp = async ({ email, otp }) => {
  try {
    const res = await request.post("/auth/verify-otp", { email, otp });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Quên mật khẩu → gửi OTP
export const forgotPassword = async ({ email }) => {
  try {
    const res = await request.post("/auth/forgot-password", { email });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Xác thực OTP quên mật khẩu
export const verifyForgotOtp = async ({ email, otp }) => {
  try {
    const res = await request.post("/auth/verify-forgot-otp", { email, otp });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Đặt lại mật khẩu mới
export const resetPassword = async ({ email, newPassword }) => {
  try {
    const res = await request.post("/auth/reset-password", {
      email,
      newPassword,
    });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Refresh token
export const refreshToken = async ({ refreshToken }) => {
  try {
    const res = await request.post("/auth/refresh", { refreshToken });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout
export const logout = async ({ refreshToken }) => {
  try {
    const res = await request.post("/auth/logout", { refreshToken });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

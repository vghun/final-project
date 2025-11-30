import * as otpService from "../services/userService.js";

// Đăng ký - gửi OTP
const register = async (req, res) => {
  try {
    console.log("Register request body:", req.body);

    const result = await otpService.sendOtpForRegister(req.body);

    console.log(`OTP đã gửi đến ${req.body.email}`);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi register:", err.message);
    return res.status(400).json({ error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const newUser = await otpService.verifyOtpAndCreateUser(email, otp);
    return res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await otpService.sendOtpForForgotPassword(email);
    return res.status(200).json({ message: "OTP đã gửi, vui lòng xác nhận" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Verify OTP quên mật khẩu (chưa đổi pass)
const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await otpService.verifyOtpForForgotPassword(email, otp);
    return res.status(200).json({ message: "OTP xác thực thành công, bạn có thể đặt lại mật khẩu" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Đặt lại mật khẩu mới
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    await otpService.resetPassword(email, newPassword);
    return res.status(200).json({ message: "Mật khẩu đã được cập nhật" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
export const createUser = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;
    console.log("BODY RECEIVED:", req.body);
    const newUser = await otpService.createUserService(fullName, phoneNumber );

    return res.status(201).json({
      success: true,
      message: "Tạo khách hàng thành công",
      idCustomer: newUser.idUser,
      fullName: newUser.fullName,
      phoneNumber: newUser.phoneNumber,
    });
  } catch (error) {
    console.error("Lỗi tạo user:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

export default {
  register,
  verifyOtp,
  forgotPassword,
  verifyForgotOtp,
  resetPassword,
  createUser
};

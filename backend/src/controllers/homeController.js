import * as otpService from "../services/CRUDService.js";

// Đăng ký - gửi OTP
const register = async (req, res) => {
  try {
    await otpService.sendOtpForRegister(req.body);
    return res.status(200).json({ message: "OTP đã được gửi, vui lòng xác nhận" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Xác thực OTP
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

export default {
  register,
  verifyOtp,
  forgotPassword,
  verifyForgotOtp,
  resetPassword
};

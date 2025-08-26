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

export default {
  register,
  verifyOtp,
};

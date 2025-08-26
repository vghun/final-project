import bcrypt from "bcryptjs";
import db from "../models/index.js";
import { sendOtpEmail } from "./mailService.js"; // import hàm gửi mail

const salt = bcrypt.genSaltSync(10);

// Biến static để lưu OTP và user tạm
// Key: email, Value: { otp, user, expiresAt }
const otpStore = {};

// Hàm hash password
async function hashUserPassword(password) {
  return bcrypt.hash(password, salt);
}

// Gửi OTP và lưu user tạm
export async function sendOtpForRegister(data) {
  const { email, password, fullName, phoneNumber } = data;

  // Sinh OTP ngẫu nhiên 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash mật khẩu
  const hashPassword = await hashUserPassword(password);

  // Lưu user tạm kèm OTP, timeout 5 phút
  otpStore[email] = {
    otp,
    user: {
      email,
      password: hashPassword,
      fullName,
      phoneNumber,
      isVerified: false,
      role: "customer",
    },
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 phút
  };

  // Gửi OTP qua email
  await sendOtpEmail(email, otp);
}

// Xác thực OTP và tạo user
export async function verifyOtpAndCreateUser(email, otp) {
  const record = otpStore[email];
  if (!record) {
    throw new Error("OTP hết hạn hoặc không tồn tại");
  }

  // Check hết hạn
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    throw new Error("OTP đã hết hạn");
  }

  // Check OTP
  if (otp !== record.otp) {
    throw new Error("OTP không chính xác");
  }

  // Tạo user trong DB
  const newUser = await db.User.create({
    ...record.user,
    isVerified: true,
  });

  // Xóa khỏi store sau khi đã đăng ký thành công
  delete otpStore[email];

  return newUser;
}

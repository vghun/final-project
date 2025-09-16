import bcrypt from "bcryptjs";
import db from "../models/index.js";
import { sendOtpEmail } from "./mailService.js"; // import hàm gửi mail

const salt = bcrypt.genSaltSync(10);

// Biến static để lưu OTP và user tạm
// Key: email, Value: { otp, user, expiresAt, purpose, verified }
const otpStore = {};

// Hàm hash password
async function hashUserPassword(password) {
  return bcrypt.hash(password, salt);
}

//ĐĂNG KÝ 
export async function sendOtpForRegister(data) {
  const { email, password, fullName, phoneNumber } = data;

  if (!email || !password || !fullName || !phoneNumber) {
    throw new Error("Thiếu thông tin bắt buộc (email, password, fullName, phoneNumber)");
  }

  const existingEmail = await db.User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error("Email đã tồn tại trong hệ thống");
  }
  const existingPhone = await db.User.findOne({ where: { phoneNumber } });
  if (existingPhone) {
    throw new Error("Số điện thoại đã tồn tại trong hệ thống");
  }

  // Sinh OTP ngẫu nhiên 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash mật khẩu
  const hashPassword = await hashUserPassword(password);

  // Lưu user tạm kèm OTP (timeout 5 phút)
  otpStore[email] = {
    otp,
    user: {
      email,
      password: hashPassword,
      fullName,
      phoneNumber,
      isStatus: false,
      role: "customer",
    },
    purpose: "register",
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 phút
  };

  try {
    await sendOtpEmail(email, otp);
    return { message: "OTP đã được gửi tới email của bạn" };
  } catch (error) {
    delete otpStore[email];
    throw new Error("Không thể gửi OTP, vui lòng thử lại");
  }
}

// Xác thực OTP và tạo user
export async function verifyOtpAndCreateUser(email, otp) {
  const record = otpStore[email];
  if (!record || record.purpose !== "register") {
    throw new Error("OTP hết hạn hoặc không tồn tại");
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    throw new Error("OTP đã hết hạn");
  }

  if (otp !== record.otp) {
    throw new Error("OTP không chính xác");
  }

  try {
    const newUser = await db.User.create({
      ...record.user,
      isStatus: true,
    });
    delete otpStore[email];
    return newUser;
  } catch (error) {
    console.error("Lỗi khi tạo user:", error);
    throw new Error("Không thể tạo tài khoản, vui lòng thử lại");
  }
}


// Gửi OTP cho forgot password
export async function sendOtpForForgotPassword(email) {
  const user = await db.User.findOne({ where: { email } });
  if (!user) throw new Error("Email không tồn tại trong hệ thống");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp,
    purpose: "forgotPassword",
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 phút
  };

  try {
    await sendOtpEmail(email, otp);
    return { message: "OTP đã gửi đến email của bạn" };
  } catch (error) {
    delete otpStore[email];
    throw new Error("Không thể gửi OTP, vui lòng thử lại");
  }
}

// Verify OTP quên mật khẩu
export async function verifyOtpForForgotPassword(email, otp) {
  const record = otpStore[email];
  if (!record || record.purpose !== "forgotPassword") {
    throw new Error("OTP không hợp lệ hoặc đã hết hạn");
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    throw new Error("OTP đã hết hạn");
  }

  if (otp !== record.otp) {
    throw new Error("OTP không chính xác");
  }

  record.verified = true;

  return { message: "OTP chính xác, bạn có thể đặt lại mật khẩu" };
}

// Đặt lại mật khẩu mới
export async function resetPassword(email, newPassword) {
  const record = otpStore[email];
  if (!record || !record.verified || record.purpose !== "forgotPassword") {
    throw new Error("Bạn chưa xác thực OTP để đổi mật khẩu");
  }

  const hashPassword = await hashUserPassword(newPassword);

  await db.User.update(
    { password: hashPassword },
    { where: { email } }
  );

  // Xóa OTP khỏi store sau khi đổi pass
  delete otpStore[email];

  return { message: "Đổi mật khẩu thành công" };
}

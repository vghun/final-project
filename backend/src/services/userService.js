// services/authService.js
import bcrypt from "bcryptjs";
import db from "../models/index.js";
import { sendOtpEmail } from "./mailService.js"; // hàm gửi mail của bạn

const salt = bcrypt.genSaltSync(10);

// In-memory OTP store (simple). Key = email
const otpStore = {};

// Hash password
async function hashUserPassword(password) {
  return bcrypt.hash(password, salt);
}

// Gửi OTP cho đăng ký (chỉ dành cho đăng ký customer)
export async function sendOtpForRegister(data) {
  const { email, password, fullName, phoneNumber } = data;

  if (!email || !password || !fullName || !phoneNumber) {
    throw new Error(
      "Thiếu thông tin bắt buộc (email, password, fullName, phoneNumber)"
    );
  }

  // Kiểm tra tồn tại email/phone
  const existingEmail = await db.User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error("Email đã tồn tại trong hệ thống");
  }
  const existingPhone = await db.User.findOne({ where: { phoneNumber } });
  if (existingPhone) {
    throw new Error("Số điện thoại đã tồn tại trong hệ thống");
  }

  // Sinh OTP 6 chữ số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashPassword = await hashUserPassword(password);

  // Lưu tạm user + OTP (mặc định role = customer vì đăng ký public là customer)
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
    verified: false,
  };

  try {
    await sendOtpEmail(email, otp);
    return { message: "OTP đã được gửi tới email của bạn" };
  } catch (error) {
    delete otpStore[email];
    throw new Error("Không thể gửi OTP, vui lòng thử lại");
  }
}

// Xác thực OTP và tạo user kèm bảng con (customers)
// Dùng transaction để đảm bảo atomic
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

  // Bắt đầu transaction
  const t = await db.sequelize.transaction();
  try {
    // Tạo user
    const newUser = await db.User.create(
      {
        ...record.user,
        isStatus: true, // sau khi verify thì active
      },
      { transaction: t }
    );

    // Nếu role = customer (flow đăng ký hiện tại), tạo record customers
    if (newUser.role === "customer") {
      await db.Customer.create(
        {
          idCustomer: newUser.idUser, // idCustomer = idUser
          // loyaltyPoint, address dùng default (nếu muốn set thêm thì thêm ở đây)
        },
        { transaction: t }
      );
    }

    // Nếu bạn muốn hỗ trợ tạo barber (ví dụ admin tạo), có thể thêm điều kiện tương tự:
    // if (newUser.role === "barber") {
    //   await db.Barber.create({ idBarber: newUser.idUser }, { transaction: t });
    // }

    await t.commit();

    // Xóa OTP sau khi tạo thành công
    delete otpStore[email];

    return newUser;
  } catch (error) {
    await t.rollback();
    console.error("Lỗi khi tạo user + customer:", error);

    // Nếu là lỗi ràng buộc unique, tùy biến message
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error("Email hoặc số điện thoại đã tồn tại (unique constraint).");
    }

    throw new Error("Không thể tạo tài khoản, vui lòng thử lại");
  }
}

// --- Forgot password flow (giữ y nguyên, chỉ chút cleanup) ---

export async function sendOtpForForgotPassword(email) {
  const user = await db.User.findOne({ where: { email } });
  if (!user) throw new Error("Email không tồn tại trong hệ thống");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp,
    purpose: "forgotPassword",
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 phút
    verified: false,
  };

  try {
    await sendOtpEmail(email, otp);
    return { message: "OTP đã gửi đến email của bạn" };
  } catch (error) {
    delete otpStore[email];
    throw new Error("Không thể gửi OTP, vui lòng thử lại");
  }
}

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

export async function resetPassword(email, newPassword) {
  const record = otpStore[email];
  if (!record || !record.verified || record.purpose !== "forgotPassword") {
    throw new Error("Bạn chưa xác thực OTP để đổi mật khẩu");
  }

  const hashPassword = await hashUserPassword(newPassword);

  await db.User.update({ password: hashPassword }, { where: { email } });

  delete otpStore[email];
  return { message: "Đổi mật khẩu thành công" };
}

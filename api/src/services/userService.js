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

  let errorMessage = null;

  // Kiểm tra thiếu field
  if (!email || !password || !fullName || !phoneNumber) {
    errorMessage = "Thiếu thông tin bắt buộc (email, password, fullName, phoneNumber)";
  }

  // Kiểm tra email đã tồn tại
  const existingEmail = await db.User.findOne({ where: { email } });
  if (existingEmail) {
    errorMessage = "Email đã tồn tại trong hệ thống";
  }

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  // Sinh OTP 6 chữ số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Lưu tạm user + OTP
  otpStore[email] = {
    otp,
    user: { email, password, fullName, phoneNumber, isStatus: false, role: "customer" },
    purpose: "register",
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 phút
    verified: false,
  };

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
   if (!errorMessage) {
      errorMessage = "Không thể gửi OTP, vui lòng thử lại";
    }
  }

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return { message: "OTP đã được gửi tới email của bạn" };
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

  const t = await db.sequelize.transaction();
  try {
    // Kiểm tra user đã tồn tại theo email hoặc phoneNumber
    let user = await db.User.findOne({
      where: {
        // ưu tiên tìm theo email, nếu email null thì theo phone
        [db.Sequelize.Op.or]: [
          { email: record.user.email },
          { phoneNumber: record.user.phoneNumber },
        ],
      },
      transaction: t,
    });

    if (user) {
      // User đã tồn tại, cập nhật các field còn thiếu
      const updateData = {};
      if (record.user.fullName && !user.fullName) updateData.fullName = record.user.fullName;
      if (record.user.email && !user.email) updateData.email = record.user.email;
      if (record.user.password) updateData.password = await hashUserPassword(record.user.password);
      if (!user.isStatus) updateData.isStatus = true;

      if (Object.keys(updateData).length > 0) {
        await user.update(updateData, { transaction: t });
      }
    } else {
      // User chưa tồn tại → tạo mới
      user = await db.User.create(
        {
          ...record.user,
          password: await hashUserPassword(record.user.password),
          isStatus: true,
        },
        { transaction: t }
      );
    }

    // Nếu role = customer và chưa có record trong table Customer → tạo
    if (user.role === "customer") {
      const existingCustomer = await db.Customer.findOne({
        where: { idCustomer: user.idUser },
        transaction: t,
      });

      if (!existingCustomer) {
        await db.Customer.create(
          { idCustomer: user.idUser },
          { transaction: t }
        );
      }
    }

    await t.commit();
    delete otpStore[email];
    console.log("Password plaintext:", record.user.password);
    return user;
  } catch (error) {
    await t.rollback();
    console.error("Lỗi khi verify OTP và tạo user:", error);

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
export async function createUserService(fullName, phoneNumber) {
  if (!fullName || !phoneNumber) {
    throw new Error("Vui lòng cung cấp họ tên và số điện thoại");
  }

  // Kiểm tra số điện thoại đã tồn tại chưa
  const existingUser = await db.User.findOne({ where: { phoneNumber } });
  if (existingUser) {
    throw new Error("Số điện thoại đã được sử dụng");
  }

  // Sinh password tạm (hash 123456)
  const passwordHash = await bcrypt.hash("123456", 10);

  // Tạo user
  const newUser = await db.User.create({
    fullName,
    phoneNumber,
    password: passwordHash,
    role: "customer",
    isStatus: false,
    email: null,
  });

  // Tạo customer tương ứng
  const newCustomer = await db.Customer.create({
    idCustomer: newUser.idUser,
    loyaltyPoint: 0,
    address: null,
  });

  // Trả về cả thông tin user và customer
  return newUser;
}
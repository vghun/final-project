import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import redisClient from "../config/redis.js";

const User = db.User;
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);

class AuthService {
  // LOGIN
  static async login(email, password) {
    if (!email || !password) {
      throw { status: 400, message: "Email và password là bắt buộc." };
    }

    const user = await User.findOne({ where: { email } });
    if (!user) throw { status: 401, message: "Email hoặc mật khẩu không đúng." };

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw { status: 401, message: "Email hoặc mật khẩu không đúng." };
    
    if (user.role === "barber") {
      const Barber = db.Barber; // lấy model Barber
      const barber = await Barber.findOne({ where: { idBarber: user.idUser } });
      if (barber && Number(barber.isLocked) === 1) {
        throw {
          status: 403,
          message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý để mở lại.",
        };
      }
    }
    // Payload token dùng idUser
    const payload = { idUser: user.idUser, email: user.email, role: user.role };

    // Access Token & Refresh Token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    // Lưu refreshToken vào Redis với idUser
    await redisClient.set(`refresh:${user.idUser}`, refreshToken, "EX", 7 * 24 * 60 * 60);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1h
      user: {
        idUser: user.idUser,
        fullName: user.fullName,
        email: user.email,
        image: user.image || null,
        role: user.role,
      },
    };
  }
  
  // REFRESH TOKEN
  static async refresh(refreshToken) {
    if (!refreshToken) throw { status: 401, message: "NO_REFRESH_TOKEN" };

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Kiểm tra token trong Redis với idUser
      const savedToken = await redisClient.get(`refresh:${decoded.idUser}`);
      if (!savedToken || savedToken !== refreshToken) {
        throw { status: 403, message: "INVALID_REFRESH_TOKEN" };
      }

      // Sinh Access Token mới
      const newAccessToken = jwt.sign(
        { idUser: decoded.idUser, email: decoded.email, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { accessToken: newAccessToken, expiresIn: 3600, role: decoded.role };
    } catch (err) {
      throw { status: 403, message: "INVALID_REFRESH_TOKEN" };
    }
  }

  // LOGOUT
  static async logout(refreshToken) {
    if (!refreshToken) throw { status: 400, message: "No refresh token provided" };

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await redisClient.del(`refresh:${decoded.idUser}`);
      return { message: "Logout thành công" };
    } catch (err) {
      throw { status: 400, message: "Invalid refresh token" };
    }
  }
}

export default AuthService;

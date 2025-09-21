import express from "express";
import userController from "../controllers/userController.js"; // controller cho đăng ký & OTP
import authController from "../controllers/authController.js"; // controller cho login
import { authenticate, authorize } from "../middlewares/authMiddleware.js"; // middleware JWT

let router = express.Router();

const authRoutes = (app) => {
  // ========== AUTH ==========

  // Đăng ký (gửi OTP)
  router.post("/register", userController.register);

  // Xác thực OTP
  router.post("/verify-otp", userController.verifyOtp);

  // Đăng nhập
  router.post("/login", authController.login);

  // Refresh token
  router.post("/refresh", authController.refresh);

  // Đăng xuất
  router.post("/logout", authController.logout);

  // ========== QUÊN MẬT KHẨU ==========
  // Gửi OTP quên mật khẩu
  router.post("/forgot-password", userController.forgotPassword);

  // Xác thực OTP quên mật khẩu
  router.post("/verify-forgot-otp", userController.verifyForgotOtp);

  // Đặt lại mật khẩu
  router.post("/reset-password", userController.resetPassword);

  // ========== TEST AUTH & ROLE ==========
  // Ai đã login cũng gọi được
  router.get("/me", authenticate, (req, res) => {
    res.json({ message: "Bạn đã đăng nhập", user: req.user });
  });

  // Customer
  router.get("/customer", authenticate, authorize(["customer"]), (req, res) => {
    res.json({ message: "Xin chào Customer", user: req.user });
  });

  // Admin
  router.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
    res.json({ message: "Xin chào Admin", user: req.user });
  });

  // Thợ cắt tóc (barber)
  router.get("/tho-cat-toc", authenticate, authorize(["barber"]), (req, res) => {
    res.json({ message: "Xin chào Barber", user: req.user });
  });

  return app.use("/auth", router);
};

export default authRoutes;

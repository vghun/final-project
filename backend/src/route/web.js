import express from "express";
import authController from "../controllers/homeController.js"; // controller cho đăng ký & OTP
import { login } from "../controllers/authController.js"; // controller cho login
import { authenticate } from "../middlewares/authMiddleware.js"; // middleware JWT
import db from "../models/index.js";

let router = express.Router();

const initWebRoutes = (app) => {
  // API đăng ký (gửi OTP)
  router.post("/register", authController.register);

  // API xác thực OTP
  router.post("/verify-otp", authController.verifyOtp);

  // API đăng nhập
  router.post("/login", login);

  // API profile (yêu cầu JWT)
  router.get("/profile", authenticate, async (req, res) => {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    return res.json({ user });
  });

  // API quên mật khẩu (gửi OTP)
  router.post("/forgot-password", authController.forgotPassword);

  // API xác thực OTP quên mật khẩu
  router.post("/verify-forgot-otp", authController.verifyForgotOtp);

  // API đổi mật khẻu
  router.post("/reset-password", authController.resetPassword);

  return app.use("/", router);
};

export default initWebRoutes;

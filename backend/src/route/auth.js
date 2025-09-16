  import express from "express";
  import userController from "../controllers/userController.js"; // controller cho đăng ký & OTP
  import authController from "../controllers/authController.js"; // controller cho login
  import { authenticate } from "../middlewares/authMiddleware.js"; // middleware JWT
  import db from "../models/index.js";

  let router = express.Router();

  const authRoutes = (app) => {
    // API đăng ký (gửi OTP)
    router.post("/register", userController.register);

    // API xác thực OTP
    router.post("/verify-otp", userController.verifyOtp);

    // API đăng nhập
    router.post("/login", authController.login);
    router.post("/refresh", authController.refresh);
    router.post("/logout", authController.logout);  


    // API quên mật khẩu (gửi OTP)
    router.post("/forgot-password", userController.forgotPassword);

    // API xác thực OTP quên mật khẩu
    router.post("/verify-forgot-otp", userController.verifyForgotOtp);

    // API đổi mật khẻu
    router.post("/reset-password", userController.resetPassword);

    return app.use("/auth", router);
  };

  export default authRoutes;

import express from "express";
import authController from "../controllers/homeController.js"; // controller cho đăng ký & OTP

let router = express.Router();

const initWebRoutes = (app) => {
  // API đăng ký (gửi OTP)
  router.post("/register", authController.register);

  // API xác thực OTP
  router.post("/verify-otp", authController.verifyOtp);

  return app.use("/", router);
};

export default initWebRoutes;

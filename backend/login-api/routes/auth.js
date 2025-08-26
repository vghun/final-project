// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register); // tạm
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.profile);

module.exports = router;

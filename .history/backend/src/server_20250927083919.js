import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import viewEngine from "./config/viewEngine.js";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/configdb.js";
import serviceRoute from "./routes/service.js";
import profileRoutes from "./routes/profile.js";
import chatRoute from "./routes/chat.js"; // <-- route chat AI
import voucherRoutes from "./routes/voucher.js";
import loyaltyRuleRoute from "./routes/loyaltyRule.js"; 
import salaryRoute from "./routes/salary.js";

dotenv.config();

const app = express();

// Debug middleware để log request
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  if (Object.keys(req.body || {}).length > 0) {
    console.log("[DEBUG] Body:", req.body);
  }
  next();
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/services", serviceRoute);
app.use("/user/profile", profileRoutes);
app.use("/api/chat", chatRoute); 
app.use("/api/vouchers", voucherRoutes);
app.use("/api/loyalty-rules", loyaltyRuleRoute);
app.use("/api/salary", salaryRoute);

// View engine & auth
viewEngine(app);
authRoutes(app);

// Connect DB
connectDB();

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`[DEBUG] Backend Node.js is running on port: ${PORT}`);
});

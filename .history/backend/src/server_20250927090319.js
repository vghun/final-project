import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import viewEngine from "./config/viewEngine.js";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/configdb.js";
import serviceRoute from "./routes/service.js";
import profileRoutes from "./routes/profile.js";
import chatRoute from "./routes/chat.js";
import voucherRoutes from "./routes/voucher.js";
import loyaltyRuleRoute from "./routes/loyaltyRule.js"; 
import salaryRoute from "./routes/salary.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log("✅ Middleware setup done");

// Routes
app.use("/api/services", serviceRoute);
app.use("/user/profile", profileRoutes);
// app.use("/api/chat", chatRoute);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/loyalty-rules", loyaltyRuleRoute);
app.use("/api/salary", salaryRoute);

console.log("✅ Routes setup done");

// View engine & auth
viewEngine(app);
authRoutes(app);

console.log("✅ View engine and auth setup done");

// Connect DB
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    const PORT = process.env.PORT || 8088;
    app.listen(PORT, () => {
      console.log(`🚀 Backend Node.js is running on port: ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect DB or start server:", err);
  }
})();

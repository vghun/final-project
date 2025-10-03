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

// Routes
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});
app.use("/api/chat", chatRoute);
// app.use("/api/services", serviceRoute);
// app.use("/user/profile", profileRoutes);
// app.use("/api/vouchers", voucherRoutes);
// app.use("/api/loyalty-rules", loyaltyRuleRoute);
// app.use("/api/salary", salaryRoute);

// View engine & auth
viewEngine(app);
authRoutes(app);

const PORT = process.env.PORT || 8088;

const startServer = async () => {
  try {
    await connectDB(); // ✅ đợi kết nối DB thành công
    app.listen(PORT, () => {
      console.log(`✅ Backend Node.js is running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();

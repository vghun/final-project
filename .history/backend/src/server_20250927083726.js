import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

console.log("🔄 Loading configs...");

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
console.log("✅ dotenv loaded");

const app = express();
console.log("✅ Express app initialized");

// Middleware
app.use(cors());
console.log("✅ CORS enabled");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log("✅ BodyParser enabled");

// Routes
console.log("🔄 Registering routes...");
app.use("/api/services", serviceRoute);
console.log("   → /api/services ok");

app.use("/user/profile", profileRoutes);
console.log("   → /user/profile ok");

app.use("/api/chat", chatRoute); 
console.log("   → /api/chat ok");

app.use("/api/vouchers", voucherRoutes);
console.log("   → /api/vouchers ok");

app.use("/api/loyalty-rules", loyaltyRuleRoute);
console.log("   → /api/loyalty-rules ok");

app.use("/api/salary", salaryRoute);
console.log("   → /api/salary ok");

// View engine & auth
console.log("🔄 Initializing view engine...");
viewEngine(app);
console.log("✅ View engine ok");

console.log("🔄 Registering auth routes...");
authRoutes(app);
console.log("✅ Auth routes ok");

// Connect DB
console.log("🔄 Connecting DB...");
connectDB();

// Start server
const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`🚀 Backend Node.js is running on port: ${PORT}`);
});

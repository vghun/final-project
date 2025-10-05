import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import barberRoutes from "./routes/barber.js";
import viewEngine from "./config/viewEngine.js";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/configdb.js";
import serviceRoute from "./routes/service.js";
import profileRoutes from "./routes/profile.js";
import chatRoute from "./routes/chat.js"; // <-- route chat AI
import voucherRoutes from "./routes/voucher.js";
import bookingRoute from "./route/booking.js";
import statisticRoute from "./routes/statistics.js";
import loyaltyRuleRoute from "./routes/loyaltyRule.js"; 
import salaryRoute from "./routes/salary.js";
import bonusRoutes from "./routes/bonus.js";

dotenv.config();

const app = express();

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


app.use("/api/barbers", barberRoutes);

app.use("/api/booking", bookingRoute);
app.use("/api/statistics", statisticRoute);
app.use("/api/bonus-rules", bonusRoutes);
// View engine & auth
viewEngine(app); 
authRoutes(app);

// Connect DB
connectDB();

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Backend Node.js is running on port: ${PORT}`);
});

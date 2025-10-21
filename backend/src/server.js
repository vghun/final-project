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
import chatRoute from "./routes/chat.js";
import voucherRoutes from "./routes/voucher.js";
import bookingRoute from "./routes/booking.js";
import statisticRoute from "./routes/statistics.js";
import loyaltyRuleRoute from "./routes/loyaltyRule.js";
import salaryRoute from "./routes/salary.js";
import bonusRoutes from "./routes/bonus.js";
import reelRoute from "./routes/reel.js";
import reelCommentRoutes from "./routes/reelComment.js";
import branchRoutes from "./routes/branch.js";
import customerGalleryRoutes from "./routes/customerGallery.js";
import ratingRoutes from "./routes/rating.js";
import summaryRoutes from "./routes/summaryStatistics.js";

import { authenticate, authorize } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/services", serviceRoute);
app.use("/user/profile", profileRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/barbers", barberRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/ratings", ratingRoutes);

app.use("/api/bookings", bookingRoute);
app.use("/api/reels", reelRoute);
app.use("/api/reels", reelCommentRoutes);
app.use("/api/customer-gallery", customerGalleryRoutes);

app.use("/api/vouchers", voucherRoutes);
app.use("/api/loyalty-rules",loyaltyRuleRoute);
app.use("/api/salary", authenticate, authorize(["admin"]), salaryRoute);
app.use("/api/statistics", authenticate, authorize(["admin"]), statisticRoute);
app.use("/api/bonus", authenticate, authorize(["admin"]), bonusRoutes);
app.use("/api/statistics/summary", authenticate, authorize(["admin"]), summaryRoutes);

// View engine & auth routes
viewEngine(app);
authRoutes(app);

// Kết nối DB
connectDB();

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Backend Node.js is running on port: ${PORT}`);
});

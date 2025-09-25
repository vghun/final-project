import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import viewEngine from "./config/viewEngine.js";
import authRoutes from "./route/auth.js";
import connectDB from "./config/configdb.js";
import productRouter from "./route/product.js";
import profileRoutes from "./route/profile.js";
import chatRoute from "./route/chat.js"; // <-- route chat AI
import voucherRoutes from "./route/voucher.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRouter);
app.use("/user/profile", profileRoutes);
app.use("/api/chat", chatRoute); 

app.use("/api/vouchers", voucherRoutes);
// View engine & auth
viewEngine(app);
authRoutes(app);

// Connect DB
connectDB();

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Backend Node.js is running on port: ${PORT}`);
});

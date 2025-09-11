import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";  // <-- thêm dòng này

import viewEngine from "./config/viewEngine.js";
import authRoutes from "./route/auth.js";
import connectDB from "./config/configdb.js";
import productRouter from "./route/product.js";
import profileRoutes from "./route/profile.js";

dotenv.config();

let app = express();

app.use(cors());  // <-- thêm dòng này

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/products", productRouter);

app.use("/profile", profileRoutes); 

viewEngine(app);
authRoutes(app);
connectDB();

let port = process.env.PORT || 8088;

app.listen(port, () => {
  console.log("Backend Node.js is running on the port: " + port);
});

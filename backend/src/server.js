import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import viewEngine from "./config/viewEngine.js";
import initWebRoutes from "./route/web.js";
import connectDB from "./config/configdb.js";

dotenv.config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);    
initWebRoutes(app);  
connectDB();         
let port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("Backend Node.js is running on the port: " + port);
});

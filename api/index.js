// api/index.js
import app from "../backend/src/app.js";  // import app Express của bạn

// Vercel Serverless Function handler
export default (req, res) => {
  // Gọi trực tiếp Express app để xử lý request
  app(req, res);
};
import app from "../backend/src/app.js";
import { createServer } from "http";

// Vercel expects a default export function
export default async function handler(req, res) {
  // Tạo server tạm để handle request
  const server = createServer(app);
  server.emit("request", req, res);
}

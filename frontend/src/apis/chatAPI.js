// src/apis/chatAPI.js
import * as request from "~/apis/configs/httpRequest";

export const sendMessage = async ({ message }) => {
  try {
    const payload = { sessionId: "test-session-123", message };
    const res = await request.post("http://localhost:8088/api/chat", payload);
    return res;
  } catch (err) {
    throw err.response?.data || err;
  }
};

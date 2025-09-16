// src/services/chatService.js
import * as chatAPI from "~/apis/chatAPI";

export const sendMessage = async ({ message }) => {
  try {
    // Hardcode sessionId tạm thời
    const payload = { 
      sessionId: "test-session-123", // tạm thời
      message
    };
    const res = await chatAPI.sendMessage(payload);
    return res; // res là data trả về từ backend
  } catch (err) {
    throw err;
  }
};

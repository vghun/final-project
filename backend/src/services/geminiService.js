import axios from "axios";

const GEMINI_API_KEY = "AIzaSyAyc64UDGDB1o3upwKB68Jx_eUE7GNXC2E";
const GEMINI_MODEL = "gemini-2.0-flash";

export async function sendMessage({ message, history = [] }) {
  try {
    // Gom lịch sử chat
    const historyText = history
      .map(h => `${h.type === "user" ? "User" : "AI"}: ${h.content}`)
      .join("\n");

    // System prompt
    const systemPrompt = `
Bạn là một trợ lý AI cho cửa hàng barbershop nam với founder là Văn Hưng Nguyễn. 
- Tư vấn kiểu tóc phù hợp với khách hàng dựa trên khuôn mặt, tóc hiện tại, và sở thích. 
- Tư vấn sản phẩm chăm sóc tóc phù hợp với kiểu tóc của khách hàng. 
- Giọng điệu thân thiện, tự nhiên, lịch sự, dễ gần. 
- Nếu khách hỏi những điều không liên quan đến tóc hoặc sản phẩm tóc, hãy lịch sự xin lỗi và không trả lời ngoài phạm vi. 
- Luôn đưa ra các gợi ý cụ thể và chi tiết khi có thể.
`;

    // Payload theo chuẩn generateContent
    const payload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: historyText ? historyText + "\n" + "User: " + message : "User: " + message }
          ]
        }
      ]
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        }
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join("") ||
      "AI không trả lời gì 😅";

    return { reply };
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    return { reply: "Đã xảy ra lỗi, thử lại sau" };
  }
}

// Test nhanh
(async () => {
  const r = await sendMessage({ message: "Gợi ý kiểu tóc cho khuôn mặt tròn" });
  console.log("Reply:", r.reply);
})();

<<<<<<< HEAD
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

=======
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import { createEmbedding } from "./pineconeService.js";


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL;

// ---------------------
// Khởi tạo Pinecone
// ---------------------
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const namespace = pc
  .index("project", "project-yfyk5m4.svc.aped-4627-b74a.pinecone.io")
  .namespace("__default__");

// ---------------------
// Từ khóa liên quan barber
// ---------------------
const KEYS = ["thợ", "barber", "cắt tóc", "tóc", "chi nhánh", "quận", "fade", "under cut", "tóc ngắn", "tóc dài"];
function hasRelevantKey(message) {
  return KEYS.some(k => message.toLowerCase().includes(k.toLowerCase()));
}

// ---------------------
// Query Pinecone
// ---------------------
async function queryBarbersByMessage(message, topK = 5) {
  const queryVector = await createEmbedding(message);
  const res = await namespace.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
    includeValues: false,
  });
  return res.matches || [];
}

// ---------------------
// Gọi Gemini
// ---------------------
async function callGemini(payload, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        payload,
        { headers: { "Content-Type": "application/json", "X-goog-api-key": GEMINI_API_KEY } }
      );
      return res.data;
    } catch (err) {
      if (err.response?.status === 503 && i < retries - 1) {
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
}

// ---------------------
// Hàm gửi message
// ---------------------
export async function sendMessage({ message }) {
  try {
    const barbers = hasRelevantKey(message) ? await queryBarbersByMessage(message, 5) : [];
    const barberInfo = barbers.length
      ? barbers
          .map((b, i) => {
            const meta = b.metadata?.metadata ? JSON.parse(b.metadata.metadata) : {};
            const details = b.metadata?.text?.trim().replace(/\n+/g, " ") || "Không có thông tin chi tiết";
            return `${i + 1}. ${meta.fullName || "N/A"} (${meta.branchName || "N/A"}) - ${details}`;
          })
          .join("\n")
      : "";

    const systemPrompt = `
Bạn là trợ lý AI cho barbershop nam.
- Phong cách trả lời: Thân thiện, tự nhiên, lịch sự, dễ gần,cởi mở ,đưa ra nhiều gợi ý cho khách.
- Trả lời chi tiết về tóc, kiểu tóc, sản phẩm chăm sóc tóc.
- Nếu có thông tin thợ/barber, sử dụng để tư vấn.
- Nếu không có thông tin thợ nhưng câu hỏi liên quan tóc, tư vấn dựa trên kiến thức chung và lịch sự xin lỗi nếu thiếu dữ liệu.
- Nếu câu hỏi không liên quan tóc/barber, từ chối lịch sự, ngắn gọn.

${barberInfo ? "Thông tin thợ:\n" + barberInfo : ""}

Câu hỏi khách: ${message}
Hãy trả lời trực tiếp, súc tích, không thêm thông tin ngoài yêu cầu.
`;

    const payload = { contents: [{ parts: [{ text: systemPrompt }] }] };
    const response = await callGemini(payload);

    const reply = response?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "AI không trả lời gì 😅";
>>>>>>> Hung
    return { reply };
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    return { reply: "Đã xảy ra lỗi, thử lại sau" };
  }
<<<<<<< HEAD
}

// Test nhanh
(async () => {
  const r = await sendMessage({ message: "Gợi ý kiểu tóc cho khuôn mặt tròn" });
  console.log("Reply:", r.reply);
})();
=======
}
>>>>>>> Hung

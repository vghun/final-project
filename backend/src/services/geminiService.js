import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import { createEmbedding } from "./pineconeService.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL_MAIN = "gemini-2.5-pro";       // Model chính tạo phản hồi
const GEMINI_MODEL_INTENT = process.env.GEMINI_MODEL;   // Model nhẹ phân tích câu hỏi

// ---------------------
// Khởi tạo Pinecone
// ---------------------
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const namespace = pc
  .index("project", "project-yfyk5m4.svc.aped-4627-b74a.pinecone.io")
  .namespace("__default__");

// ---------------------
// Gọi Gemini API
// ---------------------
async function callGemini(model, payload, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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
// 1️⃣ Agent phân tích câu hỏi khách
// ---------------------
async function analyzeIntent(message) {
  const intentPrompt = `
Bạn là hệ thống phân loại câu hỏi của khách hàng trong tiệm cắt tóc nam.

Dựa vào câu hỏi, hãy **phân loại chính xác** nó thuộc nhóm nào:
- "barber" → nếu khách đang hỏi về thợ, chi nhánh, kiểu tóc, dịch vụ hoặc sản phẩm tóc.
- "general" → nếu không liên quan đến tiệm tóc hoặc thợ.
Chỉ trả về đúng một từ: "barber" hoặc "general".

### Ví dụ
- "Tiệm mình thợ nào cắt tóc đẹp?" → barber
- "Ở chi nhánh quận 1 có ai chuyên fade không?" → barber
- "Kiểu tóc nào hợp với mặt tròn?" → barber
- "Thời tiết hôm nay sao?" → general
- "Mấy giờ tiệm mở cửa?" → barber
- "Bạn có người yêu chưa?" → general

Câu hỏi khách: "${message}"
Trả lời chỉ một từ:
`;

  const payload = { contents: [{ parts: [{ text: intentPrompt }] }] };
  const response = await callGemini(GEMINI_MODEL_INTENT, payload);

  const intent = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || "general";
  return intent.includes("barber") ? "barber" : "general";
}

// ---------------------
// 2️⃣ Gọi model chính tạo phản hồi
// ---------------------
async function generateResponse(message, barberInfo) {
  const systemPrompt = `
Bạn là trợ lý AI của barbershop nam.
- Phong cách: thân thiện, tự nhiên, lịch sự, cởi mở, dễ gần.
- Trả lời chi tiết về tóc, kiểu tóc, thợ, chi nhánh hoặc sản phẩm chăm sóc tóc.
- Nếu có dữ liệu từ Pinecone, hãy sử dụng để tư vấn.
- Nếu không có dữ liệu, trả lời theo kiến thức chung, và lịch sự xin lỗi nếu thiếu thông tin.
- Nếu câu hỏi không liên quan đến tiệm hoặc tóc, hãy từ chối khéo léo.

${barberInfo ? "Thông tin thợ truy xuất được:\n" + barberInfo : "Không có dữ liệu thợ."}

Câu hỏi khách: ${message}
Trả lời ngắn gọn, tự nhiên, rõ ràng.
`;

  const payload = { contents: [{ parts: [{ text: systemPrompt }] }] };
  const response = await callGemini(GEMINI_MODEL_MAIN, payload);
  return response?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "AI không phản hồi 😅";
}

// ---------------------
// 3️⃣ Hàm chính xử lý toàn bộ pipeline
// ---------------------
export async function sendMessage({ message }) {
  try {
    // 1. Phân tích intent
    const intent = await analyzeIntent(message);

    // 2. Nếu là barber → truy xuất Pinecone
    let barberInfo = "";
    if (intent === "barber") {
      const barbers = await queryBarbersByMessage(message, 5);
      if (barbers.length) {
        barberInfo = barbers
          .map((b, i) => {
            const meta = b.metadata?.metadata ? JSON.parse(b.metadata.metadata) : {};
            const details = b.metadata?.text?.trim().replace(/\n+/g, " ") || "Không có chi tiết";
            return `${i + 1}. ${meta.fullName || "N/A"} (${meta.branchName || "N/A"}) - ${details}`;
          })
          .join("\n");
      }
    }

    // 3. Gọi Gemini chính tạo phản hồi
    const reply = await generateResponse(message, barberInfo);
    return { intent, reply };
  } catch (err) {
    console.error("Gemini Agent error:", err.response?.data || err.message);
    return { reply: "Đã xảy ra lỗi khi xử lý yêu cầu 😢" };
  }
}

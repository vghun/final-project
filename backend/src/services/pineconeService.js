import index from "../config/pinecone.js";
import fetch from "node-fetch";
const HF_API_KEY = process.env.HF_API_KEY;  
// Tạm thời test với embedding từ HF
export async function createEmbedding(text) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/intfloat/multilingual-e5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text // đảm bảo model sẵn sàng
        }),
      }
    );

    const result = await response.json();

    // debug kết quả
    console.log("HF embedding result:", result);

    // xử lý đa dạng format trả về
    if (Array.isArray(result)) {
      if (Array.isArray(result[0])) {
        // chuẩn mảng 2 chiều [ [..embedding..] ]
        return result[0];
      } else {
        // một số trường hợp trả mảng 1 chiều
        return result;
      }
    } else if (result?.embedding) {
      // một số API có key "embedding"
      return result.embedding;
    } else {
      throw new Error("HF API returned unexpected format");
    }
  } catch (err) {
    console.error("⚠️ HF API failed:", err.message);
    // fallback tạm thời
    return Array(1024).fill(0.01);
  }
}

// Test upsert barbers bằng text, Pinecone tự sinh vector
export async function upsertBarbersTest(barbers) {
  const records = barbers.map(b => ({
    id: b.idBarber.toString(),
    text: b.profileDescription || b.fullName || b.branchName || "",
    metadata: JSON.stringify({
      idBarber: b.idBarber,
      idBranch: b.idBranch,
      fullName: b.fullName || "",
      branchName: b.branchName || ""
    })
  }));

  console.log("Records ready to upsert:", records);

  await index.upsertRecords(records, "__default__"); 
  console.log("✅ Barber data upserted into Pinecone (test text).");
}

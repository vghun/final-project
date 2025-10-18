import db from "../models/index.js"; 
import { upsertBranches } from "./pineconeService.js"; // Tạo file riêng giống upsertBarbersTest
// Sửa lại import này
const Branch = db.Branch;

const createBranch = async (data) => {
  return await Branch.create(data);
};

const updateBranch = async (id, data) => {
  const branch = await Branch.findByPk(id);
  if (!branch) throw new Error("Branch not found");
  return await branch.update(data);
};

const deleteBranch = async (id) => {
  const branch = await Branch.findByPk(id);
  if (!branch) throw new Error("Branch not found");
  await branch.destroy();
  return true;
};

const toggleBranchStatus = async (id) => {
  const branch = await Branch.findByPk(id);
  if (!branch) throw new Error("Branch not found");
  branch.isActive = !branch.isActive;
  await branch.save();
  return branch;
};

const getAllBranches = async () => {
  return await Branch.findAll();
};
const syncBranchesToPinecone = async () => {
  try {
    // 🔹 Lấy danh sách chi nhánh kèm thông tin dịch vụ
    const branches = await db.Branch.findAll({
      attributes: ["idBranch", "name", "address", "status", "openTime", "closeTime"],
      include: [
        {
          model: db.Service,
          as: "services",
          attributes: ["idService", "name", "price", "duration", "status"],
          through: { attributes: [] }, // bỏ bảng trung gian ServiceAssignment
        },
      ],
    });

    if (!branches.length) {
      return { message: "Không có dữ liệu chi nhánh để đồng bộ." };
    }

    // 🔹 Chuẩn hóa dữ liệu trước khi đẩy lên Pinecone
    const branchData = branches.map((b) => {
      const statusRaw = (b.status || "").trim().toLowerCase();
      const isActive =
        statusRaw === "active" ||
        statusRaw === "true" ||
        statusRaw === "1" ||
        statusRaw === "đang hoạt động";

      // 🔹 Ghép danh sách dịch vụ
      const serviceList =
        b.services?.length > 0
          ? b.services
              .map(
                (s) =>
                  `${s.name} (${parseFloat(s.price).toLocaleString("vi-VN")}₫ / ${s.duration} phút)`
              )
              .join(", ")
          : "Chưa có dịch vụ";

      return {
        idBranch: b.idBranch,
        name: b.name || "Chưa có tên chi nhánh",
        address: b.address || "Không có địa chỉ",
        status: b.status,
        openTime: b.openTime || "N/A",
        closeTime: b.closeTime || "N/A",
        displayText: `
Chi nhánh: ${b.name || "Chưa có tên"}.
Địa chỉ: ${b.address || "Không có địa chỉ"}.
Trạng thái: ${isActive ? "Đang hoạt động" : "Ngừng hoạt động"}.
Giờ mở cửa: ${b.openTime || "N/A"}.
Giờ đóng cửa: ${b.closeTime || "N/A"}.
Dịch vụ: ${serviceList}.
        `.trim(),
      };
    });

    // 🔹 Gửi dữ liệu lên Pinecone
    await upsertBranches(branchData);

    return {
      message: "✅ Dữ liệu chi nhánh (kèm dịch vụ) đã đồng bộ lên Pinecone thành công.",
      total: branchData.length,
    };
  } catch (error) {
    console.error("❌ Lỗi đồng bộ chi nhánh:", error);
    return { message: "❌ Lỗi server khi đồng bộ chi nhánh", error: error.message };
  }
};




export default {
  createBranch,
  updateBranch,
  deleteBranch,
  toggleBranchStatus,
  getAllBranches,
  syncBranchesToPinecone,
};
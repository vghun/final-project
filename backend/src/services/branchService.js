import db from "../models/index.js"; 
import { upsertBranches } from "./pineconeService.js";

const Branch = db.Branch;

const createBranch = async (data) => {
  try {
    const { name, address, openTime, closeTime, slotDuration, managerId } = data;

    if (!name || !address || !openTime || !closeTime || !slotDuration || !managerId) {
      throw new Error("Thiếu thông tin bắt buộc khi tạo chi nhánh!");
    }

    const manager = await db.User.findByPk(managerId);
    if (!manager) {
      throw new Error(`Không tìm thấy người quản lý với ID = ${managerId}`);
    }

    const newBranch = await Branch.create({
      name,
      address,
      openTime,
      closeTime,
      slotDuration,
      managerId,
      status: "Active",
    });

    return newBranch;
  } catch (error) {
    console.error("Lỗi createBranch:", error);
    throw error;
  }
};

const updateBranch = async (id, data) => {
  try {
    const branch = await Branch.findByPk(id);
    if (!branch) throw new Error("Không tìm thấy chi nhánh để cập nhật!");

    const { name, address, openTime, closeTime, slotDuration, managerId, status } = data;

    // 🔹 Kiểm tra dữ liệu bắt buộc
    if (!name || !address || !openTime || !closeTime || !slotDuration || !managerId) {
      throw new Error("Thiếu thông tin bắt buộc khi cập nhật chi nhánh!");
    }

    // 🔹 Kiểm tra manager tồn tại
    const manager = await db.User.findByPk(managerId);
    if (!manager) {
      throw new Error(`Không tìm thấy người quản lý với ID = ${managerId}`);
    }

    // 🔹 Cập nhật các trường hợp lệ
    await branch.update({
      name,
      address,
      openTime,
      closeTime,
      slotDuration,
      managerId,
      status: status || branch.status, // giữ nguyên nếu không truyền
    });

    return branch;
  } catch (error) {
    console.error("Lỗi updateBranch:", error);
    throw error;
  }
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
  branch.status = branch.status === "Active" ? "Inactive" : "Active";
  await branch.save();
  return branch;
};


const getAllBranches = async () => {
  try {
    const branches = await db.Branch.findAll({
      attributes: [
        "idBranch",
        "name",
        "address",
        "openTime",
        "closeTime",
        "status",
        "slotDuration",
        "managerId",
        // 👇 tính tổng số thợ
        [
          db.Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM barbers AS b 
            WHERE b.idBranch = Branch.idBranch
          )`),
          "totalBarbers",
        ],
      ],
      include: [
        {
          model: db.User,
          as: "manager",
          attributes: ["idUser", "fullName", "email", "phoneNumber"],
        },
      ],
      order: [["idBranch", "ASC"]],
    });

    if (!branches.length) {
      return { message: "Không có chi nhánh nào trong hệ thống" };
    }

    return branches;
  } catch (error) {
    console.error("Lỗi getAllBranches:", error);
    throw error;
  }
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
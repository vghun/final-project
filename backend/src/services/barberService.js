import db from "../models/index.js";
import { upsertBarbersTest } from "./pineconeService.js";
const Barber = db.Barber;
// Lấy toàn bộ barber từ DB
export const getAllBarbers = async () => {
  try {
    const barbers = await db.Barber.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["fullName"] },
        { model: db.Branch, as: "branch", attributes: ["name"] },
      ],
    });

    if (!barbers.length) {
      return { message: "❌ Không có dữ liệu barber" };
    }

    const barberData = barbers.map((b) => ({
      idBarber: b.idBarber,
      idBranch: b.idBranch,
      fullName: b.user?.fullName || "Chưa có tên",        // thêm full name riêng
      branchName: b.branch?.name || "Chưa có chi nhánh",  // thêm tên chi nhánh riêng
      profileDescription: b.profileDescription || "Không có mô tả",
      // Có thể thêm một trường tổng hợp nếu muốn AI dùng trực tiếp
      displayText: `Tên barber: ${b.user?.fullName || "Chưa có tên"}, Chi nhánh: ${b.branch?.name || "Chưa có chi nhánh"}, Mô tả: ${b.profileDescription || "Không có mô tả"}`
    }));

    return { total: barberData.length, barbers: barberData };
  } catch (error) {
    console.error("❌ Get All Barber Error:", error);
    return { message: "❌ Lỗi server", error: error.message };
  }
};

// Đồng bộ barber vào Pinecone (text upsert)
export const syncBarbersToPinecone = async () => {
  try {
    const barbers = await db.Barber.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["fullName"] },
        { model: db.Branch, as: "branch", attributes: ["name"] },
      ],
    });

    if (!barbers.length) {
      console.log("❌ Không có dữ liệu barber để đồng bộ.");
      return { message: "❌ Không có dữ liệu barber để đồng bộ." };
    }

    const barberData = barbers.map((b) => ({
      idBarber: b.idBarber,
      idBranch: b.idBranch,
      fullName: b.user?.fullName || "Chưa có tên",
      branchName: b.branch?.name || "Chưa có chi nhánh",
      profileDescription: b.profileDescription || "Không có mô tả",
      displayText: `Tên barber: ${b.user?.fullName || "Chưa có tên"}, Chi nhánh: ${b.branch?.name || "Chưa có chi nhánh"}, Mô tả: ${b.profileDescription || "Không có mô tả"}`
    }));

    console.log("👉 BarberData to upsert:", barberData.length, barberData);

    await upsertBarbersTest(barberData);

    console.log("✅ Barber data synced to Pinecone (test).");
    return { message: "✅ Barber data synced to Pinecone (test).", total: barberData.length };
  } catch (error) {
    console.error("❌ Sync Barber Error:", error);
    return { message: "❌ Lỗi server", error: error.message };
  }
};

export const assignBarberToBranch = async (idBarber, idBranch) => {
  const barber = await Barber.findByPk(idBarber);
  if (!barber) throw new Error("Barber not found");
  barber.idBranch = idBranch;
  await barber.save();
  return barber;
};

export const approveBarber = async (idBarber) => {
  const barber = await Barber.findByPk(idBarber);
  if (!barber) throw new Error("Barber not found");
  barber.isApproved = true;
  await barber.save();
  return barber;
};

export const lockBarber = async (idBarber) => {
  const barber = await Barber.findByPk(idBarber);
  if (!barber) throw new Error("Barber not found");
  barber.isLocked = true;
  await barber.save();
  return barber;
};
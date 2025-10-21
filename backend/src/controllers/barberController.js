import * as BarberService from "../services/barberService.js";

// Lấy tất cả barber
const getAllBarbers = async (req, res) => {
  try {
    const barbers = await BarberService.getAllBarbers();
    return res.status(200).json(barbers);
  } catch (error) {
    console.error("Lỗi getAllBarbers:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Đồng bộ dữ liệu barber vào Pinecone
const syncBarbers = async (req, res) => {
  try {
    const result = await BarberService.syncBarbersToPinecone();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi syncBarbers:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const assignUserAsBarber = async (req, res) => {
  try {
    const result = await BarberService.assignUserAsBarber(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignBarberToBranch = async (req, res) => {
  try {
    const { idBarber, idBranch } = req.body;
    const barber = await BarberService.assignBarberToBranch(idBarber, idBranch);
    res.json({ message: "Barber assigned to branch", barber });
  } catch (error) {
    console.error("Lỗi assignBarberToBranch:", error);
    res.status(404).json({ error: error.message });
  }
};

const approveBarber = async (req, res) => {
  try {
    const { idBarber } = req.body;
    const barber = await BarberService.approveBarber(idBarber);
    res.json({ message: "Barber approved", barber });
  } catch (error) {
    console.error("Lỗi approveBarber:", error);
    res.status(404).json({ error: error.message });
  }
};

// Khóa barber
const lockBarber = async (req, res) => {
  try {
    const { idBarber } = req.body;
    const barber = await BarberService.lockBarber(idBarber);
    res.json({ message: "Barber locked", barber });
  } catch (error) {
    console.error("Lỗi lockBarber:", error);
    res.status(404).json({ error: error.message });
  }
};
// Mở khóa barber
const unlockBarber = async (req, res) => {
  try {
    const { idBarber } = req.body;
    const barber = await BarberService.unlockBarber(idBarber);
    res.json({ message: "Barber unlocked", barber });
  } catch (error) {
    console.error("Lỗi unlockBarber:", error);
    res.status(404).json({ error: error.message });
  }
};

// 🔹 Tạo user + barber cùng lúc
const createBarberWithUser = async (req, res) => {
  try {
    const { email, password, fullName, phoneNumber, idBranch, profileDescription } = req.body;

    // Gọi xuống service xử lý logic
    const result = await BarberService.createBarberWithUser({
      email,
      password,
      fullName,
      phoneNumber,
      idBranch,
      profileDescription,
    });

    return res.status(201).json({
      message: "Tạo thợ cắt tóc thành công!",
      user: result.user,
      barber: result.barber,
    });
    } catch (error) {
      await t.rollback();
      console.error("❌ Lỗi khi tạo barber mới (chi tiết):", error.errors || error);
      throw new Error("Lỗi khi tạo barber mới: " + (error.message || "Không rõ"));
    }

};


export default {
  getAllBarbers,
  syncBarbers,
  assignBarberToBranch,
  approveBarber,
  lockBarber,
  unlockBarber,
  assignUserAsBarber,
  createBarberWithUser
};
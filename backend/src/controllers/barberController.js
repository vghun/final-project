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

export const getBarberReward = async (req, res) => {
  try {
    const { idBarber } = req.params;
    const rewardData = await BarberService.calculateBarberReward(idBarber);
    res.json(rewardData);
  } catch (error) {
    console.error("Error calculating reward:", error);
    res.status(500).json({ message: error.message || "Lỗi khi tính thưởng." });
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
  getBarberReward,
};

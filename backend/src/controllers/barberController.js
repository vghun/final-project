
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
const assignBarberToBranch = async (req, res) => {
  try {
    const { idBarber, idBranch } = req.body;
    const barber = await barberService.assignBarberToBranch(idBarber, idBranch);
    res.json({ message: "Barber assigned to branch", barber });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const approveBarber = async (req, res) => {
  try {
    const { idBarber } = req.body;
    const barber = await barberService.approveBarber(idBarber);
    res.json({ message: "Barber approved", barber });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const lockBarber = async (req, res) => {
  try {
    const { idBarber } = req.body;
    const barber = await barberService.lockBarber(idBarber);
    res.json({ message: "Barber locked", barber });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
export default {
  getAllBarbers,
  syncBarbers,
  assignBarberToBranch,
  approveBarber,
  lockBarber,
};

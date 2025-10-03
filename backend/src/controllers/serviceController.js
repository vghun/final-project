import * as serviceService from "../services/serviceService.js";

// Dịch vụ hot nhất (nhiều booking nhất)
export const getHot = async (req, res) => {
  try {
    const { page = 1, limit = 4 } = req.query;
    const result = await serviceService.getHotServicesPaged(
      parseInt(page),
      parseInt(limit)
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết dịch vụ theo ID
export const getById = async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ error: "Không tìm thấy dịch vụ" });
    return res.status(200).json(service);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

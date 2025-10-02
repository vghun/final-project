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

export const assignServiceToBranch = async (req, res) => {
  try {
    const { idService, idBranch } = req.body;
    const service = await serviceService.assignServiceToBranch(idService, idBranch);
    res.json({ message: "Service assigned to branch", service });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    res.json(service);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    await serviceService.deleteService(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
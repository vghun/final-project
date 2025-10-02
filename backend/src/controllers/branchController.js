import branchService from "../services/branchService.js";

export const createBranch = async (req, res) => {
  try {
    const branch = await branchService.createBranch(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await branchService.updateBranch(req.params.id, req.body);
    res.json(branch);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    await branchService.deleteBranch(req.params.id);
    res.json({ message: "Branch deleted" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const toggleBranchStatus = async (req, res) => {
  try {
    const branch = await branchService.toggleBranchStatus(req.params.id);
    res.json(branch);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const branches = await branchService.getAllBranches();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
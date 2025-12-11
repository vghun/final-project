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


export const getAllBranches = async (req, res) => {
  try {
    const branches = await branchService.getAllBranches();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const syncBranchesToPinecone = async (req, res) => {
  try {
    const result = await branchService.syncBranchesToPinecone();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const setSuspendDate = async (req, res) => {
  try {
    const branchId = req.params.id;
    const { suspendDate } = req.body;

    const result = await branchService.setSuspendDate(branchId, suspendDate);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

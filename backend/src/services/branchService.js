import db from "../models/index.js"; // Sửa lại import này
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

export default {
  createBranch,
  updateBranch,
  deleteBranch,
  toggleBranchStatus,
  getAllBranches,
};
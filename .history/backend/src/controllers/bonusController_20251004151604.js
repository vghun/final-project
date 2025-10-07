import BonusRuleService from "../services/bonusService.js";

// ================== Tạo rule mới ==================
const createRule = async (req, res) => {
  try {
    console.log("Body:", req.body);

    const rule = await BonusRuleService.createRule(req.body);
    console.log("Created Bonus Rule:", rule);

    res.status(201).json(rule);
  } catch (error) {
    console.error("Lỗi createRule:", error);
    res.status(400).json({ message: error.message });
  }
};

// ================== Lấy tất cả rule ==================
const getAllRules = async (req, res) => {
  try {
    const rules = await BonusRuleService.getAllRules();
    res.status(200).json(rules);
  } catch (error) {
    console.error("Lỗi getAllRules:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================== Lấy rule đang hoạt động ==================
const getActiveRules = async (req, res) => {
  try {
    const rules = await BonusRuleService.getActiveRules();
    res.status(200).json(rules);
  } catch (error) {
    console.error("Lỗi getActiveRules:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================== Lấy rule theo ID ==================
const getRuleById = async (req, res) => {
  try {
    const rule = await BonusRuleService.getRuleById(req.params.id);
    console.log("Rule from DB:", rule);

    if (!rule) return res.status(404).json({ message: "Bonus rule không tồn tại" });

    res.status(200).json(rule);
  } catch (error) {
    console.error("Lỗi getRuleById:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================== Cập nhật rule ==================
const updateRule = async (req, res) => {
  try {
    console.log("Body:", req.body);

    const rule = await BonusRuleService.updateRule(req.params.id, req.body);
    console.log("Updated Bonus Rule:", rule);

    res.status(200).json(rule);
  } catch (error) {
    console.error("Lỗi updateRule:", error);
    res.status(400).json({ message: error.message });
  }
};

// ================== Xóa (ẩn) rule ==================
const deleteRule = async (req, res) => {
  try {
    const rule = await BonusRuleService.deleteRule(req.params.id);
    console.log("Deleted Bonus Rule:", rule);

    res.status(200).json({ message: "Bonus rule deactivated successfully", rule });
  } catch (error) {
    console.error("Lỗi deleteRule:", error);
    res.status(404).json({ message: error.message });
  }
};

// ================== Lấy rule phù hợp với doanh thu ==================
const getApplicableRule = async (req, res) => {
  try {
    const { revenue } = req.query; // truyền ?revenue=1000000 trên URL
    const rule = await BonusRuleService.getApplicableRule(parseFloat(revenue));

    if (!rule) return res.status(404).json({ message: "Không tìm thấy rule phù hợp" });

    res.status(200).json(rule);
  } catch (error) {
    console.error("Lỗi getApplicableRule:", error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  createRule,
  getAllRules,
  getActiveRules,
  getRuleById,
  updateRule,
  deleteRule,
  getApplicableRule,
};

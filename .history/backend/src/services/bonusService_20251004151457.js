// backend/src/services/bonusRuleService.js
import db from "../models/index.js";
import { Op } from "sequelize";

class BonusService {
  // ================== Tạo rule mới ==================
  async createRule(data) {
    // Kiểm tra hợp lệ
    if (!data.minRevenue || !data.bonusPercent) {
      throw new Error("Vui lòng nhập minRevenue và bonusPercent");
    }

    // Tạo rule mới
    return await db.BonusRule.create({
      minRevenue: data.minRevenue,
      maxRevenue: data.maxRevenue ?? null,
      bonusPercent: data.bonusPercent,
      note: data.note ?? null,
      active: data.active ?? true,
    });
  }

  // ================== Lấy tất cả rule ==================
  async getAllRules() {
    return await db.BonusRule.findAll({ order: [["minRevenue", "ASC"]] });
  }

  // ================== Lấy rule đang hoạt động ==================
  async getActiveRules() {
    return await db.BonusRule.findAll({ where: { active: true }, order: [["minRevenue", "ASC"]] });
  }

  // ================== Lấy rule theo id ==================
  async getRuleById(id) {
    const rule = await db.BonusRule.findByPk(id);
    if (!rule) throw new Error("Bonus rule not found");
    return rule;
  }

  // ================== Cập nhật rule ==================
  async updateRule(id, data) {
    const rule = await db.BonusRule.findByPk(id);
    if (!rule) throw new Error("Bonus rule not found");

    return await rule.update({
      minRevenue: data.minRevenue ?? rule.minRevenue,
      maxRevenue: data.maxRevenue ?? rule.maxRevenue,
      bonusPercent: data.bonusPercent ?? rule.bonusPercent,
      note: data.note ?? rule.note,
      active: data.active ?? rule.active,
    });
  }

  // ================== Xóa (ẩn) rule ==================
  async deleteRule(id) {
    const rule = await db.BonusRule.findByPk(id);
    if (!rule) throw new Error("Bonus rule not found");
    // Không xóa hẳn mà chỉ đổi trạng thái
    return await rule.update({ active: false });
  }

  // ================== Lấy rule phù hợp với doanh thu ==================
  async getApplicableRule(revenue) {
    // Ví dụ: tìm rule mà revenue nằm trong khoảng [minRevenue, maxRevenue)
    return await db.BonusRule.findOne({
      where: {
        active: true,
        minRevenue: { [Op.lte]: revenue },
        [Op.or]: [
          { maxRevenue: null },
          { maxRevenue: { [Op.gte]: revenue } },
        ],
      },
      order: [["minRevenue", "DESC"]],
    });
  }
}

export default new BonusService();

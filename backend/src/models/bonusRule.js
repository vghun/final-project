"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class BonusRule extends Model {
    static associate(models) {
      // Nếu sau này có bảng liên kết, thêm tại đây
      // Ví dụ:
      // BonusRule.hasMany(models.EmployeeBonus, {
      //   foreignKey: "bonusRuleId",
      //   as: "employeeBonuses",
      // });
    }
  }

  BonusRule.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      minRevenue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Doanh thu tối thiểu để được thưởng",
      },
      maxRevenue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: "Doanh thu tối đa trong khoảng thưởng (có thể null)",
      },
      bonusPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: "Phần trăm thưởng, ví dụ 5.00 = 5%",
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "BonusRule",
      tableName: "BonusRules",
      timestamps: true, // tự động map createdAt, updatedAt
    }
  );

  return BonusRule;
};

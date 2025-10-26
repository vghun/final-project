"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("BonusRules", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    minRevenue: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
    },
    bonusPercent: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      comment: "Phần trăm thưởng, ví dụ 5.00 = 5%",
    },
    note: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("BonusRules");
}

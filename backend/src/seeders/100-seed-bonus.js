"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("BonusRules", [
    {
      minRevenue: 0,
      bonusPercent: 0,
      note: "Chưa đạt mốc, chưa có thưởng",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      minRevenue: 3000000,
      bonusPercent: 1.0,
      note: "Doanh thu đủ, thưởng cơ bản",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      minRevenue: 5000000,
      bonusPercent: 1.5,
      note: "Doanh thu đủ, thưởng cơ bản",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      minRevenue: 10000000,
      bonusPercent: 2,
      note: "Doanh thu khá, thưởng tốt",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      minRevenue: 15000000,
      bonusPercent: 3,
      note: "Doanh thu cao, thưởng cao",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      minRevenue: 25000000,
      bonusPercent: 5,
      note: "Doanh thu xuất sắc, thưởng tối đa",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("BonusRules", null, {});
}

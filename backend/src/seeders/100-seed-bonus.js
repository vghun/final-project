"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("BonusRules", [
    {
      minRevenue: 10000000,
      maxRevenue: 20000000,
      bonusPercent: 1.0,
      note: "Doanh thu đủ, thưởng cơ bản",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      minRevenue: 20000001,
      maxRevenue: 40000000,
      bonusPercent: 1.5,
      note: "Doanh thu khá, thưởng tốt",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      minRevenue: 40000001,
      maxRevenue: 60000000,
      bonusPercent: 2.5,
      note: "Doanh thu cao, thưởng cao",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      minRevenue: 60000001,
      maxRevenue: 70000000,
      bonusPercent: 3.5,
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

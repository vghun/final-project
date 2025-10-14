"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("barber_unavailabilities", [
    {
      idBarber: 9,
      startDate: "2025-10-15",
      endDate: "2025-10-15",
      reason: "Nghỉ ốm",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 10,
      startDate: "2025-10-15",
      endDate: "2025-10-15",
      reason: "Đi công việc riêng",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 11,
      startDate: "2025-10-15",
      endDate: "2025-10-15",
      reason: "Về quê",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("barber_unavailabilities", null, {});
}

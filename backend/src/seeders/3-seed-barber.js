"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("barbers", [
    {
      idBarber: 3, // barber1
      profileDescription: "Chuyên fade, undercut, tạo kiểu hiện đại",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 5, // barber2
      profileDescription: "Chuyên uốn, nhuộm, tạo kiểu nữ",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("barbers", null, {});
}

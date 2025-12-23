"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("branches", [
    {
      idBranch: 1,
      name: "Chi nhánh Trung tâm",
      address: "123 Đường Lê Lợi, TP.HCM",
      openTime: "09:00:00",
      closeTime: "21:00:00",
      slotDuration: 60,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBranch: 2,
      name: "Chi nhánh Quận 1",
      address: "456 Đường Nguyễn Huệ, TP.HCM",
      openTime: "09:00:00",
      closeTime: "21:00:00",
      slotDuration: 60,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBranch: 3,
      name: "Chi nhánh Quận 3",
      address: "789 Đường Hai Bà Trưng, TP.HCM",
      openTime: "09:00:00",
      closeTime: "21:00:00",
      slotDuration: 60,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("branches", null, {});
}

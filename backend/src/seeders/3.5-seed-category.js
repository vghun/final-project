"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("categories", [
    {
      idCategory: 1,
      name: "Dịch vụ cắt tóc nam",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idCategory: 2,
      name: "Dịch vụ cắt tóc nữ",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idCategory: 3,
      name: "Dịch vụ nhuộm & uốn",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("categories", null, {});
}

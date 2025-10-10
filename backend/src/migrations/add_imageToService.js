"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("services", "image", {
    type: Sequelize.STRING(255),
    allowNull: true, // Cho phép null để tương thích với dữ liệu cũ
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("services", "image");
}
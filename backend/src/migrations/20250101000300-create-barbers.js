"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("barbers", {
    idBarber: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: { model: "users", key: "idUser" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    idBranch: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "branches", key: "idBranch" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    profileDescription: {
      type: Sequelize.TEXT,
      allowNull: true,
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
  await queryInterface.dropTable("barbers");
}

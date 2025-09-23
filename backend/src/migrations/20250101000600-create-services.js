"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("services", {
    idService: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idCategory: {
      type: Sequelize.INTEGER,
      references: { model: "categories", key: "idCategory" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    duration: {
      type: Sequelize.INTEGER, // phút
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("Active", "Inactive"),
      defaultValue: "Active",
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
  await queryInterface.dropTable("services");
}

"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("products", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    views: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    sold: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    discount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: Sequelize.STRING,
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
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
  await queryInterface.dropTable("products");
}

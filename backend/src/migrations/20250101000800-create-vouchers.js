"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("vouchers", {
    idVoucher: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    discountPercent: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    },
    expiryDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    minPoint: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: Sequelize.STRING,
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
  await queryInterface.dropTable("vouchers");
}

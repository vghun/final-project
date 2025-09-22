"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("bookings", {
    idBooking: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idCustomer: {
      type: Sequelize.INTEGER,
      references: { model: "customers", key: "idCustomer" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    idVoucher: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "vouchers", key: "idVoucher" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    guestCount: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    status: {
      type: Sequelize.ENUM("Pending", "Completed", "Cancelled"),
      defaultValue: "Pending",
    },
    description: {
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
  await queryInterface.dropTable("bookings");
}

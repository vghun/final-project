"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    idUser: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    fullName: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
    },
    role: {
      type: Sequelize.ENUM("Customer", "Barber", "Admin"),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("Active", "Locked"),
      allowNull: false,
      defaultValue: "Active",
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("users");
}

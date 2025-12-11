"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("branches", {
    idBranch: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    openTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    closeTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    slotDuration: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    // 2 cột mới
    suspendDate: {              // ngày tạm ngưng
      type: Sequelize.DATE,
      allowNull: true,
    },
    resumeDate: {               // ngày bắt đầu hoạt động lại
      type: Sequelize.DATE,
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
  await queryInterface.dropTable("branches");
}

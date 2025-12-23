"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("vouchers", {
    idVoucher: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {                  // Tên voucher
      type: Sequelize.STRING,
      allowNull: false,
    },
    discountPercent: {        // Giảm giá %
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    },
    pointCost: {              // Số điểm đổi
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    totalQuantity: {          // Số lượng tối đa có thể đổi (null = không giới hạn)
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    expiryDate: {             // Ngày hết hạn
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {                 // Trạng thái voucher (true = active, false = inactive)
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    description: {            // Mô tả chi tiết
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("vouchers");
}

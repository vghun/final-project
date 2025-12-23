"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("customer_voucher", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idCustomer: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "customers", key: "idCustomer" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    idVoucher: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "vouchers", key: "idVoucher" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    // ✅ Mã voucher cá nhân cho mỗi khách hàng (dạng unique)
    voucherCode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    // ✅ Thời điểm khách hàng đổi voucher
    obtainedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    // ✅ Thời điểm khách hàng sử dụng voucher (nếu có)
    usedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    // ✅ Thời điểm voucher hết hạn (tính riêng cho mỗi khách)
    expiredAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    // ✅ Trạng thái rõ ràng: chưa dùng, đã dùng, hết hạn
    status: {
      type: Sequelize.ENUM("unused", "used", "expired"),
      allowNull: false,
      defaultValue: "unused",
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("customer_voucher");
  
  
}

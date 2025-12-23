"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("loyalty_rules", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    money_per_point: {
      type: Sequelize.INTEGER,
      allowNull: false, // số tiền cần để được 1 điểm
    },
    point_multiplier: {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 1.0, // hệ số nhân
    },
    min_order_amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // đơn tối thiểu để tính điểm
    },
    is_default: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // có phải rule mặc định không
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, // rule còn hiệu lực không
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true, // có thể null nếu không set
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true,
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
  await queryInterface.dropTable("loyalty_rules");
}

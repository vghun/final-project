"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("barber_rating_summaries", {
    idBarber: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true, // idBarber là khóa chính
      references: { model: "barbers", key: "idBarber" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    totalRate: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    avgRate: {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("barber_rating_summaries");
}

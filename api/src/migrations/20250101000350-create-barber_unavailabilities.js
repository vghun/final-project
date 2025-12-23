"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("barber_unavailabilities", {
    idUnavailable: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idBarber: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "barbers", key: "idBarber" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    startDate: {
      type: Sequelize.DATEONLY, // YYYY-MM-DD
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATEONLY, // YYYY-MM-DD
      allowNull: false,
    },
    reason: {
      type: Sequelize.TEXT,
      allowNull: true,
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
  await queryInterface.dropTable("barber_unavailabilities");
}

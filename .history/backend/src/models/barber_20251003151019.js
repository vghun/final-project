"use strict";
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Barber extends Model {
    static associate(models) {
  Barber.belongsTo(models.User, { foreignKey: "idBarber", as: "user" });
  Barber.belongsTo(models.Branch, { foreignKey: "idBranch", as: "branch" });
  Barber.hasMany(models.Booking, { foreignKey: "idBarber", as: "Bookings" });
  Barber.hasMany(models.Salary, { foreignKey: "idBarber", as: "salaries" });
}

  }

  Barber.init(
    {
      idBarber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      idBranch: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nếu chưa bắt buộc
      },
      profileDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Barber",
      tableName: "barbers",
      timestamps: true,
    }
  );

  return Barber;
};

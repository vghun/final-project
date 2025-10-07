"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Barber extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "idBarber", as: "user" });
      this.belongsTo(models.Branch, { foreignKey: "idBranch", as: "branch" });

      this.hasMany(models.Booking, {
        foreignKey: "idBarber",
        as: "bookings",
      });
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
        allowNull: true,
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

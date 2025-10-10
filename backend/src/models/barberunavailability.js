"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class BarberUnavailability extends Model {
    static associate(models) {
      BarberUnavailability.belongsTo(models.Barber, { foreignKey: "idBarber" });
    }
  }
  BarberUnavailability.init(
    {
<<<<<<< HEAD
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      idBarber: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      description: DataTypes.TEXT,
    },
    { sequelize, modelName: "BarberUnavailability", tableName: "barber_unavailabilities" }
=======
      idUnavailable: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idBarber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "BarberUnavailability",
      tableName: "barber_unavailabilities",
      timestamps: true,
    }
>>>>>>> origin/main
  );
  return BarberUnavailability;
};

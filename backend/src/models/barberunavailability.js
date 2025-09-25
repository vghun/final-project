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
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      idBarber: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      description: DataTypes.TEXT,
    },
    { sequelize, modelName: "BarberUnavailability", tableName: "barber_unavailabilities" }
  );
  return BarberUnavailability;
};

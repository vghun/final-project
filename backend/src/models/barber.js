"use strict";
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Barber extends Model {
    static associate(models) {
      Barber.belongsTo(models.User, {
        foreignKey: "idBarber",
        as: "user",
      });
    }
  }

  Barber.init(
    {
      idBarber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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

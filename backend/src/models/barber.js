"use strict";
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Barber extends Model {
    static associate(models) {
      Barber.belongsTo(models.User, {
        foreignKey: "idBarber",
        as: "user",
      });
      // Thêm association với Branch
      Barber.belongsTo(models.Branch, {
        foreignKey: "idBranch",
        as: "branch",
      });
      Barber.hasMany(models.Booking, {
      foreignKey: "idBarber",
      as: "Bookings", // Phải khớp alias khi include trong service
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
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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

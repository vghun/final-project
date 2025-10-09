"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // 1 Service có thể nằm trong nhiều BookingDetail
      Service.hasMany(models.BookingDetail, {
        foreignKey: "idService",
        as: "bookingDetails",
      });

      // 1 Service có thể thuộc nhiều Branch thông qua ServiceAssignment
      Service.belongsToMany(models.Branch, {
        through: models.ServiceAssignment,
        foreignKey: "idService",
        otherKey: "idBranch",
        as: "branches",
      });
    }
  }

  Service.init(
    {
      idService: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: DataTypes.TEXT,
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
       image: {
        type: DataTypes.STRING(255), 
        allowNull: true, 
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
    },
    {
      sequelize,
      modelName: "Service",
      tableName: "services",
    }
  );

  return Service;
};

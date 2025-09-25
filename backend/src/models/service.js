"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // 1 Service thuộc về 1 Category
      Service.belongsTo(models.Category, { foreignKey: "idCategory" });
      // 1 Service có thể nằm trong nhiều BookingDetail
      Service.hasMany(models.BookingDetail, { foreignKey: "idService" });
    }
  }

  Service.init(
    {
      idService: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idCategory: DataTypes.INTEGER,
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

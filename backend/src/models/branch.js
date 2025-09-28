"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Branch extends Model {
    static associate(models) {
      Branch.hasMany(models.ServiceAssignment, { foreignKey: "idBranch" });
      Branch.hasMany(models.Barber, { foreignKey: "idBranch" }); // thêm để Sequelize hiểu relation
    }
  }

  Branch.init(
    {
      idBranch: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      openTime: DataTypes.TIME,
      closeTime: DataTypes.TIME,
      status: DataTypes.ENUM("Active", "Inactive"),
      slotDuration: DataTypes.INTEGER,
    },
    { sequelize, modelName: "Branch", tableName: "branches" }
  );

  return Branch;
};

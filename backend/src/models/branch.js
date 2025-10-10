"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Branch extends Model {
    static associate(models) {
<<<<<<< HEAD
      Branch.hasMany(models.ServiceAssignment, { foreignKey: "idBranch" });
      Branch.hasMany(models.Barber, { foreignKey: "idBranch" }); // thêm để Sequelize hiểu relation
=======
      this.hasMany(models.ServiceAssignment, { foreignKey: "idBranch", as: "serviceAssignments" });
      this.hasMany(models.Barber, { foreignKey: "idBranch", as: "barbers" });

      this.belongsToMany(models.Service, {
        through: models.ServiceAssignment,
        foreignKey: "idBranch",
        otherKey: "idService",
        as: "services",
      });
>>>>>>> origin/main
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

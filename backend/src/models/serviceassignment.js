"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class ServiceAssignment extends Model {
    static associate(models) {
<<<<<<< HEAD
      ServiceAssignment.belongsTo(models.Branch, { foreignKey: "idBranch" });
      ServiceAssignment.belongsTo(models.Service, { foreignKey: "idService" });
    }
  }
=======
      this.belongsTo(models.Branch, { foreignKey: "idBranch", as: "branch" });
      this.belongsTo(models.Service, { foreignKey: "idService", as: "service" });
    }
  }

>>>>>>> origin/main
  ServiceAssignment.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      idBranch: DataTypes.INTEGER,
      idService: DataTypes.INTEGER,
    },
    { sequelize, modelName: "ServiceAssignment", tableName: "service_assignments" }
  );
<<<<<<< HEAD
=======

>>>>>>> origin/main
  return ServiceAssignment;
};

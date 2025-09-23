"use strict";
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsTo(models.User, {
        foreignKey: "idCustomer",
        as: "user",
      });
    }
  }

  Customer.init(
    {
      idCustomer: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      loyaltyPoint: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "customers",
      timestamps: true,
    }
  );

  return Customer;
};

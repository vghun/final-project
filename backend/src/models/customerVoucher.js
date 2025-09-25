"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class CustomerVoucher extends Model {
    static associate(models) {
      CustomerVoucher.belongsTo(models.Customer, {
        foreignKey: "idCustomer",
        as: "customer",
      });
      CustomerVoucher.belongsTo(models.Voucher, {
        foreignKey: "idVoucher",
        as: "voucher",
      });
    }
  }

  CustomerVoucher.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idCustomer: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idVoucher: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "unused",
      },
    },
    {
      sequelize,
      modelName: "CustomerVoucher",
      tableName: "customer_voucher",
      timestamps: true,
    }
  );

  return CustomerVoucher;
};

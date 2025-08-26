'use strict';
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here (nếu sau này có bảng liên quan)
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      isStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "customer"
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users"
    }
  );

  return User;
};

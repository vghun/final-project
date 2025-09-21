'use strict';
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // 1 category có nhiều products
      Category.hasMany(models.Product, { foreignKey: "categoryId", as: "products" });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories"
    }
  );

  return Category;
};

"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Service, { foreignKey: "idCategory" });
    }
  }
  Category.init(
    {
      idCategory: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
    },
    { sequelize, modelName: "Category", tableName: "categories" }
  );
  return Category;
};

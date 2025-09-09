'use strict';
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // 1 product thuộc về 1 category
      Product.belongsTo(models.Category, { foreignKey: "categoryId", as: "category" });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      discount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "categories",
          key: "id"
        },
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products"
    }
  );

  return Product;
};

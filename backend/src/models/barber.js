"use strict";
<<<<<<< HEAD
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Barber extends Model {
    static associate(models) {
  Barber.belongsTo(models.User, { foreignKey: "idBarber", as: "user" });
  Barber.belongsTo(models.Branch, { foreignKey: "idBranch", as: "branch" });
  Barber.hasMany(models.Booking, { foreignKey: "idBarber", as: "Bookings" });
  Barber.hasMany(models.Salary, { foreignKey: "idBarber", as: "salaries" });
  Barber.hasOne(models.BarberRatingSummary, { foreignKey: "idBarber",as: "ratingSummary",});

}

=======
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Barber extends Model {
    static associate(models) {
      // Quan hệ với User (1-1)
      this.belongsTo(models.User, { foreignKey: "idBarber", as: "user" });

      // Quan hệ với Branch (nhiều thợ thuộc 1 chi nhánh)
      this.belongsTo(models.Branch, { foreignKey: "idBranch", as: "branch" });

      // Quan hệ với Booking (1 thợ có nhiều booking)
      this.hasMany(models.Booking, {
        foreignKey: "idBarber",
        as: "bookings",
      });

      // Quan hệ với Salary (1 thợ có nhiều lương)
      this.hasMany(models.Salary, {
        foreignKey: "idBarber",
        as: "salaries",
      });
    }
>>>>>>> origin/main
  }

  Barber.init(
    {
      idBarber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      idBranch: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      profileDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Barber",
      tableName: "barbers",
      timestamps: true,
    }
  );

  return Barber;
};

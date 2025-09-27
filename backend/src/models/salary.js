import { DataTypes } from "sequelize";
import db from "./index.js";

const Salary = db.sequelize.define("Salary", {
  idSalary: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idBarber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  baseSalary: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  commission: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  tips: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  totalSalary: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
}, {
  tableName: "salaries",
  timestamps: true,
});

export default Salary;

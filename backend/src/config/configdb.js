import { Sequelize } from "sequelize";


const sequelize = new Sequelize("account", "root", "090104", {
  host: "localhost",
  port: 3306,              
  dialect: "mysql",
  logging: console.log,
  dialectOptions: {
    connectTimeout: 5000, 
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Connection has been established successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
};

export { sequelize };
export default connectDB;

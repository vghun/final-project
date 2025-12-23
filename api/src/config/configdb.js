import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 4000,
  dialect: 'mysql',
  dialectModule: mysql2,  // Force load mysql2
  logging: console.log,   // Để debug
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,  
      minVersion: 'TLSv1.2'
    },
    connectTimeout: 30000
  },
  pool: {
    max: 5,       // Pool nhỏ cho serverless
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
};

export { sequelize };
export default connectDB;
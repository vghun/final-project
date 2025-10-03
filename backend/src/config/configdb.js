import { Sequelize } from "sequelize";

const sequelize = new Sequelize("account", "root", "xuandung", {
  host: "127.0.0.1",       // ép dùng TCP
  port: 3306,              // cổng MySQL
  dialect: "mysql",
  logging: console.log,
  dialectOptions: {
    connectTimeout: 5000,  // timeout sau 5s nếu không kết nối được
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
  }
};

export default connectDB;

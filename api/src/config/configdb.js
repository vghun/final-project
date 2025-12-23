import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const sequelize = new Sequelize("barbershop", "rpWeBffxsABWN46.root", "I1zjl93hQooAG5uH", {
  host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  port: 4000,
  dialect: "mysql",
  dialectModule: mysql2,
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true, // Đảm bảo kiểm tra chứng chỉ
      minVersion: 'TLSv1.2'     // TiDB Cloud yêu cầu tối thiểu TLS 1.2
    }
  }
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

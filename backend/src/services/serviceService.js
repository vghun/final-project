import db from "../models/index.js";
import { Sequelize } from "sequelize";

// Lấy dịch vụ mới nhất
export const getLatestServices = async (limit = 8) => {
  return await db.Service.findAll({
    order: [["createdAt", "DESC"]],
    limit,
  });
};

// Lấy dịch vụ hot nhất có phân trang
export const getHotServicesPaged = async (page = 1, limit = 4) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await db.Service.findAndCountAll({
    attributes: {
      include: [
        [
          Sequelize.fn("COUNT", Sequelize.col("bookingDetails.idBookingDetail")),
          "totalBookings",
        ],
      ],
    },
    include: [
      {
        model: db.BookingDetail,
        as: "bookingDetails", // 👈 alias phải khớp với Service.hasMany
        attributes: [],
      },
    ],
    group: ["Service.idService"],
    order: [[Sequelize.literal("totalBookings"), "DESC"]],
    limit,
    offset,
    subQuery: false, // 👈 bắt buộc khi có group by
    distinct: true,  // 👈 để count đúng số bản ghi
  });

  return {
    total: Array.isArray(count) ? count.length : count, // count có thể là mảng
    page,
    limit,
    data: rows,
  };
};

// Lấy chi tiết dịch vụ theo id
export const getServiceById = async (id) => {
  return await db.Service.findByPk(id);
};

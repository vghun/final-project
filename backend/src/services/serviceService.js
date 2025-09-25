import db from "../models/index.js";
import { Sequelize } from "sequelize";

// Lấy dịch vụ mới nhất
export const getLatestServices = async (limit = 8) => {
  return await db.Service.findAll({
    order: [["createdAt", "DESC"]],
    limit,
  });
};

// Lấy dịch vụ hot nhất (tính theo số lượng booking_detail)
export const getHotServices = async (limit = 6) => {
  return await db.Service.findAll({
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
        as: "bookingDetails", // 👈 alias phải khớp
        attributes: [],
      },
    ],
    group: ["Service.idService"],
    order: [[Sequelize.literal("totalBookings"), "DESC"]],
    limit,
    subQuery: false, // 👈 bắt buộc để Sequelize JOIN trực tiếp thay vì subquery
  });
};

// Lấy chi tiết dịch vụ theo id
export const getServiceById = async (id) => {
  return await db.Service.findByPk(id);
};

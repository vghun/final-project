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
          Sequelize.fn("COUNT", Sequelize.col("booking_details.idBookingDetail")),
          "totalBookings",
        ],
      ],
    },
    include: [
      { model: db.BookingDetail, attributes: [] }, // join booking_details nhưng không lấy field
    ],
    group: ["Service.idService"],
    order: [[Sequelize.literal("totalBookings"), "DESC"]],
    limit,
  });
};

// Lấy chi tiết dịch vụ theo id
export const getServiceById = async (id) => {
  return await db.Service.findByPk(id);
};

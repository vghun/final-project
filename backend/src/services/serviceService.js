import db from "../models/index.js";
import { Sequelize } from "sequelize";
const Service = db.Service;
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


export const assignServiceToBranch = async (idService, idBranch) => {
  const service = await Service.findByPk(idService);
  if (!service) throw new Error("Service not found");
  service.idBranch = idBranch;
  await service.save();
  return service;
};

export const createService = async (data) => {
  return await Service.create(data);
};

export const updateService = async (idService, data) => {
  const service = await Service.findByPk(idService);
  if (!service) throw new Error("Service not found");
  return await service.update(data);
};

export const deleteService = async (idService) => {
  const service = await Service.findByPk(idService);
  if (!service) throw new Error("Service not found");
  await service.destroy();
  return true;
};

export const getAllServices = async () => {
  return await Service.findAll();
};
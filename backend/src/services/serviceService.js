import db from "../models/index.js";
import { Sequelize } from "sequelize";

const { Service, Branch, ServiceAssignment } = db;

// 🔹 Lấy dịch vụ mới nhất
export const getLatestServices = async (limit = 8) => {
  return await Service.findAll({
    order: [["createdAt", "DESC"]],
    limit,
  });
};

// 🔹 Lấy dịch vụ hot nhất có phân trang
export const getHotServicesPaged = async (page = 1, limit = 4) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Service.findAndCountAll({
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
    subQuery: false,
    distinct: true,
  });

  return {
    total: Array.isArray(count) ? count.length : count,
    page,
    limit,
    data: rows,
  };
};

// 🔹 Lấy chi tiết dịch vụ theo ID
export const getServiceById = async (id) => {
  return await Service.findByPk(id);
};

// 🔹 Gán dịch vụ cho chi nhánh (tạo bản ghi ở bảng trung gian)
export const assignServiceToBranch = async (idService, idBranch) => {
  const service = await Service.findByPk(idService);
  if (!service) throw new Error("Service not found");

  // ✅ Tạo quan hệ trong bảng trung gian
  await ServiceAssignment.create({ idService, idBranch });
  return { message: "Assigned successfully" };
};

// 🔹 Tạo dịch vụ mới
export const createService = async (data) => {
  return await Service.create(data);
};

// 🔹 Cập nhật dịch vụ
export const updateService = async (idService, data) => {
  const service = await Service.findByPk(idService);
  if (!service) throw new Error("Service not found");

  if (!data.image) {
    data.image = service.image;
  }

  return await service.update(data);
};

// 🔹 Xóa dịch vụ
export const deleteService = async (idService) => {
  const service = await Service.findByPk(idService);
  if (!service) throw new Error("Service not found");
  await service.destroy();
  return true;
};

// 🔹 Lấy tất cả dịch vụ (kèm chi nhánh)
export const getAllServices = async () => {
  const services = await Service.findAll({
    include: [
      {
        model: Branch,
        as: "branches",
        attributes: ["idBranch", "name"],
        through: { attributes: [] },
      },
    ],
  });

  return services.map((s) => ({
    idService: s.idService,
    name: s.name,
    description: s.description,
    price: s.price,
    duration: s.duration,
    image: s.image,
    status: s.status,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    branches: s.branches || [],
  }));
};

export const unassignServiceFromBranch = async (idService, idBranch) => {
  const deleted = await db.ServiceAssignment.destroy({
    where: { idService, idBranch },
  });
  if (!deleted) throw new Error("Not assigned or already removed");
  return true;
};

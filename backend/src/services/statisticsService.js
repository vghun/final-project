// services/statisticsService.js
import db from "../models/index.js";
import { Sequelize } from "sequelize";

/**
 * Thống kê doanh thu tất cả thợ theo chi nhánh
 * @param {Object} filter - { month, year, branchId }
 * @returns {Array} danh sách thợ và tổng doanh thu
 */
export const getBarberRevenue = async (filter = {}) => {
  const { month, year, branchId } = filter;

  // Lọc theo tháng/năm
  const whereSalary = {};
  if (month) whereSalary.month = month;
  if (year) whereSalary.year = year;

  // Lọc theo chi nhánh nếu có
  const whereBarber = {};
  if (branchId) whereBarber.idBranch = branchId;

  // Query từ Salary kết hợp với Barber
  const salaries = await db.Salary.findAll({
    where: whereSalary,
    include: [
      {
        model: db.Barber,
        as: "barber",
        where: whereBarber,
        attributes: ["idBarber", "idBranch"],
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["fullName"], // tên thợ nằm ở đây
          },
        ],
      },
    ],
    attributes: ["idSalary", "baseSalary", "commission", "tips", "bonus", "totalSalary"], // thêm bonus
    order: [["year", "ASC"], ["month", "ASC"]],
  });

  // Format trả về frontend
  return salaries.map((s) => ({
    barberName: s.barber.user.fullName,
    baseSalary: parseFloat(s.baseSalary),
    commission: parseFloat(s.commission),
    tips: parseFloat(s.tips),
    bonus: parseFloat(s.bonus), // thêm bonus
    totalSalary: parseFloat(s.totalSalary),
  }));
};


export const getBranchMonthlyBookingRevenue = async (year) => {
  const revenue = await db.Booking.findAll({
    attributes: [
      [Sequelize.col("barber->branch.idBranch"), "branchId"],
      [Sequelize.col("barber->branch.name"), "branchName"],
      [Sequelize.literal("MONTH(`bookingDate`)"), "month"],
      [Sequelize.literal("SUM(`total`)"), "totalRevenue"], // dùng total từ Booking
    ],
    where: {
      isPaid: true, // chỉ lấy booking đã thanh toán
      [Sequelize.Op.and]: Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("bookingDate")), year),
    },
    include: [
      {
        model: db.Barber,
        as: "barber",
        attributes: [],
        include: [
          {
            model: db.Branch,
            as: "branch",
            attributes: [],
          },
        ],
      },
    ],
    group: ["barber->branch.idBranch", "barber->branch.name", Sequelize.literal("MONTH(`bookingDate`)")],
    order: [["barber", "branch", "idBranch", "ASC"], [Sequelize.literal("MONTH(`bookingDate`)"), "ASC"]],
    raw: true,
  });

  return revenue.map((r) => ({
    branchId: r.branchId,
    branchName: r.branchName,
    month: r.month,
    totalRevenue: parseFloat(r.totalRevenue),
  }));
};

// services/statisticsService.js
import db from "../models/index.js";
import { Sequelize } from "sequelize";

/**
 * Thống kê doanh thu tất cả thợ
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
  attributes: ["idSalary", "baseSalary", "commission", "tips", "totalSalary"],
  order: [["year", "ASC"], ["month", "ASC"]],
});

// Format trả về frontend
return salaries.map((s) => ({
  barberName: s.barber.user.fullName,
  baseSalary: parseFloat(s.baseSalary),
  commission: parseFloat(s.commission),
  tips: parseFloat(s.tips),
  totalSalary: parseFloat(s.totalSalary),
}));

}

export const getBranchMonthlyBookingRevenue = async (year) => {
  const revenue = await db.BookingDetail.findAll({
    attributes: [
      [Sequelize.col("booking->barber->branch.idBranch"), "branchId"],
      [Sequelize.col("booking->barber->branch.name"), "branchName"],
      [Sequelize.literal("MONTH(`booking`.`bookingDate`)"), "month"],
      [Sequelize.literal("SUM(`BookingDetail`.`price` * `BookingDetail`.`quantity`)"), "totalRevenue"],
    ],
    include: [
      {
        model: db.Booking,
        as: "booking", // alias đúng với BookingDetail.belongsTo
        attributes: [],
        where: Sequelize.where(
          Sequelize.fn("YEAR", Sequelize.col("booking.bookingDate")),
          year
        ),
        include: [
          {
            model: db.Barber,
            as: "barber", // alias đúng với Booking.belongsTo
            attributes: [],
            include: [
              {
                model: db.Branch,
                as: "branch", // alias đúng với Barber.belongsTo
                attributes: [],
              },
            ],
          },
        ],
      },
    ],
    group: ["booking->barber->branch.idBranch", "booking->barber->branch.name", Sequelize.literal("MONTH(`booking`.`bookingDate`)")],
    order: [["booking", "barber", "branch", "idBranch", "ASC"], [Sequelize.literal("MONTH(`booking`.`bookingDate`)"), "ASC"]],
    raw: true,
  });

  return revenue.map((r) => ({
    branchId: r.branchId,
    branchName: r.branchName,
    month: r.month,
    totalRevenue: parseFloat(r.totalRevenue),
  }));
};

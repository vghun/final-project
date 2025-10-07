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

/**
 * Thống kê doanh thu theo chi nhánh
 * @param {Object} filter - { month, year }
 * @returns {Array} [{ branchId, branchName, baseSalary, commission, tips, totalSalary }]
 */
export const getBranchRevenue = async (filter = {}) => {
  const { month, year } = filter;

  const whereSalary = {};
  if (month) whereSalary.month = month;
  if (year) whereSalary.year = year;

  // Aggregate theo branch
  const revenue = await db.Salary.findAll({
    where: whereSalary,
    attributes: [
      [Sequelize.col("barber.idBranch"), "branchId"],
      [Sequelize.fn("SUM", Sequelize.col("baseSalary")), "baseSalary"],
      [Sequelize.fn("SUM", Sequelize.col("commission")), "commission"],
      [Sequelize.fn("SUM", Sequelize.col("tips")), "tips"],
      [Sequelize.fn("SUM", Sequelize.col("totalSalary")), "totalSalary"],
    ],
    include: [
      {
        model: db.Barber,
        as: "barber",
        attributes: [],
        include: [
          {
            model: db.Branch,
            as: "branch",
            attributes: ["branchName"],
          },
        ],
      },
    ],
    group: ["barber.idBranch", "barber.branch.branchName"],
    raw: true,
  });

  // map thêm branchName
  return revenue.map((r) => ({
    branchId: r.branchId,
    branchName: r["barber.branch.branchName"],
    baseSalary: parseFloat(r.baseSalary),
    commission: parseFloat(r.commission),
    tips: parseFloat(r.tips),
    totalSalary: parseFloat(r.totalSalary),
  }));
};

/**
 * Thống kê tổng doanh thu từng tháng của các chi nhánh trong năm
 * @param {number} year
 * @returns {Array} [{ month: 'T1', branches: { "Quận 1": 1000000, ... } }]
 */
export const getMonthlyBranchRevenue = async (year) => {
  const fullMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  const salaries = await db.Salary.findAll({
    where: { year },
    attributes: [
      "month",
      [Sequelize.col("barber.branch.branchName"), "branchName"],
      [Sequelize.fn("SUM", Sequelize.col("totalSalary")), "totalSalary"],
    ],
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
    group: ["month", "barber.branch.branchName"],
    raw: true,
  });

  // Lấy danh sách chi nhánh
  const allBranchesRaw = await db.Branch.findAll({
    attributes: ["branchName"],
    raw: true,
  });
  const branchNames = allBranchesRaw.map((b) => b.branchName);

  // Khởi tạo tháng + chi nhánh
  const monthlyRevenue = fullMonths.map((m) => {
    const branchesObj = {};
    branchNames.forEach((name) => (branchesObj[name] = 0));
    return { month: `T${m}`, branches: branchesObj };
  });

  // Điền dữ liệu
  salaries.forEach((s) => {
    const index = s.month - 1;
    if (s.branchName) monthlyRevenue[index].branches[s.branchName] += parseFloat(s.totalSalary);
  });

  return monthlyRevenue;
};

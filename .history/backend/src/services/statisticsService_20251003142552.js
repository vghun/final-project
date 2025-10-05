// services/statisticsService.js
import { Salary } from "../models"; // import model salaries
import { Barber } from "../models"; // import model barbers
import { Op } from "sequelize";

/**
 * Thống kê doanh thu tất cả thợ
 * @param {Object} filter - filter gồm { month, year, branchId }
 * @returns {Array} danh sách thợ và tổng doanh thu
 */
export async function getBarberRevenue(filter = {}) {
  const { month, year, branchId } = filter;

  // Build điều kiện lọc
  const whereSalary = {};
  const whereBarber = {};

  if (month) whereSalary.month = month;
  if (year) whereSalary.year = year;
  if (branchId) whereBarber.idBranch = branchId;

  // Query dữ liệu
  const salaries = await Salary.findAll({
    where: whereSalary,
    include: [
      {
        model: Barber,
        as: "barber",
        where: whereBarber,
        attributes: ["idBarber", "idBranch", "profileDescription"],
      },
    ],
    attributes: [
      "idBarber",
      "month",
      "year",
      "baseSalary",
      "commission",
      "tips",
      "totalSalary",
    ],
    order: [["year", "ASC"], ["month", "ASC"]],
  });

  // Tổng hợp theo thợ
  const revenueByBarber = salaries.map((s) => ({
    idBarber: s.idBarber,
    month: s.month,
    year: s.year,
    baseSalary: parseFloat(s.baseSalary),
    commission: parseFloat(s.commission),
    tips: parseFloat(s.tips),
    totalSalary: parseFloat(s.totalSalary),
    branchId: s.barber.idBranch,
    profileDescription: s.barber.profileDescription,
  }));

  return revenueByBarber;
}

/**
 * Thống kê doanh thu theo chi nhánh
 * @param {Object} filter - { month, year }
 * @returns {Array} danh sách chi nhánh và tổng doanh thu
 */
export async function getBranchRevenue(filter = {}) {
  const { month, year } = filter;

  const whereSalary = {};
  if (month) whereSalary.month = month;
  if (year) whereSalary.year = year;

  // Lấy tất cả salaries kèm thông tin thợ để biết branch
  const salaries = await Salary.findAll({
    where: whereSalary,
    include: [
      {
        model: Barber,
        as: "barber",
        attributes: ["idBranch"],
      },
    ],
  });

  // Aggregate theo branch
  const revenueByBranch = {};
  salaries.forEach((s) => {
    const branchId = s.barber.idBranch || "unknown";
    if (!revenueByBranch[branchId]) {
      revenueByBranch[branchId] = {
        branchId,
        baseSalary: 0,
        commission: 0,
        tips: 0,
        totalSalary: 0,
      };
    }
    revenueByBranch[branchId].baseSalary += parseFloat(s.baseSalary);
    revenueByBranch[branchId].commission += parseFloat(s.commission);
    revenueByBranch[branchId].tips += parseFloat(s.tips);
    revenueByBranch[branchId].totalSalary += parseFloat(s.totalSalary);
  });

  return Object.values(revenueByBranch);
}
/**
 * Thống kê tổng doanh thu từng tháng của các chi nhánh trong năm
 * @param {number} year - năm muốn thống kê
 * @returns {Array} [{ month: 'T1', branches: { "Quận 1": 1000000, "Quận 3": 2000000, "Thủ Đức": 1500000 } }, ...]
 */
export async function getMonthlyBranchRevenue(year) {
  const fullMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  // Lấy tất cả salaries trong năm, join Barber và Branch
  const salaries = await Salary.findAll({
    where: { year },
    include: [
      {
        model: Barber,
        as: "barber",
        attributes: ["idBranch"],
        include: [
          {
            model: Branch,
            as: "branch",
            attributes: ["branchName"], // tên chi nhánh
          },
        ],
      },
    ],
  });

  // Lấy danh sách tất cả chi nhánh có trong DB
  const allBranches = await Branch.findAll({ attributes: ["branchName"] });
  const branchNames = allBranches.map((b) => b.branchName);

  // Khởi tạo object chứa doanh thu theo tháng + chi nhánh
  const monthlyRevenue = fullMonths.map((month) => {
    const branchesObj = {};
    branchNames.forEach((name) => (branchesObj[name] = 0));
    return { month: `T${month}`, branches: branchesObj };
  });

  // Aggregate doanh thu
  salaries.forEach((s) => {
    const m = s.month;
    const index = m - 1;
    const branchName = s.barber.branch.branchName;
    if (branchName) {
      monthlyRevenue[index].branches[branchName] += parseFloat(s.totalSalary);
    }
  });

  return monthlyRevenue;
}
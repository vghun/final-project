import db from "../models/index.js"; // đường dẫn tới folder models
import { fn, col, Op } from "sequelize";

export const getBarberSalariesOptimized = async (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const salaries = await db.Barber.findAll({
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["fullName"],
        required: true,
      },
      {
        model: db.Branch,
        as: "branch",
        attributes: ["name", "address"],
        required: false,
      },
      {
        model: db.Booking,
        as: "Bookings",
        required: false,
        where: {
          status: "Completed",
          bookingDate: { [Op.gte]: startDate, [Op.lt]: endDate },
        },
        include: [
          { model: db.BookingDetail, as: "BookingDetails", attributes: [] },
          { model: db.BookingTip, as: "BookingTip", attributes: [] },
        ],
        attributes: [],
      },
    ],
    attributes: [
      "idBarber",
      [fn("COALESCE", fn("SUM", col("Bookings.BookingDetails.price")), 0), "serviceRevenue"],
      [fn("COALESCE", fn("SUM", col("Bookings.BookingTip.tipAmount")), 0), "tipAmount"],
      [col("user.fullName"), "barberName"],
      [col("branch.name"), "branchName"],
      [col("branch.address"), "branchAddress"],
    ],
    group: ["Barber.idBarber", "user.idUser", "branch.idBranch"],
  });

  // Lấy bonusRules từ DB
  const bonusRules = await db.BonusRule.findAll({
    where: { active: true },
    order: [["minRevenue", "ASC"]],
  });

  return salaries.map((b) => {
    const serviceRevenue = parseFloat(b.get("serviceRevenue") || 0);
    const tipAmount = parseFloat(b.get("tipAmount") || 0);
    const baseSalary = 5000000;
    const commission = serviceRevenue * 0.15;

    // Tính thưởng theo doanh thu
    const rule = bonusRules.find(
      (r) =>
        serviceRevenue >= parseFloat(r.minRevenue) &&
        (r.maxRevenue == null || serviceRevenue <= parseFloat(r.maxRevenue))
    );
    const bonus = rule ? (commission * parseFloat(rule.bonusPercent)) / 100 : 0;

    const totalSalary = baseSalary + commission + tipAmount + bonus;

    return {
      barberName: b.get("barberName"),
      branchName: b.get("branchName") || "",
      branchAddress: b.get("branchAddress") || "",
      serviceRevenue: serviceRevenue.toFixed(0),
      tip: tipAmount.toFixed(0),
      baseSalary: baseSalary.toFixed(0),
      commission: commission.toFixed(0),
      bonus: bonus.toFixed(0), // Thêm cột bonus
      totalSalary: totalSalary.toFixed(0),
      status: "Chưa tính",
    };
  });
};

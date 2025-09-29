import db from "../models/index.js";
import { Op, fn, col, literal } from "sequelize";

export const getBarberSalariesOptimized = async (month, year) => {
  // Tính ngày bắt đầu và kết thúc của tháng
  const startDate = new Date(year, month - 1, 1);       // đầu tháng
  const endDate = new Date(year, month, 1);             // đầu tháng tiếp theo

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
          bookingDate: { [Op.gte]: startDate, [Op.lt]: endDate }, // Filter theo tháng
        },
        include: [
          {
            model: db.BookingDetail,
            as: "BookingDetails",
            attributes: [],
          },
          {
            model: db.BookingTip,
            as: "BookingTip",
            attributes: [],
          },
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

  return salaries.map((b) => {
    const serviceRevenue = parseFloat(b.get("serviceRevenue") || 0);
    const tipAmount = parseFloat(b.get("tipAmount") || 0);
    const baseSalary = 5000000; // Lương cơ bản
    const commission = serviceRevenue * 0.15; // Hoa hồng 15%
    const totalSalary = baseSalary + commission + tipAmount;

    return {
      barberName: b.get("barberName"),
      branchName: b.get("branchName") || "",
      branchAddress: b.get("branchAddress") || "",
      serviceRevenue: serviceRevenue.toFixed(0),
      tip: tipAmount.toFixed(0),
      baseSalary: baseSalary.toFixed(0),
      commission: commission.toFixed(0),
      totalSalary: totalSalary.toFixed(0),
      status: "Chưa tính", // Nếu muốn check đã tính thì join thêm bảng Salary
    };
  });
};
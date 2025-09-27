import db from "../models/index.js";
import { Op, fn, col } from "sequelize";

// Lấy danh sách barber + tính lương theo tháng/năm
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

  return salaries.map((b) => {
    const serviceRevenue = parseFloat(b.get("serviceRevenue") || 0);
    const tipAmount = parseFloat(b.get("tipAmount") || 0);
    const baseSalary = 5000000;
    const commission = serviceRevenue * 0.15;
    const totalSalary = baseSalary + commission + tipAmount;

    return {
      idBarber: b.idBarber,   // lưu idBarber để insert vào bảng salaries
      barberName: b.get("barberName"),
      branchName: b.get("branchName") || "",
      branchAddress: b.get("branchAddress") || "",
      serviceRevenue: serviceRevenue.toFixed(0),
      tip: tipAmount.toFixed(0),
      baseSalary: baseSalary.toFixed(0),
      commission: commission.toFixed(0),
      totalSalary: totalSalary.toFixed(0),
      status: "Chưa tính",
    };
  });
};

// Tính lương và lưu vào bảng salaries
// export const calculateAndSaveSalaries = async (month, year) => {
//   const barberSalaries = await getBarberSalariesOptimized(month, year);

//   for (const b of barberSalaries) {
//     const existing = await db.Salary.findOne({
//       where: { idBarber: b.idBarber, month, year },
//     });

//     if (!existing) {
//       await db.Salary.create({
//         idBarber: b.idBarber,
//         month,
//         year,
//         baseSalary: b.baseSalary,
//         commission: b.commission,
//         tips: b.tip,
//         totalSalary: b.totalSalary,
//       });
//     }
//   }

//   return { message: `Đã tính và lưu lương cho tháng ${month}/${year}` };
// };

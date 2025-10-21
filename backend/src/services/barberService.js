import db from "../models/index.js";
import { upsertBarbers } from "./pineconeService.js";
import { fn, col, Op } from "sequelize";
const Barber = db.Barber;
// Lấy toàn bộ barber từ DB


export const getAllBarbers = async () => {
  try {
    const barbers = await db.Barber.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["fullName", "createdAt"] },
        { model: db.Branch, as: "branch", attributes: ["name"] },
        { model: db.BarberRatingSummary, as: "ratingSummary", attributes: ["avgRate"] },
        {
          model: db.Booking,
          as: "Bookings",
          attributes: ["idBooking", "idCustomer"], // 👈 lấy idCustomer để đếm khách
        },
      ],
    });

    if (!barbers.length) {
      return { message: "Không có dữ liệu barber." };
    }

    const now = new Date();

    const barberData = barbers.map((b) => {
      // 🔹 Tính kinh nghiệm (năm)
      const startDate = b.user?.createdAt ? new Date(b.user.createdAt) : now;
      const expYears = Math.max(0, now.getFullYear() - startDate.getFullYear());

      // 🔹 Tính số lượng khách hàng duy nhất
      const customerIds = b.Bookings?.map((bk) => bk.idCustomer).filter(Boolean) || [];
      const totalCustomers = new Set(customerIds).size;

      return {
        idBarber: b.idBarber,
        fullName: b.user?.fullName || "Chưa có tên",
        branchName: b.branch?.name || "Chưa có chi nhánh",
        exp: `${expYears} năm`,
        rating: Number(b.ratingSummary?.avgRate || 0).toFixed(1),
        customers: totalCustomers,
        isLocked: b.isLocked,
        isApproved: b.isApproved,
      };
    });

    return {
      total: barberData.length,
      barbers: barberData,
    };
  } catch (error) {
    console.error("Get All Barbers Error:", error);
    throw new Error("Lỗi server khi lấy danh sách barber: " + error.message);
  }
};

export const syncBarbersToPinecone = async () => {
  try {
    const barbers = await db.Barber.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["fullName"] },
        { model: db.Branch, as: "branch", attributes: ["name"] },
        { model: db.BarberRatingSummary, as: "ratingSummary", attributes: ["avgRate"] }, // 👈 thêm dòng này
      ],
    });

    if (!barbers.length) {
      return { message: " Không có dữ liệu barber để đồng bộ." };
    }

    const barberData = barbers.map((b) => ({
      idBarber: b.idBarber,
      idBranch: b.idBranch,
      fullName: b.user?.fullName || "Chưa có tên",
      branchName: b.branch?.name || "Chưa có chi nhánh",
      profileDescription: b.profileDescription || "Không có mô tả",
      avgRate: b.ratingSummary?.avgRate || 0,
      displayText: `Tên barber: ${b.user?.fullName || "Chưa có tên"}, Chi nhánh: ${b.branch?.name || "Chưa có chi nhánh"}, Mô tả: ${b.profileDescription || "Không có mô tả"}, Đánh giá trung bình: ${b.ratingSummary?.avgRate || 0}`,
    }));


    await upsertBarbers(barberData);

    return { message: "Barber data synced to Pinecone (test).", total: barberData.length };
  } catch (error) {

    return { message: " Lỗi server", error: error.message };
  }
};

export const assignUserAsBarber = async (data) => {
  const t = await db.sequelize.transaction();
  try {
    const { idUser, idBranch, profileDescription } = data;

    // 1️⃣ Kiểm tra user tồn tại
    const user = await db.User.findByPk(idUser);
    if (!user) {
      throw new Error("Không tìm thấy user");
    }

    // 2️⃣ Cập nhật role = 'barber' (nếu chưa phải barber)
    if (user.role !== "barber") {
      user.role = "barber";
      await user.save({ transaction: t });
    }

    // 3️⃣ Kiểm tra xem đã có record trong bảng barbers chưa
    let barber = await db.Barber.findByPk(idUser);

    if (!barber) {
      // 🔹 Nếu chưa có thì tạo mới
      barber = await db.Barber.create(
        {
          idBarber: idUser,
          idBranch: idBranch || null,
          profileDescription: profileDescription || "Chưa có mô tả",
          isLocked: false,
        },
        { transaction: t }
      );
    } else {
      // 🔹 Nếu có rồi thì cập nhật
      barber.idBranch = idBranch ?? barber.idBranch;
      barber.profileDescription = profileDescription ?? barber.profileDescription;
      await barber.save({ transaction: t });
    }

    await t.commit();

    return {
      message: "Phân công user thành barber thành công",
      user,
      barber,
    };
  } catch (error) {
    await t.rollback();
    throw new Error("Lỗi khi phân công user thành barber: " + error.message);
  }
};

export const assignBarberToBranch = async (idBarber, idBranch) => {
  const barber = await Barber.findByPk(idBarber);
  if (!barber) throw new Error("Khong tìm thấy barber");
  barber.idBranch = idBranch;
  await barber.save();
  return barber;
};

export const approveBarber = async (idBarber) => {
  const barber = await Barber.findByPk(idBarber);
  if (!barber) throw new Error("Khong tìm thấy barber");
  barber.isApproved = true;
  await barber.save();
  return barber;
};

export const lockBarber = async (idBarber) => {
  const barber = await Barber.findByPk(idBarber);
  if (!barber) throw new Error("Khong tìm thấy barber");
  barber.isLocked = true;
  await barber.save();
  return barber;
};

export const unlockBarber = async (idBarber) => {
  const barber = await Barber.findByPk(idBarber);
  if (!barber) throw new Error("Khong tìm thấy barber");
  barber.isLocked = false;
  await barber.save();
  return barber;
};

export const calculateBarberReward = async (idBarber) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  // === 1️⃣ Tính tổng doanh thu & tip thực tế của barber ===
  const result = await db.Barber.findOne({
    where: { idBarber },
    include: [
      {
        model: db.Booking,
        as: "Bookings",
        required: false,
        where: {
          isPaid: true,
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
    ],
    group: ["Barber.idBarber"],
    raw: true,
  });

  const serviceRevenue = parseFloat(result?.serviceRevenue || 0);
  const tipAmount = parseFloat(result?.tipAmount || 0);

  // === 2️⃣ Lấy toàn bộ mốc thưởng ===
  const rewardRules = await db.BonusRule.findAll({
    where: { active: true },
    order: [["minRevenue", "ASC"]],
    raw: true,
  });

  if (!rewardRules || rewardRules.length === 0)
    throw new Error("Không có mốc thưởng nào trong hệ thống.");

  // === 3️⃣ Xác định mốc hiện tại và mốc kế tiếp ===
  let currentRule = rewardRules[0];
  let nextRule = null;

  for (let i = 0; i < rewardRules.length; i++) {
    if (serviceRevenue >= rewardRules[i].minRevenue) {
      currentRule = rewardRules[i];
      nextRule = rewardRules[i + 1] || null;
    }
  }

  // === 4️⃣ Tính thưởng ===
  const bonus = Math.floor((serviceRevenue * currentRule.bonusPercent) / 100);
  const percentRevenue = nextRule
    ? Math.min((serviceRevenue / nextRule.minRevenue) * 100, 100)
    : 100;

  return {
    idBarber,
    month,
    year,
    serviceRevenue,
    tipAmount,
    bonus,
    percentRevenue,
    currentRule,
    nextRule,
    rewardRules,
  };
};
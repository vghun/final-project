import db from "../models/index.js";

// Lấy danh sách chi nhánh
export const getBranches = async (req, res) => {
  try {
    const branches = await db.Branch.findAll({
      attributes: ["idBranch", "name", "address", "openTime", "closeTime", "status", "slotDuration"],
    });
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách chi nhánh", error });
  }
};

// Lấy chi tiết chi nhánh (barbers + services)
export const getBranchDetails = async (req, res) => {
  try {
    const { idBranch } = req.params;

<<<<<<< HEAD
    // Tìm chi nhánh
    const branch = await db.Branch.findByPk(idBranch);
    if (!branch) {
      return res.status(404).json({ message: "Không tìm thấy chi nhánh" });
    }

    // Lấy danh sách barber và dịch vụ qua bảng ServiceAssignment
    const assignments = await db.ServiceAssignment.findAll({
      where: { idBranch },
      include: [
        {
          model: db.Barber,
          include: [{ model: db.User, as: "user", attributes: ["idUser", "fullName", "email"] }],
        },
        {
          model: db.Service,
          attributes: ["idService", "name", "description", "price", "duration", "status"],
=======
    const branch = await db.Branch.findByPk(idBranch, {
      include: [
        {
          model: db.Barber,
          as: "barbers", // dùng đúng alias đã định nghĩa
          attributes: ["idBarber", "profileDescription"],
          include: [
            {
              model: db.User,
              as: "user", // alias đúng
              attributes: ["idUser", "fullName", "email"],
            },
          ],
        },
        {
          model: db.Service,
          as: "services", // alias đúng
          attributes: ["idService", "name", "description", "price", "duration", "status"],
          through: { attributes: [] },
>>>>>>> origin/main
        },
      ],
    });

<<<<<<< HEAD
    // Gom dữ liệu lại
    const barbers = [];
    const services = [];

    assignments.forEach((a) => {
      if (a.Barber && !barbers.find((b) => b.idBarber === a.Barber.idBarber)) {
        barbers.push({
          idBarber: a.Barber.idBarber,
          name: a.Barber.user?.fullName || "N/A",
          profileDescription: a.Barber.profileDescription,
        });
      }
      if (a.Service && !services.find((s) => s.idService === a.Service.idService)) {
        services.push({
          idService: a.Service.idService,
          name: a.Service.name,
          description: a.Service.description,
          price: a.Service.price,
          duration: a.Service.duration,
          status: a.Service.status,
        });
      }
    });

    res.json({ branch, barbers, services });
  } catch (error) {
=======
    if (!branch) {
      return res.status(404).json({ message: "Không tìm thấy chi nhánh" });
    }

    res.json(branch);
  } catch (error) {
    console.error(error);
>>>>>>> origin/main
    res.status(500).json({ message: "Lỗi khi lấy chi tiết chi nhánh", error });
  }
};

// Tạo booking
export const createBooking = async (req, res) => {
  try {
    const { idCustomer, idBranch, idBarber, bookingDate, bookingTime, services, description } = req.body;

    // Tạo booking
    const booking = await db.Booking.create({
      idCustomer,
      idBranch,
      idBarber,
      bookingDate,
      bookingTime,
      status: "Pending",
      description,
    });

    // Thêm dịch vụ vào bookingDetail
    if (services && services.length > 0) {
      for (const s of services) {
        await db.BookingDetail.create({
          idBooking: booking.idBooking,
          idService: s.idService,
          quantity: s.quantity || 1,
          price: s.price,
        });
      }
    }

    res.status(201).json({ message: "Đặt lịch thành công", booking });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo booking", error });
  }
};
<<<<<<< HEAD
=======

// Lấy danh sách các booking của 1 barber
export const getBookingsByBarber = async (req, res) => {
  try {
    const { idBarber } = req.params;

    // Lấy danh sách booking
    const bookings = await db.Booking.findAll({
      where: { idBarber },
      attributes: ["idBooking", "bookingDate", "bookingTime", "status"],
      order: [
        ["bookingDate", "DESC"],
        ["bookingTime", "ASC"],
      ],
    });

    // Lấy danh sách ngày nghỉ
    const unavailabilities = await db.BarberUnavailability.findAll({
      where: { idBarber },
      attributes: ["idUnavailable", "startDate", "endDate", "reason"],
      order: [["startDate", "DESC"]],
    });

    res.json({
      bookings,
      unavailabilities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy thời gian booking và ngày nghỉ của barber",
      error,
    });
  }
};
>>>>>>> origin/main

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
        },
      ],
    });

    if (!branch) {
      return res.status(404).json({ message: "Không tìm thấy chi nhánh" });
    }

    res.json(branch);
  } catch (error) {
    console.error(error);
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

// Lấy danh sách các booking của 1 barber
export const getBookingsByBarber = async (req, res) => {
  try {
    const { idBarber } = req.params;

    const bookings = await db.Booking.findAll({
      where: { idBarber },
      attributes: ["idBooking", "bookingDate", "bookingTime", "status"],
      order: [
        ["bookingDate", "DESC"],
        ["bookingTime", "ASC"],
      ],
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thời gian booking của barber", error });
  }
};

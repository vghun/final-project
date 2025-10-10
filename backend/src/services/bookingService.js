import db from "../models/index.js";
import { Op } from "sequelize";

// Lấy tất cả chi nhánh
export const getAllBranches = async () => {
  const branches = await db.Branch.findAll({
    attributes: ["idBranch", "name", "address", "openTime", "closeTime", "status", "slotDuration"],
  });
  return branches;
};

// Lấy chi tiết chi nhánh (barbers + services)
export const getBranchDetail = async (branchId) => {
  const branch = await db.Branch.findByPk(branchId, {
    attributes: ["idBranch", "name", "address", "openTime", "closeTime", "status", "slotDuration"],
    include: [
      {
        model: db.ServiceAssignment,
        include: [
          {
            model: db.Service,
            attributes: ["idService", "name", "description", "price", "duration", "status"],
          },
          {
            model: db.Barber,
            attributes: ["idBarber", "profileDescription"],
            include: [
              {
                model: db.User,
                as: "user",
                attributes: ["idUser", "fullName", "email"],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!branch) return null;

  // Gom nhóm lại barber + service
  const barbers = [];
  const services = [];

  branch.ServiceAssignments.forEach((assign) => {
    // Chuẩn hóa dữ liệu barber
    if (assign.Barber && !barbers.find((b) => b.idBarber === assign.Barber.idBarber)) {
      barbers.push({
        idBarber: assign.Barber.idBarber,
        name: assign.Barber.user?.fullName || "N/A",
        profileDescription: assign.Barber.profileDescription,
      });
    }

    // Chuẩn hóa dữ liệu service
    if (assign.Service && !services.find((s) => s.idService === assign.Service.idService)) {
      services.push({
        idService: assign.Service.idService,
        name: assign.Service.name,
        description: assign.Service.description,
        price: assign.Service.price,
        duration: assign.Service.duration,
        status: assign.Service.status,
      });
    }
  });

  return {
    branch: {
      idBranch: branch.idBranch,
      name: branch.name,
      address: branch.address,
      openTime: branch.openTime,
      closeTime: branch.closeTime,
      status: branch.status,
      slotDuration: branch.slotDuration,
      createdAt: branch.createdAt,
      updatedAt: branch.updatedAt,
    },
    barbers,
    services,
  };
};

// Tạo booking
export const createBookingService = async ({
  idCustomer,
  idBranch,
  idBarber,
  bookingDate,
  bookingTime,
  services,
  description,
}) => {
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

  // Thêm dịch vụ chi tiết
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

  return booking;
};

// Lấy danh sách booking theo id thợ và khoảng ngày
export const getBarberBookings = async (barberId, startDate, endDate) => {
  return await db.Booking.findAll({
    where: {
      idBarber: barberId,
      bookingDate: { [Op.between]: [startDate, endDate] },
    },
    include: [
      {
        model: db.Customer,
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["fullName", "phoneNumber", "image"],
          },
        ],
        attributes: ["idCustomer"], // Chỉ lấy idCustomer từ Customer
      },
      {
        model: db.BookingDetail,
        as: "BookingDetails",
        include: [
          {
            model: db.Service,
            as: "service",
            attributes: ["name", "duration", "price"],
          },
        ],
        attributes: ["idBookingDetail", "quantity", "price"],
      },
    ],
    order: [
      ["bookingDate", "ASC"],
      ["bookingTime", "ASC"],
    ],
  });
};

export const completeBooking = async (idBooking, idBarber, uploadedImages, description) => {
  const booking = await db.Booking.findByPk(idBooking);
  if (!booking) throw new Error("Không tìm thấy lịch hẹn");

  // Lưu ảnh vào bảng CustomerGallery
  for (const img of uploadedImages) {
    await db.CustomerGallery.create({
      idBooking,
      uploadBy: idBarber,
      imageUrl: img.url,
      description: description || null,
    });
  }

  // Cập nhật trạng thái
  await booking.update({
    status: "Completed",
    description,
  });

  return {
    idBooking,
    status: "Completed",
    uploadedCount: uploadedImages.length,
  };
};
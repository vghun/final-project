import db from "../models/index.js";
import * as bookingService from "../services/bookingService.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
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

export const getBookingsForBarber = async (req, res) => {
  try {
    const { idBarber, start, end } = req.query;

    if (!idBarber || !start || !end) {
      return res.status(400).json({ error: "Thiếu idBarber, start hoặc end" });
    }

    const bookings = await bookingService.getBarberBookings(
      parseInt(idBarber),
      start,
      end
    );
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "customer-gallery",
    resource_type: "image",
  }),
});

export const upload = multer({ storage });

export const completeBooking = async (req, res) => {
  try {
    const idBooking = req.params.id;
    const { description } = req.body;
    const idBarber = 7; // ⚓️ fix cứng cho test

    const files = req.files || {};
    const uploadedImages = [];

    // Lưu vị trí ảnh (front, left, right, back)
    for (const pos of ["front", "left", "right", "back"]) {
      const file = files[pos]?.[0];
      if (file) {
        uploadedImages.push({
          position: pos,
          url: file.path,
        });
      }
    }

    if (uploadedImages.length === 0)
      return res.status(400).json({ error: "Cần upload ít nhất 1 ảnh" });

    const result = await bookingService.completeBooking(
      idBooking,
      idBarber,
      uploadedImages,
      description
    );

    return res.status(200).json({
      message: "Đã hoàn tất lịch hẹn và lưu ảnh vào gallery khách hàng",
      ...result,
      uploadedImages,
    });
  } catch (err) {
    console.error("Lỗi hoàn tất lịch hẹn:", err);
    return res.status(500).json({ error: err.message });
  }
};
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

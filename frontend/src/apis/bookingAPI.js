import axios from "axios";

const API_URL = "http://localhost:8088/api/bookings";

const bookingApi = {
  // Lấy tất cả booking
  getBooking: () => axios.get(API_URL),

  // Lấy booking của barber theo khoảng ngày
  getForBarber: (idBarber, start, end) =>
    axios.get(`${API_URL}/barber?idBarber=${idBarber}&start=${start}&end=${end}`),

  // Hoàn tất booking (upload ảnh)
  completeBooking: (idBooking, data) =>
    axios.post(`${API_URL}/${idBooking}/complete`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Lấy booked slots của barber theo ngày
  getBookedSlots: (idBarber, branchId, date) =>
    axios.get(`${API_URL}/barbers/${idBarber}/booked-slots?branchId=${branchId}&date=${date}`),

  // Tạo booking mới
  createBooking: (bookingData) =>
    axios.post(`${API_URL}`, bookingData),
};

export default bookingApi;

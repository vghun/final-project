import axios from "axios";

const API_URL = "http://localhost:8088/api/bookings";

const bookingApi = {
  getBooking: () => axios.get(API_URL),
   getForBarber: (idBarber, start, end) =>
    axios.get(`${API_URL}/barber?idBarber=${idBarber}&start=${start}&end=${end}`),
  completeBooking: (idBooking, data) =>
    axios.post(`${API_URL}/${idBooking}/complete`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default bookingApi;

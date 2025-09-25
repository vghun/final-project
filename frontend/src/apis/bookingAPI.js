import axios from "axios";

const API_URL = "http://localhost:3000/booking";

const bookingApi = {
  getBooking: () => axios.get(API_URL),
};

export default bookingApi;

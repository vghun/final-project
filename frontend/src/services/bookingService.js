import bookingApi from "~/apis/bookingAPI";

export const bookingService = {
  getBooking: async () => {
    try {
      const response = await bookingApi.getBooking();
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },
  
};
export const fetchBookingsForBarber = async (idBarber, start, end) => {
  const res = await bookingApi.getForBarber(idBarber, start, end);
  return res.data;
};

export const completeBooking = async (idBooking, formData) => {
  const res = await bookingApi.completeBooking(idBooking, formData);
  return res.data;
};

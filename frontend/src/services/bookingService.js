import bookingApi from "~/apis/bookingAPI";

const bookingService = {
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

export default bookingService;

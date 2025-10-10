import axios from "axios";

const API_URL = "http://localhost:8088/api/customer-gallery";

const customerGalleryApi = {
  getByBarber: (barberId) => axios.get(`${API_URL}/barber/${barberId}`),

};

export default customerGalleryApi;

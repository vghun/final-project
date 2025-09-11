import axios from "axios";

const API_URL = "http://localhost:8088/api/products";

const productApi = {
  getAll: () => axios.get(API_URL),
  getLatest: () => axios.get(`${API_URL}/latest`),
  getBestSelling: () => axios.get(`${API_URL}/best-selling`),
  getMostViewed: () => axios.get(`${API_URL}/most-viewed`),
  getTopDiscount: () => axios.get(`${API_URL}/top-discount`),
  getById: (id) => axios.get(`${API_URL}/${id}`),
  getPaged: (page = 1, limit = 15) =>
  axios.get(`${API_URL}?page=${page}&limit=${limit}`),
};

export default productApi;

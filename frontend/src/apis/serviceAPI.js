import axios from "axios";

const API_URL = "http://localhost:8088/api/services";

const serviceApi = {
  getLatest: () => axios.get(`${API_URL}/latest`),
  getHot: () => axios.get(`${API_URL}/hot`),
  getById: (id) => axios.get(`${API_URL}/${id}`),
};

export default serviceApi;

import axios from "axios";

const API_URL = "http://localhost:8088/api/services";

const serviceApi = {
  getHotPaged: (page = 1, limit = 4) =>
    axios.get(`${API_URL}/hot?page=${page}&limit=${limit}`)
};

export default serviceApi;

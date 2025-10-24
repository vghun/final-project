import axios from "axios";

const API_URL = "http://localhost:8088/api/hashtags";

const hashtagApi = {
  getSuggestions: (query) => axios.get(`${API_URL}?q=${encodeURIComponent(query)}`),

};

export default hashtagApi;

import axios from "axios";

const API_URL = "http://localhost:8088/api/reels";

const reelApi = {
  getPaged: (page = 1, limit = 10, idUser = null) => {
    const query = idUser 
      ? `?page=${page}&limit=${limit}&idUser=${idUser}` 
      : `?page=${page}&limit=${limit}`;
    return axios.get(`${API_URL}${query}`);
  },

  getById: (id) =>
    axios.get(`${API_URL}/${id}`),

  upload: (formData) =>
    axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  like: (idReel, idUser) =>
    axios.post(`${API_URL}/${idReel}/like`, { idUser }),

  getComments: (idReel) =>
    axios.get(`${API_URL}/${idReel}/comments`),

  addComment: (idReel, idUser, content) =>
    axios.post(`${API_URL}/${idReel}/comment`, { idUser, content }),

  addReply: (idComment, idUser, content) =>
    axios.post(`${API_URL}/comment/${idComment}/reply`, { idUser, content }),

  updateComment: (idComment, content) =>
    axios.put(`${API_URL}/comment/${idComment}`, { content }),

  deleteComment: (idComment) =>
    axios.delete(`${API_URL}/comment/${idComment}`),

   trackView: (idReel, idUser) =>
    axios.post(`${API_URL}/${idReel}/view`, { idUser }),
   search: (keyword, idUser = null) => {
    const query = idUser
      ? `/search?q=${encodeURIComponent(keyword)}&idUser=${idUser}`
      : `/search?q=${encodeURIComponent(keyword)}`;
    return axios.get(`${API_URL}${query}`);
   },
};

export default reelApi;

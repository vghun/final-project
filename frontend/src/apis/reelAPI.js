import axios from "axios";

const API_URL = "http://localhost:8088/api/reels";

const reelApi = {
  getPaged: (page = 1, limit = 10, idUser) =>
    axios.get(`${API_URL}?page=${page}&limit=${limit}&idUser=${idUser}` ),

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
};

export default reelApi;

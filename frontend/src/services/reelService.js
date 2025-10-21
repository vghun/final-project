import reelApi from "~/apis/reelAPI";

export const fetchReelsPaged = async (page = 1, limit = 10, idUser = null) => {
  const res = await reelApi.getPaged(page, limit, idUser);
  return res.data;
};

export const fetchReelById = async (id) => {
  const res = await reelApi.getById(id);
  return res.data;
};

export const uploadReel = async (formData) => {
  const res = await reelApi.upload(formData);
  return res.data;
};

export const likeReel = async (idReel, idUser) => {
  const res = await reelApi.like(idReel, idUser);
  return res.data;
};

export const getComments = async (idReel) => {
  const res = await reelApi.getComments(idReel);
  return res.data;
};

export const addComment = async (idReel, idUser, content) => {
  const res = await reelApi.addComment(idReel, idUser, content);
  return res.data;
};

export const addReply = async (idComment, idUser, content) => {
  const res = await reelApi.addReply(idComment, idUser, content);
  return res.data;
};

export const updateComment = async (idComment, content) => {
  const res = await reelApi.updateComment(idComment, content);
  return res.data;
};

export const deleteComment = async (idComment) => {
  const res = await reelApi.deleteComment(idComment);
  return res.data;
};

export const trackReelView = async (idReel, idUser) => {
  if (!idUser) return; // Không cần gọi API nếu người xem chưa đăng nhập
  const res = await reelApi.trackView(idReel, idUser);
  return res.data;
};

export const searchReels = async (keyword, idUser = null) => {
  const res = await reelApi.search(keyword, idUser);
  return res.data;
};


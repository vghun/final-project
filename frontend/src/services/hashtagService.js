import hashtagApi from "~/apis/hashtagAPI";

export const getHashtags = async (query) => {
  const res = await hashtagApi.getSuggestions(query);
  return res.data;
};
export const getTopHashtags = async () => {
  const res = await hashtagApi.getTopHashtags();
  return res.data;
};

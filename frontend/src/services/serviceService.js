import serviceApi from "~/apis/serviceAPI";

export const fetchLatestServices = async () => {
  const res = await serviceApi.getLatest();
  return res.data;
};

export const fetchHotServices = async () => {
  const res = await serviceApi.getHot();
  return res.data;
};

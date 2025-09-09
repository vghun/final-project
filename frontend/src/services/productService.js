import productApi from "~/apis/productApi";

export const fetchLatestProducts = async () => {
  const res = await productApi.getLatest();
  return res.data;
};

export const fetchBestSellingProducts = async () => {
  const res = await productApi.getBestSelling();
  return res.data;
};

export const fetchMostViewedProducts = async () => {
  const res = await productApi.getMostViewed();
  return res.data;
};

export const fetchTopDiscountProducts = async () => {
  const res = await productApi.getTopDiscount();
  return res.data;
};

import customerGalleryApi from "~/apis/customerGalleryAPI";

export const fetchBarberGallery = async (barberId) => {
  const res = await customerGalleryApi.getByBarber(barberId);
  return res.data;
};

export const fetchCustomerGallery = async (token) => {
  const res = await customerGalleryApi.getByCustomer(token);
  return res.data;
};
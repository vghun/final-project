import customerGalleryApi from "~/apis/customerGalleryAPI";

export const fetchBarberGallery = async (barberId) => {
  const res = await customerGalleryApi.getByBarber(barberId);
  return res.data;
};

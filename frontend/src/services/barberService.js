import * as request from "~/apis/configs/httpRequest";

// 📋 Lấy tất cả barber
export const getAllBarbers = async () => {
  try {
    const res = await request.get("/api/barbers");
    console.log("API getAllBarbers trả về:", res);
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API getAllBarbers:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

export const assignUserAsBarber = async ({
  idUser,
  idBranch,
  profileDescription,
}) => {
  try {
    const res = await request.post("/api/barbers/assign-user", {
      idUser,
      idBranch,
      profileDescription,
    });
    console.log("API assignUserAsBarber trả về:", res);
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API assignUserAsBarber:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

export const assignBarberToBranch = async (payload) => {
  try {
    const res = await request.post("/api/barbers/assign-branch", payload);
    console.log("API assignBarberToBranch trả về:", res);
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API assignBarberToBranch:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

export const lockBarber = async (data) => {
  const res = await request.post("/api/barbers/lock", data);
  return res.data; // 👈 thêm dòng này để return data về frontend
};

export const unlockBarber = async (data) => {
  const res = await request.post("/api/barbers/unlock", data);
  return res.data;
};

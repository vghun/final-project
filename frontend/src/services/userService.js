import * as request from "~/apis/configs/httpRequest";

// Lấy thông tin user hiện tại
export const getProfile = async (token) => {
  try {
    const res = await request.get("/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("API getProfile trả về:", res);
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cập nhật thông tin user (fullName, email, phoneNumber, avatar)
export const updateProfile = async (token, data) => {
  try {
    const res = await request.put("/profile", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("API updateProfile trả về:", res);
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

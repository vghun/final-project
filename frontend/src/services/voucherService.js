import * as request from "~/apis/configs/httpRequest";

// Tạo voucher mới
export const createVoucher = async (voucherData) => {
  try {
    // Validate dữ liệu trước khi gửi xuống backend
    if (!voucherData.title || !voucherData.discountPercent || !voucherData.pointCost || !voucherData.expiryDate) {
      throw { message: "Missing required voucher fields" };
    }

    // Gọi API backend tại đường dẫn /api/vouchers
    const res = await request.post("/api/vouchers", voucherData);
    console.log("API createVoucher trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi gọi API createVoucher:", error.response?.data || error);
    throw error.response?.data || error;
  }
};
export const getAllVouchers = async () => {
  try {
    const res = await request.get("/api/vouchers");
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

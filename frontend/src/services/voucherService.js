import * as request from "~/apis/configs/httpRequest";

// Tạo voucher mới
export const createVoucher = async (voucherData) => {
  try {
    if (!voucherData.title || !voucherData.discountPercent || !voucherData.pointCost || !voucherData.expiryDate) {
      throw { message: "Missing required voucher fields" };
    }
    const res = await request.post("/api/vouchers", voucherData);
    console.log("API createVoucher trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi gọi API createVoucher:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Lấy tất cả voucher
export const getAllVouchers = async () => {
  try {
    const res = await request.get("/api/vouchers");
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cập nhật voucher (sửa thông tin)
export const updateVoucher = async (idVoucher, updateData) => {
  try {
    const res = await request.put(`/api/vouchers/${idVoucher}`, updateData);
    console.log("API updateVoucher trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi gọi API updateVoucher:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Soft delete voucher (chỉ set status = false)
export const deleteVoucher = async (idVoucher) => {
  try {
    const res = await request.put(`/api/vouchers/${idVoucher}`, { status: false });
    console.log("API deleteVoucher (soft delete) trả về:", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi gọi API deleteVoucher:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

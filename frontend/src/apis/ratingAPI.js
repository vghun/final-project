import * as ratingService from "~/services/ratingService";

export const RatingAPI = {
  // 📋 Lấy bảng đánh giá thợ theo idBarber
  getByBarber: async (idBarber) => {
    try {
      const result = await ratingService.getRatingSummaryByBarber(idBarber);
      return result;
    } catch (error) {
      console.error("RatingAPI.getByBarber lỗi:", error);
      throw error;
    }
  },

  // ✏️ Cập nhật đánh giá thợ
  update: async (idBarber, newRate) => {
    try {
      const result = await ratingService.updateRating(idBarber, newRate);
      return result;
    } catch (error) {
      console.error("RatingAPI.update lỗi:", error);
      throw error;
    }
  },

  // 📊 Lấy tất cả đánh giá thợ theo chi nhánh
  getByBranch: async (idBranch) => {
    try {
      const result = await ratingService.getAllRatingsByBranch(idBranch);
      return result;
    } catch (error) {
      console.error("RatingAPI.getByBranch lỗi:", error);
      throw error;
    }
  },
};

import * as reelService from "../services/reelService.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, idUser } = req.query;
    const result = await reelService.getAllReels(page, limit, idUser);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể lấy reels" });
  }
};

export const uploadReel = async (req, res) => {
  try {
    // Multer đã xử lý files và body trước khi đến đây
    const newReel = await reelService.uploadReel(req.body, req.files);
    res.json(newReel);
  } catch (err) {
    console.error("Upload reel lỗi:", err);
    res.status(500).json({ error: err.message || "Upload reel thất bại" });
  }
};

export const getById = async (req, res) => {
  try {
    const { idUser } = req.query;
    const reel = await reelService.getReelById(req.params.id, idUser);
    if (!reel) return res.status(404).json({ error: "Không tìm thấy reel" });
    res.json(reel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy chi tiết reel" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    // Giả định idUser được gửi trong body
    const { idUser } = req.body; 
    const idReel = req.params.id;
    const result = await reelService.toggleLikeReel(idReel, idUser);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi like/unlike" });
  }
};

// --- NEW API: Ghi nhận lượt xem (Unique View Tracking) ---
export const trackView = async (req, res) => {
    try {
        const idReel = parseInt(req.params.id);
        // Giả định idUser được gửi trong body, nên kiểm tra tính hợp lệ
        const idUser = parseInt(req.body.idUser); 

        if (isNaN(idReel) || isNaN(idUser)) {
            return res.status(400).json({ error: "ID Reel hoặc User không hợp lệ." });
        }

        await reelService.trackReelView(idReel, idUser);
        
        // Không cần trả về view count mới, chỉ cần xác nhận thành công
        res.status(200).json({ message: "View tracked successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi ghi nhận lượt xem." });
    }
};
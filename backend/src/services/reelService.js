import db from "../models/index.js";
import sequelize from "sequelize"; // Import sequelize để sử dụng các hàm như COUNT
const { Reel, ReelLike, ReelComment, ReelView, Barber, User, Sequelize } = db;

/**
 * Ghi nhận lượt xem vĩnh viễn (Persistent View Tracking) vào DB.
 * Mỗi User chỉ tính 1 view duy nhất cho mỗi Reel.
 *
 * @param {number} idReel - ID của Reel.
 * @param {number} idUser - ID của User đang xem.
 */
export const trackReelView = async (idReel, idUser) => {
    // Không theo dõi view nếu không có người dùng đăng nhập
    if (!idUser) return;

    try {
        // Upsert: Tìm bản ghi (idReel, idUser), nếu tìm thấy thì cập nhật lastViewedAt, nếu không thì tạo mới
        const [view, created] = await ReelView.upsert({
            idReel: idReel,
            idUser: idUser,
            lastViewedAt: new Date(),
        }, {
            where: { idReel, idUser }
        });

        if (created) {
            console.log(`[ReelView] Reel ${idReel} recorded first view by User ${idUser}.`);
        } else {
            console.log(`[ReelView] Reel ${idReel} updated view time for User ${idUser}.`);
        }
        
    } catch (error) {
        console.error('Error tracking persistent reel view:', error);
        throw new Error('Could not track reel view.');
    }
};

export const getAllReels = async (page = 1, limit = 10, idUser) => {
  const reels = await Reel.findAll({
    offset: (page - 1) * limit,
    limit: parseInt(limit),
    order: [["createdAt", "DESC"]],
    attributes: {
      include: [
        // ✅ Đếm view
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT rv.idUser)
            FROM reel_views AS rv
            WHERE rv.idReel = Reel.idReel
          )`),
          "viewCount",
        ],
        // ✅ Đếm like
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM reel_likes AS rl
            WHERE rl.idReel = Reel.idReel
          )`),
          "likesCount",
        ],
        // ✅ Đếm comment
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM reel_comments AS rc
            WHERE rc.idReel = Reel.idReel
          )`),
          "commentsCount",
        ],
      ],
    },
    include: [
      {
        model: Barber, 
        required: true,
        attributes: ["idBarber"], // Chỉ cần lấy idBarber, các trường khác là từ User
        
        include: [
          {
            model: User, 
            as: "user", 
            attributes: ["fullName", "image"], // Lấy thông tin cần thiết
            required: true,
          },
        ],
      },
      {
        model: ReelLike,
        as: "ReelLikes",
        attributes: ["idUser"],
        required: false,
      },
      {
        model: ReelComment,
        as: "ReelComments",
        attributes: ["idComment"],
        required: false,
      },
    ],
  });

  return reels.map((r) => {
    const plain = r.get({ plain: true });
    return {
      ...plain,
      viewCount: parseInt(plain.viewCount) || 0,
      likesCount: parseInt(plain.likesCount) || 0,
      commentsCount: parseInt(plain.commentsCount) || 0,
      isLiked: idUser
        ? plain.ReelLikes?.some((like) => like.idUser == idUser)
        : false,
    };
  });
};


// --- Upload video ---
export const uploadReel = async (body, files) => {
  const { title, description, idBarber } = body;
  const videoFile = files["video"]?.[0];
  const thumbnailFile = files["thumbnail"]?.[0];

  if (!videoFile) throw new Error("Cần upload video");

  let thumbnailUrl;
  if (thumbnailFile) {
    thumbnailUrl = thumbnailFile.path;
  } else {
    // Tùy chọn: Tên file thumb mặc định (nếu cần)
    thumbnailUrl = videoFile.path 
      .replace("/upload/", "/upload/so_1/")
      .replace(/\.mp4$/, ".jpg"); 
  }

  return await Reel.create({
    idBarber,
    title,
    description,
    url: videoFile.path,
    thumbnail: thumbnailUrl,
  });
};

// --- Chi tiết 1 reel ---
export const getReelById = async (id, idUser) => {
  const reel = await Reel.findByPk(id, {
    attributes: [
      'idReel', 'idBarber', 'title', 'url', 'thumbnail', 'description', 'createdAt', 
      [sequelize.fn('COUNT', sequelize.col('ReelViews.idUser')), 'viewCount']
    ],
    group: ['Reel.idReel', 'ReelLikes.idUser', 'ReelLikes.idReelLike', 'ReelComments.idComment', 'ReelComments.idComment'],
    include: [
      { model: ReelComment, as: "ReelComments", required: false },
      { model: ReelLike, as: "ReelLikes", attributes: ["idUser"], required: false },
      { model: ReelView, as: "ReelViews", attributes: [], required: false } // LEFT JOIN để đếm views
    ],
  });
  if (!reel) return null;

  const plain = reel.get({ plain: true });
  return {
    ...plain,
    viewCount: parseInt(plain.viewCount) || 0,
    likesCount: plain.ReelLikes.length,
    commentsCount: plain.ReelComments.length,
    isLiked: idUser
      ? plain.ReelLikes.some((like) => like.idUser == idUser)
      : false,
  };
};

// --- Like / Unlike ---
export const toggleLikeReel = async (idReel, idUser) => {
  const existing = await ReelLike.findOne({ where: { idReel, idUser } });
  if (existing) {
    await existing.destroy();
  } else {
    await ReelLike.create({ idReel, idUser });
  }

  const count = await ReelLike.count({ where: { idReel } });
  return {
    liked: !existing,
    likesCount: count,
  };
};


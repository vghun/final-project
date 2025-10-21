import db from "../models/index.js";
import sequelize from "sequelize"; 
const { Reel, ReelLike, ReelComment, ReelView, Barber, User } = db;

/**
 * Theo dõi lượt xem (mỗi user chỉ tính 1 lần)
 */
export const trackReelView = async (idReel, idUser) => {
  if (!idUser) return;
  try {
    const [view, created] = await ReelView.upsert(
      {
        idReel,
        idUser,
        lastViewedAt: new Date(),
      },
      { where: { idReel, idUser } }
    );

    if (created)
      console.log(`[ReelView] Reel ${idReel} recorded first view by User ${idUser}.`);
    else console.log(`[ReelView] Reel ${idReel} updated view time for User ${idUser}.`);
  } catch (error) {
    console.error("Error tracking persistent reel view:", error);
    throw new Error("Could not track reel view.");
  }
};

/**
 * Lấy danh sách tất cả reels
 */
export const getAllReels = async (page = 1, limit = 10, idUser) => {
  const reels = await Reel.findAll({
    offset: (page - 1) * limit,
    limit: parseInt(limit),
    order: [["createdAt", "DESC"]],
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT rv.idUser)
            FROM reel_views AS rv
            WHERE rv.idReel = Reel.idReel
          )`),
          "viewCount",
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM reel_likes AS rl
            WHERE rl.idReel = Reel.idReel
          )`),
          "likesCount",
        ],
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
        attributes: ["idBarber"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["fullName", "image"],
            required: true,
          },
        ],
      },
      { model: ReelLike, as: "ReelLikes", attributes: ["idUser"], required: false },
      { model: ReelComment, as: "ReelComments", attributes: ["idComment"], required: false },
    ],
  });

  return reels.map((r) => {
    const plain = r.get({ plain: true });
    return {
      ...plain,
      viewCount: parseInt(plain.viewCount) || 0,
      likesCount: parseInt(plain.likesCount) || 0,
      commentsCount: parseInt(plain.commentsCount) || 0,
      isLiked: idUser ? plain.ReelLikes?.some((like) => like.idUser == idUser) : false,
    };
  });
};

/**
 * Upload reel mới
 */
export const uploadReel = async (body, files) => {
  const { title, description, idBarber } = body;
  const videoFile = files["video"]?.[0];
  const thumbnailFile = files["thumbnail"]?.[0];

  if (!videoFile) throw new Error("Cần upload video");

  let thumbnailUrl;
  if (thumbnailFile) {
    thumbnailUrl = thumbnailFile.path;
  } else {
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

/**
 * Lấy chi tiết 1 reel
 */
export const getReelById = async (id, idUser) => {
  const reel = await Reel.findByPk(id, {
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT rv.idUser)
            FROM reel_views AS rv
            WHERE rv.idReel = Reel.idReel
          )`),
          "viewCount",
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM reel_likes AS rl
            WHERE rl.idReel = Reel.idReel
          )`),
          "likesCount",
        ],
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
        attributes: ["idBarber"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["fullName", "image"],
            required: true,
          },
        ],
      },
      { model: ReelComment, as: "ReelComments", required: false },
      { model: ReelLike, as: "ReelLikes", attributes: ["idUser"], required: false },
    ],
  });

  if (!reel) return null;

  const plain = reel.get({ plain: true });
  return {
    ...plain,
    viewCount: parseInt(plain.viewCount) || 0,
    likesCount: parseInt(plain.likesCount) || 0,
    commentsCount: parseInt(plain.commentsCount) || 0,
    isLiked: idUser ? plain.ReelLikes?.some((like) => like.idUser == idUser) : false,
  };
};

/**
 * Like / Unlike reel
 */
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

/**
 * Tìm kiếm reel theo tiêu đề hoặc mô tả
 */
export const searchReelsService = async (query, idUser) => {
  const keyword = query?.trim().toLowerCase();
  if (!keyword) return [];

  const reels = await Reel.findAll({
    where: {
      [sequelize.Op.or]: [
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("Reel.title")),
          { [sequelize.Op.like]: `%${keyword}%` }
        ),
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("Reel.description")),
          { [sequelize.Op.like]: `%${keyword}%` }
        ),
      ],
    },
    order: [["createdAt", "DESC"]],
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT rv.idUser)
            FROM reel_views AS rv
            WHERE rv.idReel = Reel.idReel
          )`),
          "viewCount",
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM reel_likes AS rl
            WHERE rl.idReel = Reel.idReel
          )`),
          "likesCount",
        ],
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
        attributes: ["idBarber"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["fullName", "image"],
            required: true,
          },
        ],
      },
      { model: ReelLike, as: "ReelLikes", attributes: ["idUser"], required: false },
      { model: ReelComment, as: "ReelComments", attributes: ["idComment"], required: false },
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

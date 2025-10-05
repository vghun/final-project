import React from "react";
import styles from "./VideoCard.module.scss";
import { likeReel } from "~/services/reelService";

function VideoCard({ reel, onToggleLike, onOpenDetail, idUser }) {
  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await likeReel(reel.idReel, idUser);
      onToggleLike(reel.idReel, res.liked, res.likesCount); // Pass backend response
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <div className={styles.card} onClick={() => onOpenDetail(reel)}>
      <div className={styles.videoBox}>
        <img src={reel.thumbnail} alt={reel.title} className={styles.videoThumb} />
        {reel.duration && <span className={styles.duration}>{reel.duration}</span>}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{reel.title}</h3>
        <p className={styles.desc}>{reel.description}</p>
        <div className={styles.meta}>
          <span>{reel.viewCount} lượt xem</span> •{" "}
          <span>{new Date(reel.createdAt).toLocaleDateString()}</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.likeBtn} onClick={handleLike}>
            <img
              src={reel.isLiked ? "/liked.png" : "/like.png"}
              alt="like"
              className={styles.likeIcon}
            />
            <span>{reel.likesCount || 0}</span>
          </button>

          <button
            className={styles.commentBtn}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(reel);
            }}
          >
            💬 {reel.commentsCount || 0}
          </button>

          <button
            className={styles.shareBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            🔗 Chia sẻ
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
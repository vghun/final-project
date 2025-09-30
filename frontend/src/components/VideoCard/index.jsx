// VideoCard.jsx
import React from "react";
import styles from "./VideoCard.module.scss";

function VideoCard({ reel, onToggleLike, onOpenDetail }) {
  return (
    <div className={styles.card} onClick={() => onOpenDetail(reel)}>
      <div className={styles.videoBox}>
        <img src={reel.thumbnail} alt={reel.title} className={styles.videoThumb} />
        <span className={styles.duration}>{reel.duration}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{reel.title}</h3>
        <p className={styles.desc}>{reel.description}</p>
        <div className={styles.meta}>
          <span>{reel.views} lượt xem</span> • <span>{reel.createdAt}</span>
        </div>
        <div className={styles.actions}>
          <button
            className={`${styles.likeBtn} ${reel.isLiked ? styles.liked : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(reel.id);
            }}
          >
            ❤️ {reel.likes}
          </button>
          <button className={styles.commentBtn} onClick={(e) => { e.stopPropagation(); onOpenDetail(reel); }}>
            💬 {reel.comments?.length || 0}
          </button>
          <button className={styles.shareBtn} onClick={(e) => e.stopPropagation()}>
            🔗 Chia sẻ
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
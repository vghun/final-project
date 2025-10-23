// src/components/VideoCard/index.jsx

import React from "react";
import styles from "./VideoCard.module.scss";
import { Heart, MessageCircle, Eye } from "lucide-react"; 

function VideoCard({ reel, onToggleLike, onOpenDetail}) {
  // Gán trực tiếp reel vào onOpenDetail vì nó đã được bọc bằng () => openDetail(idx) ở parent
  const handleOpenDetail = () => {
    onOpenDetail();
  };

  return (
    // Thêm class styles.reelCard cho container ngoài để áp dụng hover
    <div className={styles.reelCard} onClick={handleOpenDetail}>
      <div className={styles.videoBox}>
        {/* Thumbnail video */}
        <img src={reel.thumbnail} alt={reel.title} className={styles.videoThumb} />
        
        {/* 1. VIEW COUNT (Mặc định hiển thị, ở góc dưới trái) */}
        <div className={styles.viewCountFixed}>
            <Eye size={14} className={styles.viewIcon} />
            <span className={styles.viewCountText}>{reel.viewCount || 0}</span>
        </div>

        {/* 2. HOVER OVERLAY: LIKE & COMMENT COUNT (Ẩn mặc định) */}
        <div className={styles.hoverOverlay}>
            
            {/* LƯỢT THÍCH */}
            <div className={styles.statItem}>
                {/* Dùng Heart icon */}
                <Heart size={24} fill="currentColor" strokeWidth={1} /> 
                <span className={styles.statCount}>{reel.likesCount || 0}</span>
            </div>
            
            {/* LƯỢT BÌNH LUẬN */}
            <div className={styles.statItem}>
                <MessageCircle size={24} fill="currentColor" strokeWidth={1} />
                <span className={styles.statCount}>{reel.commentsCount || 0}</span>
            </div>
        </div>

        {/* Duration (Tùy chọn, có thể giữ hoặc bỏ) */}
        {reel.duration && <span className={styles.duration}>{reel.duration}</span>}
      </div>
    </div>
  );
}

export default VideoCard;
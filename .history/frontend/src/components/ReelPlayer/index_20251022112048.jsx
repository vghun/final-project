import React, { forwardRef, useRef, useEffect } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;

const ReelPlayer = forwardRef(({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
  const videoRef = useRef(null);
  const isViewTrackedRef = useRef(false);

  // TRUY CẬP DỮ LIỆU LỒNG NHAU (theo response API)
  const creator = reel.Barber?.user;
  const creatorFullName = creator?.fullName || "Barber ẩn danh";
  const creatorAvatar = creator?.image || "/user.png";
  const isLiked = reel.isLiked;
  // Sử dụng một placeholder URL nếu avatar bị null
  const avatarUrl = creatorAvatar === "/user.png" ? <User size={16} color="#000" /> : <img src={creatorAvatar} alt={`${creatorFullName}'s Avatar`} className={styles.avatar} />;

  useEffect(() => {
    // Reset ref khi reel thay đổi
    isViewTrackedRef.current = false;

    const trackViewAPI = async () => {
      if (!reel || !idUser) return;
      try {
        await trackReelView(reel.idReel, idUser);
        console.log(`View tracked successfully for Reel ${reel.idReel} after 3s.`);
      } catch (err) {
        console.error("View tracking failed:", err);
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current && videoRef.current.currentTime * 1000 >= MIN_VIEW_DURATION_MS) {
        if (!isViewTrackedRef.current) {
          trackViewAPI();
          isViewTrackedRef.current = true;
        }
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    if (reel && videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [reel, idUser]);

  return (
    // Dùng ref cho phần tử này nếu bạn vẫn muốn dùng trong list
    <div className={styles.reelItemContainer} ref={ref}>
        <div className={styles.reelItem}>
           
            {/* 1️⃣ Video Player (Rectangle 2 - Màu hồng nhạt) */}
            <video
                ref={videoRef}
                className={styles.video}
                src={reel.url}
                poster={reel.thumbnail}
                autoPlay
                loop
                muted
                playsInline
            />
            {/* 2️⃣ Thông tin nội dung (Profile + mô tả) */}
            <div className={styles.contentOverlay}>
                <div className={styles.profileInfo}>
                    {/* Giả định Avatar nằm trong icon/vị trí Username */}
                    {avatarUrl}
                    <span className={styles.username}>{creatorFullName}</span>
                </div>
                {/* Title: hello */}
                <p className={styles.titleText}>Title: {reel.title || "Không có tiêu đề"}</p>
               
            </div>
            {/* 3️⃣ Thanh tương tác bên phải */}
            <div className={styles.interactionBar}>
               
                {/* User Icon (Rectangle 2- Icon Profile) */}
                <div className={styles.actionIcon}>
                    <User size={18} stroke="#000" />
                </div>
               
                {/* Like (Heart) */}
                <div
                    className={styles.actionIcon}
                    onClick={() => onLike(reel.idReel, !isLiked, reel.likesCount + (isLiked ? -1 : 1))}
                >
                    <Heart
                        size={18}
                        fill={isLiked ? "#ff385c" : "none"}
                        stroke={isLiked ? "#ff385c" : "#f6efefff"}
                    />
                </div>
                {/* Comment */}
                <div className={styles.actionIcon} onClick={onComment}>
                    <MessageCircle size={18} stroke="#000" />
                </div>
            </div>
           
            {/* 4️⃣ Nút điều hướng (Nếu có trong danh sách) */}
            <div className={styles.navButtons}>
                <button className={styles.navUp} onClick={onNavUp}>
                    <ChevronUp size={16} stroke="#f9f3f3ff" />
                </button>
                <button className={styles.navDown} onClick={onNavDown}>
                    <ChevronDown size={16} stroke="#f2ebebff" />
                </button>
            </div>
        </div>
    </div>
  );
});
export default ReelPlayer;
import React, { forwardRef, useRef, useEffect } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    const isViewTrackedRef = useRef(false);

    const creator = reel.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const isLiked = reel.isLiked;

    const avatarUrl =
      creatorAvatar === "/user.png" ? (
        <User size={24} color="#fff" />
      ) : (
        <img
          src={creatorAvatar}
          alt={`${creatorFullName}'s Avatar`}
          className={styles.avatar}
        />
      );

    useEffect(() => {
      isViewTrackedRef.current = false;

      const trackViewAPI = async () => {
        if (!reel || !idUser) return;
        try {
          await trackReelView(reel.idReel, idUser);
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
      <div className={styles.reelItemContainer} ref={ref}>
        <div className={styles.videoWrapper}>
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

          {/* Overlay thông tin */}
          <div className={styles.contentOverlay}>
            <div className={styles.profileInfo}>
              {avatarUrl}
              <span className={styles.username}>{creatorFullName}</span>
            </div>
            <p className={styles.titleText}>{reel.title || "Không có tiêu đề"}</p>
          </div>

          {/* Thanh tương tác */}
          <div className={styles.interactionBar}>
            <div className={styles.actionIcon}>
              <User size={24} stroke="#fff" />
            </div>
            <div
              className={styles.actionIcon}
              onClick={() =>
                onLike(reel.idReel, !isLiked, reel.likesCount + (isLiked ? -1 : 1))
              }
            >
              <Heart
                size={24}
                fill={isLiked ? "#ff385c" : "none"}
                stroke={isLiked ? "#ff385c" : "#fff"}
              />
            </div>
            <div className={styles.actionIcon} onClick={onComment}>
              <MessageCircle size={24} stroke="#fff" />
            </div>
          </div>

        </div>
      </div>
    );
  }
);

export default ReelPlayer;

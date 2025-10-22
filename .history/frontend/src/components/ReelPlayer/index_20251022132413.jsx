import React, { useRef, useEffect, forwardRef, useState } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;
const SCROLL_COOLDOWN_MS = 800; // chống spam cuộn

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const isViewTrackedRef = useRef(false);
    const scrollLocked = useRef(false);
    const [slideDirection, setSlideDirection] = useState(null);

    const creator = reel?.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const isLiked = reel?.isLiked ?? false;

    // Hiệu ứng slide khi đổi video
    useEffect(() => {
      if (slideDirection) {
        const timer = setTimeout(() => setSlideDirection(null), 400);
        return () => clearTimeout(timer);
      }
    }, [slideDirection]);

    // Track view ≥ 3s
    useEffect(() => {
      if (!reel || !idUser) return;
      isViewTrackedRef.current = false;

      const handleTimeUpdate = () => {
        if (
          videoRef.current &&
          videoRef.current.currentTime * 1000 >= MIN_VIEW_DURATION_MS
        ) {
          if (!isViewTrackedRef.current) {
            trackReelView(reel.idReel, idUser).catch((err) =>
              console.error("View tracking failed:", err)
            );
            isViewTrackedRef.current = true;
          }
        }
      };

      videoRef.current?.addEventListener("timeupdate", handleTimeUpdate);
      return () =>
        videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    }, [reel, idUser]);

    // Cuộn chỉ 1 video / lần
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleWheel = (e) => {
        e.preventDefault();
        if (scrollLocked.current) return;
        scrollLocked.current = true;

        if (e.deltaY > 60) {
          setSlideDirection("down");
          onNavDown?.();
        } else if (e.deltaY < -60) {
          setSlideDirection("up");
          onNavUp?.();
        }

        setTimeout(() => (scrollLocked.current = false), SCROLL_COOLDOWN_MS);
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }, [onNavUp, onNavDown]);

    if (!reel) return null;

    return (
      <div
        ref={ref}
        className={`${styles.reelItemContainer} ${
          slideDirection === "up"
            ? styles.slideUp
            : slideDirection === "down"
            ? styles.slideDown
            : ""
        }`}
      >
        <div ref={containerRef} className={styles.videoWrapper}>
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
              {creatorAvatar === "/user.png" ? (
                <User size={28} color="#fff" />
              ) : (
                <img
                  src={creatorAvatar}
                  alt={`${creatorFullName}'s Avatar`}
                  className={styles.avatar}
                />
              )}
              <span className={styles.username}>{creatorFullName}</span>
            </div>
            <p className={styles.titleText}>{reel.title || "Không có tiêu đề"}</p>
          </div>

          {/* Thanh tương tác */}
          <div className={styles.interactionBar}>
            <div
              className={styles.actionIcon}
              onClick={() =>
                onLike?.(reel.idReel, !isLiked, reel.likesCount + (isLiked ? -1 : 1))
              }
            >
              <Heart
                size={28}
                fill={isLiked ? "#ff385c" : "none"}
                stroke={isLiked ? "#ff385c" : "#fff"}
              />
            </div>
            <div className={styles.actionIcon} onClick={onComment}>
              <MessageCircle size={28} stroke="#fff" />
            </div>
          </div>
        </div>

        {/* Nút điều hướng */}
        <div className={styles.navButtons}>
          <div className={styles.navUp} onClick={() => { setSlideDirection("up"); onNavUp?.(); }}>
            <ChevronUp size={20} stroke="#fff" />
          </div>
          <div className={styles.navDown} onClick={() => { setSlideDirection("down"); onNavDown?.(); }}>
            <ChevronDown size={20} stroke="#fff" />
          </div>
        </div>
      </div>
    );
  }
);

export default ReelPlayer;

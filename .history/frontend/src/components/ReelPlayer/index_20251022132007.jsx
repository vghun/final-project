import React, { useRef, useEffect, forwardRef, useState } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;
const SCROLL_COOLDOWN_MS = 800; // thời gian giữa 2 lần cuộn

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const isViewTrackedRef = useRef(false);
    const scrollLocked = useRef(false);
    const [fadeIn, setFadeIn] = useState(false);

    const creator = reel?.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const isLiked = reel?.isLiked ?? false;

    // ✨ Hiệu ứng fade nhẹ mỗi khi đổi video
    useEffect(() => {
      setFadeIn(false);
      const t = setTimeout(() => setFadeIn(true), 50);
      return () => clearTimeout(t);
    }, [reel?.idReel]);

    // 👁️ Track view (sau khi xem >= 3s)
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

    // 🚫 Chống spam cuộn
    const navigate = (direction) => {
      if (scrollLocked.current) return;
      scrollLocked.current = true;

      if (direction === "up") onNavUp?.();
      else onNavDown?.();

      // mở khóa lại sau cooldown
      setTimeout(() => {
        scrollLocked.current = false;
      }, SCROLL_COOLDOWN_MS);
    };

    // 🎡 Chỉ cuộn 1 video / lần dù người dùng lướt mạnh
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleWheel = (e) => {
        e.preventDefault();

        // Nếu đang cooldown thì bỏ qua
        if (scrollLocked.current) return;

        // Lấy hướng scroll
        const delta = e.deltaY;
        if (delta > 60) navigate("down");
        else if (delta < -60) navigate("up");
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }, []);

    if (!reel) return null;

    return (
      <div
        ref={ref}
        className={`${styles.reelItemContainer} ${fadeIn ? styles.fadeIn : styles.fadeOut}`}
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

        <div className={styles.navButtons}>
          <div className={styles.navUp} onClick={() => navigate("up")}>
            <ChevronUp size={20} stroke="#fff" />
          </div>
          <div className={styles.navDown} onClick={() => navigate("down")}>
            <ChevronDown size={20} stroke="#fff" />
          </div>
        </div>
      </div>
    );
  }
);

export default ReelPlayer;

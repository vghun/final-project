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
    const [fadeIn, setFadeIn] = useState(true);

    const creator = reel?.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const isLiked = reel?.isLiked ?? false;

    // 🔄 Khi đổi video => fade-in nhẹ
    useEffect(() => {
      setFadeIn(false);
      const t = setTimeout(() => setFadeIn(true), 50);
      return () => clearTimeout(t);
    }, [reel?.idReel]);

    // 👁️ Track view
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

    // 🎡 Điều hướng có chặn spam scroll
    const navigate = (direction) => {
      if (scrollLocked.current) return;

      scrollLocked.current = true;
      direction === "up" ? onNavUp?.() : onNavDown?.();

      setTimeout(() => {
        scrollLocked.current = false;
      }, SCROLL_COOLDOWN_MS);
    };

    // 🧭 Lướt chuột chỉ nhảy 1 video / lần
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let lastScrollTime = 0;

      const handleWheel = (e) => {
        e.preventDefault();
        const now = Date.now();

        // nếu chưa hết cooldown → bỏ qua
        if (now - lastScrollTime < SCROLL_COOLDOWN_MS) return;

        if (e.deltaY > 50) navigate("down");
        else if (e.deltaY < -50) navigate("up");

        lastScrollTime = now;
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }, []);

    if (!reel) return null;

    return (
      <div
        className={`${styles.reelItemContainer} ${fadeIn ? styles.fadeIn : ""}`}
        ref={ref}
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

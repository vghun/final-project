import React, { useState, useRef, useEffect, forwardRef } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;
const SCROLL_COOLDOWN_MS = 1000;

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const isViewTrackedRef = useRef(false);

    const [offset, setOffset] = useState(0);
    const [canScroll, setCanScroll] = useState(true);

    // 🧩 Thêm optional chaining để tránh lỗi undefined
    const creator = reel?.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const isLiked = reel?.isLiked ?? false;

    const avatarUrl =
      creatorAvatar === "/user.png" ? (
        <User size={28} color="#fff" />
      ) : (
        <img
          src={creatorAvatar}
          alt={`${creatorFullName}'s Avatar`}
          className={styles.avatar}
        />
      );

    // 🎯 Track view
    useEffect(() => {
      if (!reel || !idUser) return;
      isViewTrackedRef.current = false;

      const trackViewAPI = async () => {
        try {
          await trackReelView(reel.idReel, idUser);
        } catch (err) {
          console.error("View tracking failed:", err);
        }
      };

      const handleTimeUpdate = () => {
        if (
          videoRef.current &&
          videoRef.current.currentTime * 1000 >= MIN_VIEW_DURATION_MS
        ) {
          if (!isViewTrackedRef.current) {
            trackViewAPI();
            isViewTrackedRef.current = true;
          }
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };

      videoRef.current?.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }, [reel, idUser]);

    // 🪄 Animation điều hướng đơn giản
    const navigate = (direction) => {
      if (!canScroll) return;

      setCanScroll(false);
      setOffset(direction === "up" ? -100 : 100);

      setTimeout(() => {
        direction === "up" ? onNavUp?.() : onNavDown?.();
        setOffset(0);
      }, 250);

      setTimeout(() => setCanScroll(true), SCROLL_COOLDOWN_MS);
    };

    // 🎡 Lăn chuột để chuyển video
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleWheel = (e) => {
        if (!canScroll) return;
        e.preventDefault();
        if (e.deltaY > 0) navigate("down");
        else if (e.deltaY < 0) navigate("up");
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }, [canScroll]);

    if (!reel) return null;

    return (
      <div className={styles.reelItemContainer} ref={ref}>
        <div
          ref={containerRef}
          className={styles.videoWrapper}
          style={{
            transform: `translateY(${offset}%)`,
            transition: "transform 0.35s ease",
          }}
        >
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
              {avatarUrl}
              <span className={styles.username}>{creatorFullName}</span>
            </div>
            <p className={styles.titleText}>{reel.title || "Không có tiêu đề"}</p>
          </div>

          <div className={styles.interactionBar}>
            <div className={styles.actionIcon}>
              <User size={28} stroke="#fff" />
            </div>
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

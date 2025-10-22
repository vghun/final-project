import React, { useState, useRef, useEffect, forwardRef } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;
const SCROLL_COOLDOWN_MS = 2500;

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const isViewTrackedRef = useRef(false);

    const [offset, setOffset] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [canScroll, setCanScroll] = useState(true);
    const [fade, setFade] = useState(true);
    const [scale, setScale] = useState(1);

    const creator = reel.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const isLiked = reel.isLiked;

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

    // Track view
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
        if (videoRef.current && videoRef.current.currentTime * 500 >= MIN_VIEW_DURATION_MS) {
          if (!isViewTrackedRef.current) {
            trackViewAPI();
            isViewTrackedRef.current = true;
          }
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };

      if (reel && videoRef.current) {
        videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
      }

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    }, [reel, idUser]);

    // Navigation
    const navigate = (direction) => {
      if (isAnimating || !canScroll) return;

      setIsAnimating(true);
      setCanScroll(false);

      // slide + scale animation
      setOffset(direction === "up" ? 100 : -100);
      setScale(0.9);
      setFade(false);

      // gọi callback load video mới
      setTimeout(() => {
        direction === "up" ? onNavUp?.() : onNavDown?.();
        setOffset(direction === "up" ? -100 : 100); // video mới slide từ dưới/lên
        setScale(1);
        setFade(true);

        setTimeout(() => {
          setOffset(0);
          setIsAnimating(false);
        }, 300);
      }, 250); // fade out trước 0.25s

      // khóa scroll 2.5s
      setTimeout(() => setCanScroll(true), SCROLL_COOLDOWN_MS);
    };

    // Scroll chỉ khi hover
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

    return (
      <div className={styles.reelItemContainer} ref={ref}>
       <div
  ref={containerRef}
  className={styles.videoWrapper}
  style={{
    transform: `translateY(${offset}%) scale(${scale})`,
    opacity: fade ? 1 : 0.9,  // fade nhẹ
    transition: "transform 0.3s ease, opacity 0.3s ease",
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
                onLike(reel.idReel, !isLiked, reel.likesCount + (isLiked ? -1 : 1))
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

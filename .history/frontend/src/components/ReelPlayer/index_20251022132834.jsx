import React, { useRef, useEffect, forwardRef, useState } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;
const SCROLL_COOLDOWN_MS = 900; // chống spam cuộn

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const isViewTrackedRef = useRef(false);
    const scrollLocked = useRef(false);
    const [transition, setTransition] = useState(""); // hiệu ứng chuyển cảnh

    const creator = reel?.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const isLiked = reel?.isLiked ?? false;

    // 🪄 Reset hiệu ứng khi đổi video
    useEffect(() => {
      setTransition(""); 
    }, [reel?.idReel]);

    // 👁️ Track view ≥ 3s
    useEffect(() => {
      if (!reel || !idUser) return;
      isViewTrackedRef.current = false;

      const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.currentTime * 1000 >= MIN_VIEW_DURATION_MS) {
          if (!isViewTrackedRef.current) {
            trackReelView(reel.idReel, idUser).catch((err) => console.error("View tracking failed:", err));
            isViewTrackedRef.current = true;
          }
        }
      };

      videoRef.current?.addEventListener("timeupdate", handleTimeUpdate);
      return () => videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    }, [reel, idUser]);

    // 🎡 Cuộn 1 video / lần, mượt, có slide effect
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleWheel = (e) => {
        e.preventDefault();
        if (scrollLocked.current) return;
        scrollLocked.current = true;

        if (e.deltaY > 60) {
          setTransition(styles.slideDown);
          onNavDown?.();
        } else if (e.deltaY < -60) {
          setTransition(styles.slideUp);
          onNavUp?.();
        }

        setTimeout(() => {
          scrollLocked.current = false;
        }, SCROLL_COOLDOWN_MS);
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }, [onNavUp, onNavDown]);

    if (!reel) return null;

    return (
      <div ref={ref} className={`${styles.reelItemContainer} ${transition}`}>
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

          {/* Overlay */}
          <div className={styles.contentOverlay}>
            <div className={styles.profileInfo}>
              {creatorAvatar === "/user.png" ? (
                <User size={28} color="#fff" />
              ) : (
                <img src={creatorAvatar} alt="avatar" className={styles.avatar} />
              )}
              <span className={styles.username}>{creatorFullName}</span>
            </div>
            <p className={styles.titleText}>{reel.title || "Không có tiêu đề"}</p>
          </div>

          {/* Nút like + comment */}
          <div className={styles.interactionBar}>
            <div
              className={styles.actionIcon}
              onClick={() => onLike?.(reel.idReel, !isLiked, reel.likesCount + (isLiked ? -1 : 1))}
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
          <div
            className={styles.navUp}
            onClick={() => {
              setTransition(styles.slideUp);
              onNavUp?.();
            }}
          >
            <ChevronUp size={20} stroke="#fff" />
          </div>
          <div
            className={styles.navDown}
            onClick={() => {
              setTransition(styles.slideDown);
              onNavDown?.();
            }}
          >
            <ChevronDown size={20} stroke="#fff" />
          </div>
        </div>
      </div>
    );
  }
);

export default ReelPlayer;

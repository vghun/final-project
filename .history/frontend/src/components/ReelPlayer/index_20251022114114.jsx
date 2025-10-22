import React, { useState, useRef, useEffect, forwardRef } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    const isViewTrackedRef = useRef(false);
    const [offset, setOffset] = useState(0); // dùng cho animation trượt

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

    // Track view khi xem đủ thời gian
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

      if (reel && videoRef.current) {
        videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
      }

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    }, [reel, idUser]);

    // Xử lý scroll → trigger như click nút
    useEffect(() => {
      const handleWheel = (e) => {
        if (e.deltaY > 0) handleNavDown();
        else if (e.deltaY < 0) handleNavUp();
      };
      window.addEventListener("wheel", handleWheel, { passive: true });
      return () => window.removeEventListener("wheel", handleWheel);
    }, []);

    const handleNavUp = () => {
      setOffset(100); // trượt xuống
      setTimeout(() => {
        setOffset(0);
        onNavUp?.();
      }, 300);
    };

    const handleNavDown = () => {
      setOffset(-100); // trượt lên
      setTimeout(() => {
        setOffset(0);
        onNavDown?.();
      }, 300);
    };

    return (
      <div className={styles.reelItemContainer} ref={ref}>
        <div
          className={styles.videoWrapper}
          style={{ transform: `translateY(${offset}%)`, transition: "transform 0.3s ease" }}
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

        {/* Nút điều hướng lên/xuống ngoài video */}
        <div className={styles.navButtons}>
          <div className={styles.navUp} onClick={handleNavUp}>
            <ChevronUp size={20} stroke="#fff" />
          </div>
          <div className={styles.navDown} onClick={handleNavDown}>
            <ChevronDown size={20} stroke="#fff" />
          </div>
        </div>
      </div>
    );
  }
);

export default ReelPlayer;

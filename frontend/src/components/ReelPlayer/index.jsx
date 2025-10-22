import React, { useRef, useEffect, forwardRef, useState } from "react";
import styles from "./reelplayer.module.scss";
import {
  User,
  Heart,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;
const SCROLL_THRESHOLD = 50; // Chỉ dùng cho touch, wheel không cần threshold mạnh/yếu
const ANIMATION_DURATION_MS = 600; // Thời gian animation chậm hơn để hiệu ứng mượt
const ANIMATION_LOCK_MS = 1000; // Khóa 1s để ngăn scroll liên tục

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown, hasPrev, hasNext }, ref) => {
    const videoRef = useRef(null);
    const internalRef = useRef(null);
    const isViewTrackedRef = useRef(false);
    const isScrollLockedRef = useRef(false);

    const [slideDirection, setSlideDirection] = useState(null);
    const [muted, setMuted] = useState(true); // 🔊 Thêm âm thanh

    const touchStartY = useRef(0);

    const creator = reel?.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const isLiked = reel?.isLiked ?? false;

    // 🔊 Cập nhật trạng thái âm thanh cho video
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.muted = muted;
      }
    }, [muted]);

    // 🎬 Hiệu ứng slide khi đổi video
    useEffect(() => {
      if (slideDirection) {
        const timer = setTimeout(() => setSlideDirection(null), ANIMATION_DURATION_MS);
        return () => clearTimeout(timer);
      }
    }, [slideDirection]);

    // 👁️ Theo dõi lượt xem ≥ 3s
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

      const videoElement = videoRef.current;
      videoElement?.addEventListener("timeupdate", handleTimeUpdate);
      return () =>
        videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
    }, [reel, idUser]);

    // 🖱️ Xử lý scroll chuyển video (wheel + touch)
    useEffect(() => {
      const container = internalRef.current;
      if (!container) return;

      const handleWheel = (e) => {
        e.preventDefault();
        if (isScrollLockedRef.current) return;

        const direction = e.deltaY > 0 ? "down" : e.deltaY < 0 ? "up" : null;
        if (!direction) return;

        const canNav = direction === "down" ? hasNext : hasPrev;
        if (!canNav) return; // Không hiệu ứng nếu đầu/cuối

        setSlideDirection(direction);
        if (direction === "down") {
          onNavDown?.();
        } else {
          onNavUp?.();
        }

        isScrollLockedRef.current = true;
        setTimeout(() => {
          isScrollLockedRef.current = false;
        }, ANIMATION_LOCK_MS);
      };

      const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
      };

      const handleTouchMove = (e) => {
        e.preventDefault();
        if (isScrollLockedRef.current) return;

        const deltaY = touchStartY.current - e.touches[0].clientY;
        const absDeltaY = Math.abs(deltaY);
        if (absDeltaY <= SCROLL_THRESHOLD) return;

        const direction = deltaY > 0 ? "down" : "up";
        const canNav = direction === "down" ? hasNext : hasPrev;
        if (!canNav) return; // Không hiệu ứng nếu đầu/cuối

        setSlideDirection(direction);
        if (direction === "down") {
          onNavDown?.();
        } else {
          onNavUp?.();
        }

        isScrollLockedRef.current = true;
        setTimeout(() => {
          isScrollLockedRef.current = false;
        }, ANIMATION_LOCK_MS);
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, { passive: false });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      };
    }, [onNavUp, onNavDown, hasPrev, hasNext]);


    if (!reel) return null;

    return (
      <div
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={`${styles.reelItemContainer} ${slideDirection === "up"
          ? styles.slideUp
          : slideDirection === "down"
            ? styles.slideDown
            : ""
          }`}
      >
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            className={styles.video}
            src={reel.url}
            poster={reel.thumbnail}
            autoPlay
            loop
            muted={muted}
            playsInline
          />

          {/* 🔊 Nút âm thanh góc trên phải */}
          <button
            className={styles.soundToggle}
            onClick={() => setMuted(!muted)}
            title={muted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>

          {/* ❤️ Thanh tương tác bên phải — avatar, tim, comment thành 1 cột */}
          <div className={styles.interactionBar}>
            <img
              src={creatorAvatar}
              alt="avatar"
              className={styles.avatarSmall}
              title={creatorFullName}
            />

            <div
              className={styles.actionIcon}
              onClick={() =>
                onLike?.(
                  reel.idReel,
                  !isLiked,
                  reel.likesCount + (isLiked ? -1 : 1)
                )
              }
            >
              <Heart
                size={28}
                fill={isLiked ? "#ff385c" : "none"}
                stroke={isLiked ? "#ff385c" : "#fff"}
              />
              <span className={styles.iconLabel}>{reel.likesCount || 0}</span>
            </div>

            <div className={styles.actionIcon} onClick={onComment}>
              <MessageCircle size={28} stroke="#fff" />
            </div>
          </div>

          {/* 🧾 Góc trái dưới: tên + tiêu đề */}
          <div className={styles.contentOverlay}>
            <span className={styles.username}>{creatorFullName}</span>
            <p className={styles.titleText}>{reel.title || "Không có tiêu đề"}</p>
          </div>
        </div>


        {/* ⬆️⬇️ Nút điều hướng */}
        <div className={styles.navButtons}>
          <div
            className={styles.navUp}
            onClick={() => {
              setSlideDirection("up");
              onNavUp?.();
            }}
          >
            <ChevronUp size={20} stroke="#fff" />
          </div>
          <div
            className={styles.navDown}
            onClick={() => {
              setSlideDirection("down");
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
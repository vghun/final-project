import React, { useRef, useEffect, forwardRef, useState } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;
const SCROLL_THRESHOLD = 10; // Giữ ngưỡng nhạy

// *** SỬA LỖI Ở ĐÂY ***
// Thời gian khoá gesture (chống "nảy") phải đủ dài để
// 1. Hoàn thành animation (400ms)
// 2. "Nuốt" tất cả các sự kiện "nảy" (bounce) của cú cuộn
// Giá trị 800ms (từ code gốc của bạn) là hoàn hảo.
const GESTURE_END_TIMEOUT_MS = 800; // <-- TĂNG TỪ 200 LÊN 800

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    const internalRef = useRef(null);
    const isViewTrackedRef = useRef(false);

    const scrollingDirection = useRef(null); 
    const scrollEndTimer = useRef(null); 
    
    const [slideDirection, setSlideDirection] = useState(null);

    const creator = reel?.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const isLiked = reel?.isLiked ?? false;

    // Hiệu ứng slide khi đổi video (Giữ nguyên)
    useEffect(() => {
      if (slideDirection) {
        // Animation CSS là 400ms
        const timer = setTimeout(() => setSlideDirection(null), 400);
        return () => clearTimeout(timer);
      }
    }, [slideDirection]);

    // Track view (Giữ nguyên)
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

    // Logic cuộn "Gesture" (Giữ nguyên logic, chỉ thay hằng số ở trên)
    useEffect(() => {
      const container = internalRef.current;
      if (!container) return;

      const handleWheel = (e) => {
        e.preventDefault();

        // 1. Reset timer "kết thúc" cũ
        if (scrollEndTimer.current) {
            clearTimeout(scrollEndTimer.current);
        }

        // 2. Đặt timer "kết thúc" mới
        // Chỉ khi nào ngừng cuộn 800ms, khoá mới được mở
        scrollEndTimer.current = setTimeout(() => {
            scrollingDirection.current = null;
        }, GESTURE_END_TIMEOUT_MS); // <-- Sử dụng giá trị 800ms mới

        // 3. Chỉ hành động nếu khoá đang mở (null)
        if (!scrollingDirection.current) {
            if (e.deltaY > SCROLL_THRESHOLD) {
                // Khoá gesture là 'down'
                scrollingDirection.current = "down";
                setSlideDirection("down");
                onNavDown?.();
            } else if (e.deltaY < -SCROLL_THRESHOLD) {
                // Khoá gesture là 'up'
                scrollingDirection.current = "up";
                setSlideDirection("up");
                onNavUp?.();
            }
        }
        // Nếu khoá đang là 'up' hoặc 'down', tất cả sự kiện (kể cả "nảy")
        // sẽ bị bỏ qua, cho đến khi timer 800ms chạy xong.
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener("wheel", handleWheel);
        if (scrollEndTimer.current) {
            clearTimeout(scrollEndTimer.current);
        }
      };
    }, [onNavUp, onNavDown]);

    if (!reel) return null;

    return (
      <div
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`${styles.reelItemContainer} ${
          slideDirection === "up"
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
              // Bổ sung: Nút bấm cũng phải khoá gesture
              if (scrollingDirection.current) return;
              scrollingDirection.current = "up";
              setSlideDirection("up");
              onNavUp?.();
              // Mở khoá sau khi animation + buffer
              if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
              scrollEndTimer.current = setTimeout(() => {
                scrollingDirection.current = null;
              }, GESTURE_END_TIMEOUT_MS);
            }}
          >
            <ChevronUp size={20} stroke="#fff" />
          </div>
          <div
            className={styles.navDown}
            onClick={() => {
              // Bổ sung: Nút bấm cũng phải khoá gesture
              if (scrollingDirection.current) return;
              scrollingDirection.current = "down";
              setSlideDirection("down");
              onNavDown?.();
              // Mở khoá sau khi animation + buffer
              if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
              scrollEndTimer.current = setTimeout(() => {
                scrollingDirection.current = null;
              }, GESTURE_END_TIMEOUT_MS);
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
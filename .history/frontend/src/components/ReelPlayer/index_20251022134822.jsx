import React, { useRef, useEffect, forwardRef, useState } from "react";
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;
const SCROLL_THRESHOLD = 10; // Giữ ngưỡng nhạy
// Thời gian (ms) mà người dùng phải "ngừng" cuộn
// trước khi cho phép cuộn video tiếp theo.
const GESTURE_END_TIMEOUT_MS = 200; 

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    const internalRef = useRef(null);
    const isViewTrackedRef = useRef(false);

    // *** SỬA LỖI: Bỏ 'scrollLocked' và thay bằng logic mới ***
    // 'null' = sẵn sàng cuộn, 'up'/'down' = đang trong 1 gesture cuộn
    const scrollingDirection = useRef(null); 
    // Timer để phát hiện khi nào người dùng ngừng cuộn
    const scrollEndTimer = useRef(null); 
    
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

    // Track view ≥ 3s (Giữ nguyên)
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

    // *** SỬA LỖI: Logic cuộn "Gesture" mới ***
    useEffect(() => {
      const container = internalRef.current;
      if (!container) return;

      const handleWheel = (e) => {
        e.preventDefault();

        // 1. Xoá timer "kết thúc gesture" cũ (nếu có)
        // Mỗi khi có 1 event wheel, ta reset lại timer
        if (scrollEndTimer.current) {
            clearTimeout(scrollEndTimer.current);
        }

        // 2. Đặt timer "kết thúc gesture" mới
        // Nếu không có event 'wheel' nào trong 200ms,
        // chúng ta coi là gesture đã kết thúc và reset 'scrollingDirection'.
        scrollEndTimer.current = setTimeout(() => {
            scrollingDirection.current = null;
        }, GESTURE_END_TIMEOUT_MS);

        // 3. Chỉ thực hiện hành động NẾU gesture chưa bị khoá
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
        // Nếu scrollingDirection.current đã được set (ví dụ 'up' hoặc 'down'),
        // TẤT CẢ các event 'wheel' tiếp theo (cùng chiều, ngược chiều, bounce)
        // sẽ bị bỏ qua cho đến khi timer ở bước 2 reset nó.
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      
      // Cleanup: Khi component unmount, xoá timer đang chạy
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

        {/* Nút điều hướng (Giữ nguyên) */}
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
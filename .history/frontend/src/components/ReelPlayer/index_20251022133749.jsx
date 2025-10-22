import React, { useRef, useEffect, forwardRef, useState, useImperativeHandle } from "react"; // <-- không cần useImperativeHandle
import styles from "./reelplayer.module.scss";
import { User, Heart, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { trackReelView } from "~/services/reelService";

const MIN_VIEW_DURATION_MS = 3000;
const SCROLL_COOLDOWN_MS = 800; // chống spam cuộn

const ReelPlayer = forwardRef(
  ({ reel, idUser, onLike, onComment, onNavUp, onNavDown }, ref) => {
    const videoRef = useRef(null);
    // const containerRef = useRef(null); // <-- Đã xoá, chúng ta sẽ dùng 'ref' từ forwardRef
    
    // *** SỬA LỖI: Tạo một ref nội bộ (internal) ***
    // Ref này DÀNH RIÊNG cho logic bắt sự kiện cuộn của component này.
    // Nó sẽ luôn tồn tại, bất kể component cha có truyền 'ref' hay không.
    const internalRef = useRef(null); 
    
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
        // Thời gian animation khớp với SCSS
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

      const videoElement = videoRef.current; // Gán vào biến để cleanup
      videoElement?.addEventListener("timeupdate", handleTimeUpdate);
      return () =>
        videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
    }, [reel, idUser]);

    // Cuộn chỉ 1 video / lần (Đã sửa)
useEffect(() => {
      const container = internalRef.current; 
      if (!container) return; 

      const handleWheel = (e) => {
        e.preventDefault();
        // Chỉ return nếu đang trong thời gian cooldown
        if (scrollLocked.current) return;

        // *** SỬA LỖI Ở ĐÂY ***
        // Chỉ khoá cuộn VÀ bắt đầu cooldown KHI một hành động cuộn hợp lệ xảy ra
        
        if (e.deltaY > 60) {
          scrollLocked.current = true; // <-- Di chuyển vào đây
          setSlideDirection("down"); 
          onNavDown?.();
          setTimeout(() => (scrollLocked.current = false), SCROLL_COOLDOWN_MS); // <-- Di chuyển vào đây
        } else if (e.deltaY < -60) {
          scrollLocked.current = true; // <-- Di chuyển vào đây
          setSlideDirection("up"); 
          onNavUp?.();
          setTimeout(() => (scrollLocked.current = false), SCROLL_COOLDOWN_MS); // <-- Di chuyển vào đây
        }
        
        // *** ĐÃ XOÁ 2 DÒNG (scrollLocked.current = true và setTimeout) KHỎI ĐÂY ***
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    
    }, [onNavUp, onNavDown]);

    if (!reel) return null;

    return (
      <div
        // *** SỬA LỖI: Sử dụng "callback ref" để gán ref ***
        // Kỹ thuật này cho phép gán DOM node cho CẢ ref nội bộ và ref từ cha
        ref={(node) => {
          // 1. Gán cho ref nội bộ để useEffect cuộn luôn hoạt động
          internalRef.current = node;

          // 2. Gán cho ref từ cha (nếu cha có truyền vào)
          if (typeof ref === 'function') {
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
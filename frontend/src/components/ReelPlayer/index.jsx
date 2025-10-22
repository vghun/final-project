import React, { useRef, useEffect, forwardRef, useState } from "react";
import styles from "./reelplayer.module.scss";
import {
  Heart,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { trackReelView } from "~/services/reelService";
import { Link } from "react-router-dom";

const MIN_VIEW_DURATION_MS = 3000;
const ANIMATION_DURATION_MS = 600;
const ANIMATION_LOCK_MS = 1000;

const ReelPlayer = forwardRef(
  (
    {
      reel,
      idUser,
      isActive = false,
      globalMuted = true,
      onToggleGlobalMuted = () => {},
      onLike,
      onComment,
      onNavUp,
      onNavDown,
      hasPrev,
      hasNext,
    },
    ref
  ) => {
    const videoRef = useRef(null);
    const internalRef = useRef(null);
    const isViewTrackedRef = useRef(false);
    const isScrollLockedRef = useRef(false);
    const [slideDirection, setSlideDirection] = useState(null);

    const creator = reel?.Barber?.user;
    const creatorFullName = creator?.fullName || "Barber ẩn danh";
    const creatorAvatar = creator?.image || "/user.png";
    const creatorId = reel?.Barber?.idBarber;
    const isLiked = reel?.isLiked ?? false;

    // đồng bộ muted với global
    useEffect(() => {
      if (videoRef.current) videoRef.current.muted = globalMuted;
    }, [globalMuted]);

    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;
      if (isActive) {
        v.muted = globalMuted;
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    }, [isActive, globalMuted]);

    useEffect(() => {
      if (slideDirection) {
        const timer = setTimeout(
          () => setSlideDirection(null),
          ANIMATION_DURATION_MS
        );
        return () => clearTimeout(timer);
      }
    }, [slideDirection]);

    useEffect(() => {
      if (!reel || !idUser) return;
      isViewTrackedRef.current = false;
      const handleTimeUpdate = () => {
        if (
          videoRef.current &&
          videoRef.current.currentTime * 1000 >= MIN_VIEW_DURATION_MS
        ) {
          if (!isViewTrackedRef.current) {
            trackReelView(reel.idReel, idUser).catch(() => {});
            isViewTrackedRef.current = true;
          }
        }
      };
      const v = videoRef.current;
      v?.addEventListener("timeupdate", handleTimeUpdate);
      return () => v?.removeEventListener("timeupdate", handleTimeUpdate);
    }, [reel, idUser]);

    const handleNavClick = (direction) => {
      if (isScrollLockedRef.current) return;
      const canNav = direction === "down" ? hasNext : hasPrev;
      if (!canNav) return;
      setSlideDirection(direction);
      direction === "down" ? onNavDown?.() : onNavUp?.();
      isScrollLockedRef.current = true;
      setTimeout(() => (isScrollLockedRef.current = false), ANIMATION_LOCK_MS);
    };

    if (!reel) return null;

    return (
      <div
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
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
            playsInline
            muted={globalMuted}
          />

          <button
            className={styles.soundToggle}
            onClick={() => onToggleGlobalMuted()}
            title={globalMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {globalMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>

          {/* === Avatar + Action Bar === */}
          <div className={styles.interactionBar}>
            <Link
              to={`/barber/${creatorId}`}
              className={styles.userLink}
              title={`Xem trang của ${creatorFullName}`}
            >
              <img
                src={creatorAvatar}
                alt="avatar"
                className={styles.avatarSmall}
              />
            </Link>

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

          {/* === Overlay thông tin video === */}
          <div className={styles.contentOverlay}>
            <Link
              to={`/barber/${creatorId}`}
              className={styles.userNameLink}
              title={`Xem trang của ${creatorFullName}`}
            >
              <span className={styles.username}>{creatorFullName}</span>
            </Link>
            <p className={styles.titleText}>
              {reel.title || "Không có tiêu đề"}
            </p>
          </div>
        </div>

        {/* === Navigation Buttons === */}
        <div className={styles.navButtons}>
          <div
            className={`${styles.navUp} ${!hasPrev ? styles.navDisabled : ""}`}
            onClick={() => hasPrev && handleNavClick("up")}
          >
            <ChevronUp size={20} stroke="#fff" />
          </div>
          <div
            className={`${styles.navDown} ${
              !hasNext ? styles.navDisabled : ""
            }`}
            onClick={() => hasNext && handleNavClick("down")}
          >
            <ChevronDown size={20} stroke="#fff" />
          </div>
        </div>
      </div>
    );
  }
);

export default ReelPlayer;

import React, { useEffect, useState, useRef } from "react";
import styles from "./reels.module.scss";
import ReelPlayer from "~/components/ReelPlayer";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import { fetchReelsPaged } from "~/services/reelService";
import { useAuth } from "~/context/AuthContext";
import { useToast } from "~/context/ToastContext";
import { useNavigate } from "react-router-dom";


const PAGE_SIZE = 3;
const SCROLL_COOLDOWN_MS = 1500;

function Reel() {
  const { accessToken, isLogin, loading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [canScroll, setCanScroll] = useState(true);
  const [globalMuted, setGlobalMuted] = useState(true);

  const rightColumnRef = useRef(null);
  const touchStartY = useRef(0);
  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  const loadMore = async () => {
    if (loading || !hasMore || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const data = await fetchReelsPaged(page, PAGE_SIZE, accessToken);
      if (data.length === 0) setHasMore(false);
      else {
        setReels((prev) => {
          const newOnes = data.filter(
            (d) => !prev.some((p) => p.idReel === d.idReel)
          );
          return [...prev, ...newOnes];
        });
        setPage((prev) => prev + 1);
        if (data.length < PAGE_SIZE) setHasMore(false);
      }
    } catch (err) {
      console.error("Lỗi tải reels:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
        if (!isAuthLoading && reels.length === 0 && page === 1) {
            loadMore();
        }
    }, [isAuthLoading]);
    useEffect(() => {
        if (accessToken && page === 1 && reels.length > 0) {
            setReels([]);
            setPage(1);
            setHasMore(true);
            setCurrentIndex(0);
            loadMore();
        } 
        else if (accessToken && currentIndex >= reels.length - 2 && hasMore && !loading) {
            loadMore();
        }
    }, [currentIndex, accessToken, loading]);

  const handleLike = (idReel, liked, count) => {
    if (!isLogin) {
      showToast({
        text: "Vui lòng đăng nhập để thực hiện hành động này",
        type: "error",
      });
      return;
    }
    setReels((prev) =>
      prev.map((r) =>
        r.idReel === idReel ? { ...r, isLiked: liked, likesCount: count } : r
      )
    );
  };

  const handleCommentClick = (i) => {
    if (!isLogin) {
      showToast({
        text: "Vui lòng đăng nhập để thực hiện hành động này",
        type: "error",
      });
      return;
    }
    setDetailIndex(i);
    setShowDetail(true);
  };

  const scrollToVideo = (index) => {
    const container = rightColumnRef.current;
    const videoEl = container?.querySelector(`[data-reel-index="${index}"]`);
    if (videoEl)
      videoEl.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleNext = () => {
    if (currentIndex + 1 >= reels.length) return;
    const next = currentIndex + 1;
    setCurrentIndex(next);
    scrollToVideo(next);
    setCanScroll(false);
    setTimeout(() => setCanScroll(true), SCROLL_COOLDOWN_MS);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    const prev = currentIndex - 1;
    setCurrentIndex(prev);
    scrollToVideo(prev);
    setCanScroll(false);
    setTimeout(() => setCanScroll(true), SCROLL_COOLDOWN_MS);
  };

  const handleChangeVideo = (newIndex) => setDetailIndex(newIndex);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim())
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };

  useEffect(() => {
    const container = rightColumnRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (!canScroll) return;
      const dir = e.deltaY > 50 ? "down" : e.deltaY < -50 ? "up" : null;
      if (dir === "down") handleNext();
      else if (dir === "up") handlePrev();
    };

    const handleTouchStart = (e) => (touchStartY.current = e.touches[0].clientY);
    const handleTouchEnd = (e) => {
      if (!canScroll) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      if (delta > 0) handleNext();
      else handlePrev();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [canScroll, currentIndex, reels]);

  useEffect(() => {
    const container = rightColumnRef.current;
    if (!container) return;

    const videos = container.querySelectorAll(`[data-reel-index] video`);
    videos.forEach((video) => {
      if (showDetail) {
        video.pause();
      } else if (video.closest(`[data-reel-index="${currentIndex}"]`)) {
        video.play().catch(() => {});
      }
    });
  }, [showDetail, currentIndex]);

  if (loading && reels.length === 0)
    return (
      <div className={styles.centerContainer}>
        <p>Đang tải...</p>
      </div>
    );
  if (reels.length === 0)
    return (
      <div className={styles.centerContainer}>
        <p>Không có Reel nào.</p>
      </div>
    );

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftColumn}>
        <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Tìm kiếm video..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Tìm</button>
        </form>
      </div>

      <div
        className={styles.rightColumn}
        ref={rightColumnRef}
        style={{
          position: "relative",
          backgroundImage: 'url("/Reel.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          {reels.map((reel, i) => (
            <div
              key={reel.idReel}
              data-reel-index={i}
              style={{
                height: "100vh",
                display: i === currentIndex ? "block" : "none",
              }}
            >
              <ReelPlayer
                reel={reel}
                token={accessToken}
                isActive={i === currentIndex && !showDetail}
                globalMuted={globalMuted}
                onToggleGlobalMuted={() => setGlobalMuted((prev) => !prev)}
                onLike={() => handleLike(reel.idReel, !reel.isLiked, reel.likesCount + (reel.isLiked ? -1 : 1))}
                onComment={() => handleCommentClick(i)}
                onNavUp={handlePrev}
                onNavDown={handleNext}
                hasPrev={currentIndex > 0}
                hasNext={currentIndex + 1 < reels.length}
              />
            </div>
          ))}

          {showDetail && (
            <VideoDetailDialog
              reels={reels}
              currentIndex={detailIndex}
              onClose={() => setShowDetail(false)}
              onToggleLike={handleLike}
              onChangeVideo={handleChangeVideo}
              token={accessToken}
              globalMuted={globalMuted}
              onToggleGlobalMuted={() => setGlobalMuted((prev) => !prev)}
              fromReelPlayer={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Reel;
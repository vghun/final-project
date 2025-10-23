import React, { useEffect, useState, useRef } from "react";
import styles from "./reels.module.scss";
import ReelPlayer from "~/components/ReelPlayer";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import VideoCard from "~/components/VideoCard"; // dùng lại VideoCard khi search
import { fetchReelsPaged, searchReels } from "~/services/reelService";
import { useAuth } from "~/context/AuthContext";
import { useToast } from "~/context/ToastContext";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 3;
const SCROLL_COOLDOWN_MS = 1500;

function Reel() {
  const { accessToken, isLogin, loading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  // --- nguyên logic cũ (giữ nguyên)
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

  // trạng thái search mới (tách biệt với việc load reels)
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const rightColumnRef = useRef(null);
  const touchStartY = useRef(0);
  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  // --- loadMore giữ nguyên
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading]);

  useEffect(() => {
    if (accessToken && page === 1 && reels.length > 0) {
      setReels([]);
      setPage(1);
      setHasMore(true);
      setCurrentIndex(0);
      loadMore();
    } else if (accessToken && currentIndex >= reels.length - 2 && hasMore && !loading) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, accessToken, loading]);

  // --- like logic giữ nguyên, nhưng update cả searchResults khi cần
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
    // Nếu đang search và có reel đó, cập nhật cả searchResults
    setSearchResults((prev) =>
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
    if (videoEl) videoEl.scrollIntoView({ behavior: "smooth", block: "center" });
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

  // --- handle search: gọi API ngay trong Reel, không navigate
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) {
      // nếu input rỗng: reset về mode reel (Option A)
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const data = await searchReels(q, accessToken);
      setSearchResults(data || []);
      setIsSearching(true);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      showToast({
        text: "Lỗi tìm kiếm video, vui lòng thử lại",
        type: "error",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // nếu người dùng xóa keyword thủ công, reset về reel (Option A)
  useEffect(() => {
    if (!keyword || !keyword.trim()) {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [keyword]);

  // wheel/touch handlers - giữ nguyên nhưng không xử lý khi đang search
  useEffect(() => {
    const container = rightColumnRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // khi đang search thì không chặn scroll, grid dùng scroll default
      if (isSearching) return;
      e.preventDefault();
      if (!canScroll) return;
      const dir = e.deltaY > 50 ? "down" : e.deltaY < -50 ? "up" : null;
      if (dir === "down") handleNext();
      else if (dir === "up") handlePrev();
    };

    const handleTouchStart = (e) => (touchStartY.current = e.touches[0].clientY);
    const handleTouchEnd = (e) => {
      if (isSearching) return;
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
  }, [canScroll, currentIndex, reels, isSearching]);

  // pause/play video logic chỉ áp dụng cho mode reel
  useEffect(() => {
    const container = rightColumnRef.current;
    if (!container) return;

    const videos = container.querySelectorAll(`[data-reel-index] video`);
    videos.forEach((video) => {
      if (showDetail) {
        video.pause();
      } else if (video.closest(`[data-reel-index="${currentIndex}"]`)) {
        video.play().catch(() => { });
      }
    });
  }, [showDetail, currentIndex]);

  // render fallback khi chưa có data (chỉ ảnh hưởng mode reel)
  if (!isSearching && loading && reels.length === 0)
    return (
      <div className={styles.centerContainer}>
        <p>Đang tải...</p>
      </div>
    );
  if (!isSearching && reels.length === 0)
    return (
      <div className={styles.centerContainer}>
        <p>Không có Reel nào.</p>
      </div>
    );

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftColumn}>
        {/* ... Left Column (Search Form & Clear Button) - KHÔNG ĐỔI */}
        <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Tìm kiếm video..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Tìm</button>
        </form>

        {keyword && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setKeyword("");
              setIsSearching(false);
              setSearchResults([]);
            }}
          >
            Clear search
          </button>
        )}
      </div>

      <div
        className={styles.rightColumn}
        ref={rightColumnRef}
        style={{
          position: "relative",
          backgroundColor: "#E8E8E8",

          overflow: isSearching ? "auto" : "hidden",
          scrollBehavior: "smooth",
          minHeight: "100vh",
        }}
      >
        {/* === FIX 1: HIỂN THỊ LỚP NỀN MỜ CHỈ KHI KHÔNG SEARCH (hoặc điều chỉnh nó) === */}
        {/* Trong chế độ Search, ta muốn Grid hiển thị rõ ràng nên ta sẽ bỏ lớp nền mờ hoặc giới hạn nó chỉ nằm ở background. 
          Việc đặt zIndex: 0 và position: absolute cho nó là đúng, nhưng có thể nó đang bao trùm mọi thứ. 
          BỎ LỚP NỀN TẠM THỜI ĐỂ TEST HOẶC GỌI NÓ LÀ "BACKGROUND" */}
        {/* Sửa lại zIndex: 0 để đảm bảo nó là background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isSearching ? "transparent" : "rgba(0,0,0,0.25)", // Tắt mờ khi search để hiển thị rõ Grid
            zIndex: 0,
          }}
        />

        {/* === FIX 2: ĐẢM BẢO LỚP NỘI DUNG CHIẾM TOÀN BỘ KHÔNG GIAN CUỘN VÀ NẰM TRÊN NỀN MỜ === */}
        <div
          style={{
            position: "relative",
            zIndex: 1, // Đảm bảo lớp này luôn ở trên lớp nền (zIndex: 0)
            width: "100%", // Đảm bảo chiếm full chiều rộng
            // Khi đang search, cho phép nội dung tự kéo dài theo grid.
            // Khi không search, để chiều cao 100% để hiển thị ReelPlayer
            minHeight: isSearching ? "auto" : "100vh",
            display: "flex", // Cần thiết để căn giữa và sắp xếp nội dung
            flexDirection: "column",
            alignItems: "center", // Giữ lại căn giữa để tương thích với styles.rightColumn
          }}
        >
          {isSearching ? (
            <>
              {searchLoading && <p style={{ textAlign: "center", color: "#333", padding: "20px 0" }}>Đang tìm...</p>}

              {!searchLoading && searchResults.length > 0 ? (
                // FIX 3: Thêm padding-top/margin-top cho gridContainer (hoặc bọc nó) 
                // vì rightColumn có align-items: center và gap: 25px
                // Có thể bỏ gap: 25px trong styles.rightColumn nếu muốn grid bắt đầu từ trên cùng.
                // Ở đây, tôi thêm style để căn chỉnh lại vị trí khi search.
                <div
                  className={styles.gridContainer}
                  style={{ marginTop: '20px', marginBottom: '20px' }} // Thêm margin để nội dung không dính sát viền
                >
                  {searchResults.map((reel, i) => (
                    <div key={reel.idReel} className={styles.gridItem}>
                      <VideoCard
                        reel={reel}
                        onToggleLike={() =>
                          handleLike(
                            reel.idReel,
                            !reel.isLiked,
                            reel.likesCount + (reel.isLiked ? -1 : 1)
                          )
                        }
                        onOpenDetail={() => {
                          setDetailIndex(i);
                          setShowDetail(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                !searchLoading && <p className={styles.noResult}>Không có video nào.</p>
              )}
            </>
          ) : (
            // MODE REEL (giữ nguyên mã gốc, vẫn là các div 100vh)
            reels.map((reel, i) => (
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
                  onLike={() =>
                    handleLike(
                      reel.idReel,
                      !reel.isLiked,
                      reel.likesCount + (reel.isLiked ? -1 : 1)
                    )
                  }
                  onComment={() => handleCommentClick(i)}
                  onNavUp={handlePrev}
                  onNavDown={handleNext}
                  hasPrev={currentIndex > 0}
                  hasNext={currentIndex + 1 < reels.length}
                />
              </div>
            ))
          )}

          {/* VideoDetailDialog - KHÔNG ĐỔI */}
          {showDetail && (
            <VideoDetailDialog
              reels={isSearching ? searchResults : reels}
              currentIndex={detailIndex}
              onClose={() => setShowDetail(false)}
              onToggleLike={handleLike}
              onChangeVideo={handleChangeVideo}
              token={accessToken}
              globalMuted={globalMuted}
              onToggleGlobalMuted={() => setGlobalMuted((prev) => !prev)}
              fromReelPlayer={!isSearching}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Reel;

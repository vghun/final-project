import React, { useEffect, useState, useRef } from "react";
import styles from "./reels.module.scss";
import ReelPlayer from "~/components/ReelPlayer";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import VideoCard from "~/components/VideoCard"; // dùng lại VideoCard khi search
import { fetchReelsPaged, searchReels } from "~/services/reelService";
import { getHashtags, getTopHashtags } from "~/services/hashtagService";
import { useAuth } from "~/context/AuthContext";
import { useToast } from "~/context/ToastContext";
import { useLocation } from "react-router-dom";

const PAGE_SIZE = 3;
const SCROLL_COOLDOWN_MS = 1500;

function Reel() {
  const location = useLocation();
  const { accessToken, isLogin, loading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);
  const [topHashtags, setTopHashtags] = useState([]);

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
    const tag = location.state?.keyword;

    // ✅ Nếu đi từ BarberProfile (có keyword)
    if (tag) {
      setKeyword(tag);
      performSearch(tag);
    }
    // ✅ Nếu không có keyword => reset search state
    else {
      setIsSearching(false);
      setSearchResults([]);
      setKeyword("");
    }

    // ✅ Reset scroll UI
    window.scrollTo({ top: 0 });
    if (rightColumnRef.current) {
      rightColumnRef.current.scrollTop = 0;
    }

  }, [location.state]);

  useEffect(() => {
    if (location.state?.keyword) {
      const tag = location.state.keyword;
      setKeyword(tag);
      performSearch(tag); // ✅ Tự động gọi search luôn
    }
  }, [location.state]);


  useEffect(() => {
    getTopHashtags()
      .then(data => setTopHashtags(data || []))
      .catch(err => console.error("Lỗi load top hashtag:", err));
  }, []);


  useEffect(() => {
    const match = keyword.match(/#(\w+)$/);
    // Nếu keyword kết thúc bằng #<text>
    if (match && match[1]) {
      const query = match[1];
      getHashtags(query)
        .then(data => setHashtagSuggestions(data || []))
        .catch(() => setHashtagSuggestions([]));
    } else {
      setHashtagSuggestions([]);
    }
  }, [keyword]);

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
  // 🟢 THÊM: Hàm xử lý khi click vào hashtag (từ ReelPlayer hoặc gợi ý)
  const handleHashtagSearch = (tag) => {
    const q = `#${tag.trim()}`;
    setKeyword(q); // Cập nhật input search

    performSearch(q);
  };

  // 🟢 TẠO: Hàm thực hiện search API
  const performSearch = async (q) => {
    if (!q) return;

    try {
      setSearchLoading(true);
      const data = await searchReels(q, accessToken);
      setSearchResults(data || []);
      setIsSearching(true);

      setTimeout(() => {
        if (rightColumnRef.current) {
          rightColumnRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 50);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      showToast({
        text: "Lỗi tìm kiếm video, vui lòng thử lại",
        type: "error",
      });
    } finally {
      setSearchLoading(false);
      window.history.replaceState({}, document.title);
    }
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    performSearch(q);
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
        <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Tìm kiếm video..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Tìm</button>
        </form>

        {/* 🟢 HIỂN THỊ GỢI Ý HASHTAG */}
        {hashtagSuggestions.length > 0 && (
          <div className={styles.suggestionBox}>
            <p className={styles.suggestionTitle}>Gợi ý Hashtag:</p>
            <div className={styles.hashtagList}>
              {hashtagSuggestions.map(tag => (
                <button
                  key={tag.idHashtag}
                  className={styles.hashtagItem}
                  onClick={() => handleHashtagSearch(tag.name)}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

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
        {topHashtags.length > 0 && (
          <div className={styles.topHashtagBox}>
            <p className={styles.topHashtagTitle}>🔥 Hashtag nổi bật</p>
            <div className={styles.hashtagList}>
              {topHashtags.map(tag => (
                <button
                  key={tag.idHashtag}
                  className={styles.hashtagItem}
                  onClick={() => handleHashtagSearch(tag.name)}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={styles.rightColumn}
        ref={rightColumnRef}
        style={{
          position: "relative",

          backgroundImage: 'url("/Reel.png")',
          backgroundSize: "cover", // Đảm bảo ảnh phủ kín toàn bộ phần tử
          backgroundPosition: "center", // Căn giữa ảnh
          backgroundRepeat: "no-repeat", // Tránh lặp lại ảnh
          // ------------------------

          overflow: isSearching ? "auto" : "hidden",
          scrollBehavior: "smooth",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isSearching ? "transparent" : "rgba(0,0,0,0.25)", // Tắt mờ khi search để hiển thị rõ Grid
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1, // Đảm bảo lớp này luôn ở trên lớp nền (zIndex: 0)
            width: "100%", // Đảm bảo chiếm full chiều rộng
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
                          if (!isLogin) {
                            showToast({
                              text: "Vui lòng đăng nhập để xem chi tiết video",
                              type: "error"
                            });
                            return;
                          }
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
                  onHashtagClick={handleHashtagSearch}
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
              onHashtagClick={handleHashtagSearch} // 🆕 truyền logic xuống
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Reel;

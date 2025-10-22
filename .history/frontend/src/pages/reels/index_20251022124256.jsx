import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./reels.module.scss";
import ReelPlayer from "~/components/ReelPlayer";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import { fetchReelsPaged } from "~/services/reelService";

const PAGE_SIZE = 5;
const SCROLL_COOLDOWN_MS = 500; // thời gian khóa scroll mỗi lần

function Reel() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idUser, setIdUser] = useState(5);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [canScroll, setCanScroll] = useState(true);

  const rightColumnRef = useRef(null);
  const navigate = useNavigate();

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await fetchReelsPaged(page, PAGE_SIZE, idUser);
      setReels((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.error("Lỗi tải reels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idUser) loadMore();
  }, [idUser]);

  useEffect(() => {
    if (currentIndex >= reels.length - 2 && hasMore && !loading) {
      loadMore();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (detailIndex >= reels.length - 2 && hasMore && !loading) {
      loadMore();
    }
  }, [detailIndex]);

  const handleLike = (idReel, liked, count) => {
    setReels((prev) =>
      prev.map((r) => (r.idReel === idReel ? { ...r, isLiked: liked, likesCount: count } : r))
    );
  };

  const handleNext = () => {
    if (currentIndex + 1 < reels.length) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleChangeVideo = (newIndex) => {
    setDetailIndex(newIndex);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  // Scroll chỉ trong cột video
  useEffect(() => {
    const container = rightColumnRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (!canScroll) return;

      setCanScroll(false);
      if (e.deltaY > 0) handleNext();
      else if (e.deltaY < 0) handlePrev();

      setTimeout(() => setCanScroll(true), SCROLL_COOLDOWN_MS);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container.removeEventListener("wheel", handleWheel);
  }, [canScroll, currentIndex, reels]);

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

  const currentReel = reels[currentIndex];

  return (
    <div className={styles.pageWrapper}>
      {/* Cột trái: search */}
      <div className={styles.leftColumn}>
        <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Tìm kiếm video theo tiêu đề hoặc mô tả..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Tìm</button>
        </form>
      </div>

      {/* Cột phải: video */}
      {/* Cột phải: video */}
<div
  className={styles.rightColumn}
  ref={rightColumnRef}
  style={{
    backgroundImage: 'url("/images/bg.jpg")', // đường dẫn từ public
    backgroundSize: "cover",                 // ảnh phủ đầy
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <ReelPlayer
    reel={currentReel}
    idUser={idUser}
    onLike={handleLike}
    onComment={() => {
      setDetailIndex(currentIndex);
      setShowDetail(true);
    }}
    onNavUp={handlePrev}
    onNavDown={handleNext}
  />

  {showDetail && (
    <VideoDetailDialog
      reels={reels}
      currentIndex={detailIndex}
      onClose={() => setShowDetail(false)}
      onToggleLike={handleLike}
      onChangeVideo={handleChangeVideo}
      idUser={idUser}
    />
  )}
</div>

    </div>
  );
}

export default Reel;

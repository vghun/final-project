import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ReelSearch.module.scss";
import VideoCard from "~/components/VideoCard";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import { searchReels } from "~/services/reelService";

function ReelSearch() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParam = new URLSearchParams(location.search).get("q") || "";
  const [query, setQuery] = useState(queryParam);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const idUser = 5;

  // 🟢 Hàm search API
  const doSearch = async (keyword) => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const data = await searchReels(keyword, idUser);
      setReels(data);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Tự động search khi queryParam trên URL thay đổi
  useEffect(() => {
    if (queryParam) doSearch(queryParam);
  }, [queryParam]);

  // 🟢 Khi bấm nút tìm trong form
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Cập nhật URL
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    // ✅ Gọi API ngay lập tức để có kết quả liền
    doSearch(query);
  };

  // 🟢 Toggle like
  const toggleLike = (idReel, isLiked, likesCount) => {
    setReels((prev) =>
      prev.map((r) =>
        r.idReel === idReel ? { ...r, isLiked, likesCount } : r
      )
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tìm kiếm Video</h2>

      <form onSubmit={handleSearch} className={styles.searchBox}>
        <input
          type="text"
          placeholder="Nhập tiêu đề hoặc mô tả video..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </form>

      {loading && <p>Đang tải...</p>}

      {!loading && reels.length > 0 ? (
        <div className={styles.grid}>
          {reels.map((reel, idx) => (
            <VideoCard
              key={reel.idReel}
              reel={reel}
              idUser={idUser}
              onToggleLike={toggleLike}
              onOpenDetail={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      ) : (
        !loading && <p className={styles.noResult}>Không có video nào.</p>
      )}

      {currentIndex !== null && (
        <VideoDetailDialog
          reels={reels}
          currentIndex={currentIndex}
          onClose={() => setCurrentIndex(null)}
          onChangeVideo={(newIdx) => setCurrentIndex(newIdx)}
          onToggleLike={toggleLike}
          idUser={idUser}
        />
      )}
    </div>
  );
}

export default ReelSearch;

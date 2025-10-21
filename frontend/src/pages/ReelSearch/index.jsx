import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ReelSearch.module.scss";
import VideoCard from "~/components/VideoCard";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import { searchReels } from "~/services/reelService";

function ReelSearch() {
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search).get("q") || "";
  const [query, setQuery] = useState(queryParam);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const idUser = 5;

  useEffect(() => {
    const doSearch = async () => {
      if (!queryParam) return;
      setLoading(true);
      try {
        const data = await searchReels(queryParam, idUser);
        setReels(data);
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [queryParam]);

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

      {reels.length > 0 ? (
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

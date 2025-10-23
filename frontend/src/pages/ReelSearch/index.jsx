import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ReelSearch.module.scss";
import VideoCard from "~/components/VideoCard";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import { useAuth } from "~/context/AuthContext";
import { useToast } from "~/context/ToastContext";
import { searchReels } from "~/services/reelService";

function ReelSearch() {
  const { accessToken, isLogin, loading: isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryParam = new URLSearchParams(location.search).get("q") || "";
  const [query, setQuery] = useState(queryParam);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const doSearch = async (keyword, token) => { 
    if (!keyword.trim()) return;
    console.log("Gọi API tìm kiếm với keyword:", keyword, "token:", token);
    setLoading(true);
    try {
      // Truyền token đã nhận vào
      const data = await searchReels(keyword, token); 
      console.log("Kết quả tìm kiếm:", data);
      setReels(data);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      showToast({
        text: "Lỗi tìm kiếm video, vui lòng thử lại",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && queryParam) {
        // Truyền accessToken hiện tại xuống doSearch
        doSearch(queryParam, accessToken); 
    }
  }, [isAuthLoading, queryParam, accessToken]);

  // 🟢 Khi bấm nút tìm trong form
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    doSearch(query);
  };

  // 🟢 Toggle like

  const toggleLike = (idReel, isLiked, likesCount) => {
    if (!isLogin) {
      showToast({
        text: "Vui lòng đăng nhập để thực hiện hành động này",
        type: "error",
      });
      return;
    }
    setReels((prev) =>
      prev.map((r) =>
        r.idReel === idReel ? { ...r, isLiked, likesCount } : r
      )
    );
  };
  const handleOpenDetail = (idx) => {
    if (!isLogin) {
      showToast({
        text: "Vui lòng đăng nhập để thực hiện hành động này",
        type: "error",
      });
      return;
    }
    setCurrentIndex(idx);
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
              onToggleLike={toggleLike}
              onOpenDetail={() => handleOpenDetail(idx)}
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
          token={accessToken}
        />
      )}
    </div>
  );
}

export default ReelSearch;

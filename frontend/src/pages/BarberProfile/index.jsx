import React, { useEffect, useState } from "react";
import styles from "./BarberProfile.module.scss";
import { useParams } from "react-router-dom";
import { BarberAPI } from "~/apis/barberAPI";
import { fetchReelsByBarberId } from "~/services/reelService";
import VideoCard from "~/components/VideoCard";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import { useAuth } from "~/context/AuthContext"; // 🟢 THÊM
import { useToast } from "~/context/ToastContext";
import { useNavigate } from "react-router-dom";

function BarberProfile() {
  const { id } = useParams(); // /barber/:id
  const [barber, setBarber] = useState(null);
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [globalMuted, setGlobalMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const { accessToken, isLogin, loading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Hoãn việc tải data cho đến khi AuthContext xác định xong trạng thái
    if (isAuthLoading) return;

    const loadData = async () => {
      try {
        // Tải Profile không cần token (public)
        const profile = await BarberAPI.getProfile(id);

        // Tải Video, TRUYỀN accessToken để lấy trạng thái isLiked chính xác
        const videos = await fetchReelsByBarberId(id, 1, 20, accessToken);

        setBarber(profile);
        setReels(videos);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, accessToken, isAuthLoading]);

  const handleHashtagClick = (tag) => {
  navigate("/reels", {
    state: { keyword: `#${tag}` }
  });
};

  const handleOpenDetail = (idx) => {
    if (!isLogin) {
      showToast({
        text: "Vui lòng đăng nhập để xem chi tiết video!",
        type: "error",
      });
      return;
    }
    setCurrentIndex(idx);
  };

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

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  if (!barber) return <div className={styles.empty}>Không tìm thấy thợ cắt tóc này.</div>;

  return (
    <div className={styles.container}>
      {/* ===== THÔNG TIN THỢ ===== */}
      <div className={styles.profileSection}>
        <img
          src={barber.image || "/default-avatar.png"}
          alt={barber.fullName}
          className={styles.avatar}
        />
        <div className={styles.info}>
          <h2 className={styles.name}>{barber.fullName}</h2>
          <p className={styles.branch}>
            {barber.branchName} • {barber.branchAddress}
          </p>
          <p className={styles.contact}>
            📧 {barber.email} | ☎️ {barber.phoneNumber}
          </p>

          <div className={styles.rating}>
            ⭐ {barber.avgRate} / 5 ({barber.totalRate} lượt đánh giá)
          </div>

          <div className={styles.descBox}>
            <h3>Giới thiệu & Kinh nghiệm</h3>
            <pre className={styles.desc}>{barber.profileDescription}</pre>
          </div>
        </div>
      </div>

      {/* ===== VIDEO TAY NGHỀ ===== */}
      <div className={styles.videoSection}>
        <h3 className={styles.videoTitle}>Video tay nghề</h3>
        {reels.length === 0 ? (
          <div className={styles.empty}>Thợ này chưa có video nào 😅</div>
        ) : (
          <div className={styles.grid}>
            {reels.map((reel, idx) => (
              <VideoCard
                key={reel.idReel}
                reel={reel}
                idUser={null} // khách xem nên có thể để null
                onToggleLike={() => { }} // disable like
                onOpenDetail={() => handleOpenDetail(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== DIALOG XEM VIDEO ===== */}
      {currentIndex !== null && (
        <VideoDetailDialog
          reels={reels}
          currentIndex={currentIndex}
          onChangeVideo={(newIdx) => setCurrentIndex(newIdx)} 
          onClose={() => setCurrentIndex(null)}
          token={accessToken}
          globalMuted={globalMuted}
          onToggleLike={handleLike}
          onToggleGlobalMuted={() => setGlobalMuted((prev) => !prev)}
          fromReelPlayer={false}
          onHashtagClick={handleHashtagClick}
        />
      )}
    </div>
  );
}

export default BarberProfile;

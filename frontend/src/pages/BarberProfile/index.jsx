import React, { useEffect, useState } from "react";
import styles from "./BarberProfile.module.scss";
import { useParams } from "react-router-dom";
import { BarberAPI } from "~/apis/barberAPI";
import { fetchReelsPaged } from "~/services/reelService";
import VideoCard from "~/components/VideoCard";
import VideoDetailDialog from "~/components/VideoDetailDialog";

function BarberProfile() {
  const { id } = useParams(); // /barber/:id
  const [barber, setBarber] = useState(null);
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [globalMuted, setGlobalMuted] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await BarberAPI.getProfile(id);
        const videos = await fetchReelsPaged(1, 20, id); // lấy 20 video của thợ đó
        setBarber(profile);
        setReels(videos);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

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
                onToggleLike={() => {}} // disable like
                onOpenDetail={() => setCurrentIndex(idx)}
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
          idUser={null}
          globalMuted={globalMuted}
          onToggleGlobalMuted={() => setGlobalMuted((prev) => !prev)}
          fromReelPlayer={false}
        />
      )}
    </div>
  );
}

export default BarberProfile;

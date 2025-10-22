import React, { useState, useEffect } from "react";
import styles from "./VideoTayNghe.module.scss";
import VideoCard from "~/components/VideoCard";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import UploadVideoDialog from "~/components/UploadVideoDialog";
import { fetchReelsPaged } from "~/services/reelService";

function VideoTayNghe() {
  const [reels, setReels] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [globalMuted, setGlobalMuted] = useState(true); // Add globalMuted state
  const idUser = 2; // quản lý index thay vì reel

  const openDetail = (index) => {
    setCurrentIndex(index);
    setGlobalMuted(false); // Unmute when opening VideoDetailDialog
  };

  useEffect(() => {
    const loadReels = async () => {
      const data = await fetchReelsPaged(1, 10, idUser);
      setReels(data);
    };
    loadReels();
  }, []);

  const toggleLike = (idReel, isLiked, likesCount) => {
    setReels((prev) =>
      prev.map((r) =>
        r.idReel === idReel
          ? { ...r, isLiked: isLiked, likesCount: likesCount } // Đảm bảo cập nhật cả isLiked và likesCount
          : r
      )
    );
  };

  const handleUpload = (newReel) => {
    setReels([newReel, ...reels]);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Video tay nghề</h2>
      <p className={styles.subtitle}>Upload và quản lý video showcase kỹ năng cắt tóc</p>

      <div className={styles.header}>
        <button className={styles.uploadBtn} onClick={() => setIsUploadOpen(true)}>
          Upload Video
        </button>
      </div>

      <div className={styles.grid}>
        {reels.map((reel, idx) => (
          <VideoCard
            key={reel.idReel}
            reel={reel}
            onToggleLike={toggleLike}
            onOpenDetail={() => openDetail(idx)}
            idUser={idUser}
          />
        ))}
      </div>

      {currentIndex !== null && (
        <VideoDetailDialog
          reels={reels}
          currentIndex={currentIndex}
          onChangeVideo={(newIdx) => setCurrentIndex(newIdx)}
          onClose={() => setCurrentIndex(null)}
          onToggleLike={toggleLike}
          idUser={idUser}
          globalMuted={globalMuted}
          onToggleGlobalMuted={() => setGlobalMuted((prev) => !prev)}
          fromReelPlayer={false} // Indicate not from ReelPlayer
        />
      )}

      <UploadVideoDialog
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

export default VideoTayNghe;
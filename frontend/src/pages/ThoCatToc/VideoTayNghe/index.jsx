import React, { useState } from "react";
import styles from "./VideoTayNghe.module.scss";
import VideoCard from "~/components/VideoCard";
import VideoDetailDialog from "~/components/VideoDetailDialog";
import UploadVideoDialog from "~/components/UploadVideoDialog";

function VideoTayNghe() {
  const [reels, setReels] = useState([
    {
      id: 1,
      title: "Cắt tóc Fade cực đỉnh 🔥",
      description: "Kỹ thuật fade chuyên nghiệp với đường nét sắc sảo",
      thumbnail: "/modern-haircut-fade.jpg",
      videoUrl: "/modern-haircut-fade.mp4",
      duration: "0:45",
      views: 1250,
      likes: 89,
      isLiked: false,
      createdAt: "2 ngày trước",
      comments: [
        {
          id: 101,
          author: "Khách hàng A",
          content: "Tay nghề đỉnh quá!",
          time: "2 giờ trước",
          replies: [
            { id: 201, author: "Minh Tuấn", content: "Cảm ơn bạn nhiều nha!" },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Kỹ thuật cắt râu chuyên nghiệp",
      description: "Hướng dẫn cắt tỉa râu đẹp và chỉn chu",
      thumbnail: "/professional-beard-trim.jpg",
      videoUrl: "/professional-beard-trim.mp4",
      duration: "1:05",
      views: 756,
      likes: 43,
      isLiked: true,
      createdAt: "5 ngày trước",
      comments: [],
    },
    {
      id: 3,
      title: "Cắt tóc Undercut hiện đại",
      description: "Phong cách undercut cho nam giới trẻ trung",
      thumbnail: "/undercut-hairstyle.jpg",
      videoUrl: "/undercut-hairstyle.mp4",
      duration: "0:55",
      views: 980,
      likes: 67,
      isLiked: false,
      createdAt: "1 tuần trước",
      comments: [
        {
          id: 102,
          author: "Khách hàng B",
          content: "Rất đẹp!",
          time: "1 ngày trước",
          replies: [],
        },
      ],
    },
    {
      id: 4,
      title: "Tạo kiểu tóc quiff",
      description: "Hướng dẫn tạo kiểu quiff nhanh chóng",
      thumbnail: "/quiff-hairstyle.jpg",
      videoUrl: "/quiff-hairstyle.mp4",
      duration: "1:20",
      views: 1120,
      likes: 78,
      isLiked: true,
      createdAt: "3 ngày trước",
      comments: [],
    },
    {
      id: 5,
      title: "Cắt tóc layer nữ",
      description: "Kỹ thuật cắt layer cho tóc nữ dài",
      thumbnail: "/layer-haircut.jpg",
      videoUrl: "/layer-haircut.mp4",
      duration: "1:15",
      views: 890,
      likes: 56,
      isLiked: false,
      createdAt: "4 ngày trước",
      comments: [
        {
          id: 103,
          author: "Khách hàng C",
          content: "Muốn thử kiểu này!",
          time: "3 giờ trước",
          replies: [],
        },
      ],
    },
    {
      id: 6,
      title: "Nhuộm tóc highlight",
      description: "Quy trình nhuộm highlight chuyên nghiệp",
      thumbnail: "/hair-highlight.jpg",
      videoUrl: "/hair-highlight.mp4",
      duration: "1:30",
      views: 1340,
      likes: 92,
      isLiked: true,
      createdAt: "6 ngày trước",
      comments: [],
    },
  ]);

  const [selectedReel, setSelectedReel] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const toggleLike = (id) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );
  };

  const handleUpload = (newVideo) => {
    const newReel = {
      id: Date.now(),
      ...newVideo,
      videoUrl: "/uploaded-video.mp4", // Placeholder for actual video URL
      views: 0,
      likes: 0,
      isLiked: false,
      createdAt: "vừa xong",
      comments: [],
    };
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
        {reels.map((reel) => (
          <VideoCard
            key={reel.id}
            reel={reel}
            onToggleLike={toggleLike}
            onOpenDetail={setSelectedReel}
          />
        ))}
      </div>

      {selectedReel && (
        <VideoDetailDialog
          reel={selectedReel}
          onClose={() => setSelectedReel(null)}
          onToggleLike={toggleLike}
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
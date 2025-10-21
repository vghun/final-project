import React, { useState, useEffect, useRef } from "react";
import styles from "./VideoDetailDialog.module.scss";
import { likeReel, getComments, addComment, addReply, trackReelView } from "~/services/reelService";
import { Heart, Share2, ChevronUp, ChevronDown, Send } from "lucide-react";

const MIN_VIEW_DURATION_MS = 3000;
function VideoDetailDialog({ reels, currentIndex, onClose, onToggleLike, onChangeVideo, idUser }) {
  const reel = reels[currentIndex];
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [newReply, setNewReply] = useState("");
  const videoRef = useRef(null);
  if (idUser === undefined) idUser = 5;


  const isViewTrackedRef = useRef(false);

  // Logic để theo dõi lượt xem (Tracking logic)
  useEffect(() => {
    // 1. RESET REF: Đặt lại trạng thái khi chuyển sang Reel mới
    isViewTrackedRef.current = false;

    const trackViewAPI = async () => {
      if (!reel || !idUser) return;

      try {
        await trackReelView(reel.idReel, idUser);
        console.log(`View tracked successfully for Reel ${reel.idReel} after 3s.`);
      } catch (err) {
        console.error("View tracking failed:", err);
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current && videoRef.current.currentTime * 1000 >= MIN_VIEW_DURATION_MS) {

        // 2. SỬ DỤNG REF ĐỂ KIỂM TRA
        if (!isViewTrackedRef.current) {
          trackViewAPI();
          isViewTrackedRef.current = true; // 3. CẬP NHẬT REF
        }

        // Luôn xóa listener sau khi đạt ngưỡng
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    if (reel && videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    // Cleanup: Dọn dẹp listener khi component unmount hoặc reel thay đổi
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    // Mảng dependency gọn gàng, không cần isViewTrackedRef
  }, [reel, idUser]);

  // Load comments and reset like state when reel changes
  useEffect(() => {
    const loadComments = async () => {
      const data = await getComments(reel.idReel);

      const commentMap = {};
      const roots = [];

      data.forEach((c) => {
        commentMap[c.idComment] = { ...c, replies: [] };
      });

      data.forEach((c) => {
        if (c.parentCommentId) {
          commentMap[c.parentCommentId]?.replies.push(commentMap[c.idComment]);
        } else {
          roots.push(commentMap[c.idComment]);
        }
      });

      setComments(roots);
    };

    if (reel) {
      loadComments();
    }
  }, [reel]);

  const handleLike = async () => {
    try {
      const res = await likeReel(reel.idReel, idUser);
      onToggleLike(reel.idReel, res.liked, res.likesCount); // Update parent state
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const cmt = await addComment(reel.idReel, idUser, newComment);
    setComments([...comments, { ...cmt, replies: [] }]);
    setNewComment("");
  };

  const handleAddReply = async (commentId) => {
    if (!newReply.trim()) return;
    const rep = await addReply(commentId, idUser, newReply);
    setComments(comments.map(c =>
      c.idComment === commentId
        ? { ...c, replies: [...(c.replies || []), rep] }
        : c
    ));
    setNewReply("");
    setActiveReply(null);
  };

  const handleEnded = () => {
    if (currentIndex < reels.length - 1) {
      onChangeVideo(currentIndex + 1);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        {/* Left - Video */}
        <div className={styles.videoSection}>
          <video
            ref={videoRef}
            src={reel.url}
            controls
            autoPlay
            loop // Thường là loop trong giao diện reel
            onEnded={handleEnded}
            muted // Thường là muted ban đầu
          />
          {/* Nút đóng X ở góc trên bên phải của video (như Insta) */}
          <button onClick={onClose} className={styles.closeBtn}>
            ✖
          </button>
        </div>

        {/* Right - Info + Comments */}
        <div className={styles.infoSection}>

          {/* 1. Header & Meta: Có thể cố định hoặc nằm trên cùng */}
          <div className={styles.header}>
            <div className={styles.reelMeta}>
              <img
                src={reel.Barber?.user?.image || "/user.png"}
                alt="avatar"
                className={styles.authorAvatar}
              />
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>
                  {reel.Barber?.user?.fullName || "Barber ẩn danh"}
                </span>
                <span className={styles.postTime}>
                  {new Date(reel.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              {/* Bạn có thể thêm nút Follow/Theo dõi tại đây */}
            </div>
          </div>

          {/* 2. Description (Mô tả) */}
          <div className={styles.descriptionBox}>
            <p className={styles.desc}>{reel.description || "Chưa có mô tả"}</p>
          </div>

          {/* 3. Comment List: Vùng cuộn chính */}
          <div className={styles.commentsContainer}>
            <div className={styles.commentsHeader}>
              <h4>Bình luận ({reel.commentsCount})</h4>
            </div>
            <div className={styles.commentList}>
              {comments.map((cmt) => (
                <div key={cmt.idComment} className={styles.comment}>
                  <div className={styles.cmtHeader}>
                    <img
                      src={cmt.User?.image || "/user.png"}
                      alt="avatar"
                      className={styles.avatar}
                    />
                    <div className={styles.cmtInfo}>
                      <div className={styles.cmtAuthorTime}>
                        <span className={styles.author}>{cmt.User?.fullName || "Ẩn danh"}</span>
                        <span className={styles.time}>
                          {new Date(cmt.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={styles.content}>{cmt.content}</p>
                    </div>
                  </div>

                  <button
                    className={styles.replyBtn}
                    onClick={() => setActiveReply(cmt.idComment)}
                  >
                    Trả lời
                  </button>

                  {/* Hiển thị Replies và Reply Form */}
                  {/* (Giữ nguyên logic hiển thị replies và reply form) */}
                  {cmt.replies.length > 0 && (
                    <div className={styles.replies}>
                      {cmt.replies.map((rep) => (
                        <div key={rep.idComment} className={styles.reply}>
                          <img
                            src={rep.User?.image || "/user.png"}
                            alt="avatar"
                            className={styles.avatarSmall}
                          />
                          <div className={styles.replyText}>
                            <span className={styles.author}>{rep.User?.fullName || "Ẩn danh"}</span>
                            <p className={styles.replyContent}>{rep.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeReply === cmt.idComment && (
                    <div className={styles.replyForm}>
                      <input
                        type="text"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder={`Trả lời ${cmt.User?.fullName || 'bình luận'}...`}
                      />
                      <button
                        onClick={() => handleAddReply(cmt.idComment)}
                        disabled={!newReply.trim()}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Actions (Like/Share) & Add Comment: Cố định ở Footer */}
          <div className={styles.footerActions}>
            <div className={styles.reelActions}>
              <button
                className={styles.likeBtn}
                onClick={handleLike}
                style={{ color: reel.isLiked ? 'red' : '#333' }}
              >
                <Heart
                  size={24}
                  fill={reel.isLiked ? 'red' : 'none'}
                  strokeWidth={reel.isLiked ? 0 : 2}
                />
                <span>{reel.likesCount || 0}</span>
              </button>
              <button
                className={styles.shareBtn}
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                <Share2 size={20} />
                <span>Chia sẻ</span>
              </button>
            </div>

            <div className={styles.addComment}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Thêm bình luận..."
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nút chuyển video (đặt lại vị trí) */}
      <div className={styles.navContainer}>
        <button
          className={`${styles.navBtn} ${styles.prevBtn}`}
          disabled={currentIndex === 0}
          onClick={() => onChangeVideo(currentIndex - 1)}
        >
          <ChevronUp size={24} />
        </button>
        <button
          className={`${styles.navBtn} ${styles.nextBtn}`}
          disabled={currentIndex === reels.length - 1}
          onClick={() => onChangeVideo(currentIndex + 1)}
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
}

export default VideoDetailDialog;
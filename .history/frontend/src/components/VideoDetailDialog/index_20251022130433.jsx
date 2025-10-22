import React, { useState, useEffect, useRef } from "react";
import styles from "./VideoDetailDialog.module.scss";
import {
  likeReel,
  getComments,
  addComment,
  addReply,
  trackReelView,
} from "~/services/reelService";
import { Heart, Share2, ChevronUp, ChevronDown, Send } from "lucide-react";

const MIN_VIEW_DURATION_MS = 3000;

function VideoDetailDialog({
  reels,
  currentIndex,
  onClose,
  onToggleLike,
  onChangeVideo,
  idUser = 5,
}) {
  const reel = reels[currentIndex];
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [newReply, setNewReply] = useState("");

  const videoRef = useRef(null);
  const dialogRef = useRef(null);
  const isViewTrackedRef = useRef(false);

  // Track view after 3s
  useEffect(() => {
    isViewTrackedRef.current = false;
    const handleTimeUpdate = () => {
      if (
        videoRef.current &&
        videoRef.current.currentTime * 1000 >= MIN_VIEW_DURATION_MS
      ) {
        if (!isViewTrackedRef.current) {
          trackReelView(reel.idReel, idUser).catch(console.error);
          isViewTrackedRef.current = true;
        }
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };

    videoRef.current?.addEventListener("timeupdate", handleTimeUpdate);
    return () =>
      videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
  }, [reel, idUser]);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      const data = await getComments(reel.idReel);
      const map = {};
      const roots = [];
      data.forEach((c) => (map[c.idComment] = { ...c, replies: [] }));
      data.forEach((c) =>
        c.parentCommentId
          ? map[c.parentCommentId]?.replies.push(map[c.idComment])
          : roots.push(map[c.idComment])
      );
      setComments(roots);
    };
    if (reel) loadComments();
  }, [reel]);

  // Click outside dialog to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleLike = async () => {
    const res = await likeReel(reel.idReel, idUser);
    onToggleLike(reel.idReel, res.liked, res.likesCount);
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
    setComments(
      comments.map((c) =>
        c.idComment === commentId
          ? { ...c, replies: [...(c.replies || []), rep] }
          : c
      )
    );
    setNewReply("");
    setActiveReply(null);
  };

  const handleEnded = () => {
    if (currentIndex < reels.length - 1) onChangeVideo(currentIndex + 1);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog} ref={dialogRef}>
        {/* 🎬 Video Section */}
        <div className={styles.videoSection}>
          <video
            ref={videoRef}
            src={reel.url}
            controls
            autoPlay
            loop
            muted
            onEnded={handleEnded}
          />
          <button className={styles.closeBtn} onClick={onClose}>
            ✖
          </button>

          {/* ✅ Navigation Buttons nằm trong video */}
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

        {/* 📝 Info + Comments */}
        <div className={styles.infoSection}>
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
            </div>
          </div>

          <div className={styles.descriptionBox}>
            <p className={styles.desc}>{reel.description || "Chưa có mô tả"}</p>
          </div>

          <div className={styles.commentsContainer}>
            <h4>Bình luận ({reel.commentsCount})</h4>
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
                        <span className={styles.author}>
                          {cmt.User?.fullName || "Ẩn danh"}
                        </span>
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
                            <span className={styles.author}>
                              {rep.User?.fullName || "Ẩn danh"}
                            </span>
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
                        placeholder={`Trả lời ${
                          cmt.User?.fullName || "bình luận"
                        }...`}
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

          <div className={styles.footerActions}>
            <div className={styles.reelActions}>
              <button
                className={styles.likeBtn}
                onClick={handleLike}
                style={{ color: reel.isLiked ? "red" : "#333" }}
              >
                <Heart
                  size={24}
                  fill={reel.isLiked ? "red" : "none"}
                  strokeWidth={reel.isLiked ? 0 : 2}
                />
                <span>{reel.likesCount || 0}</span>
              </button>
              <button
                className={styles.shareBtn}
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
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
              <button onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoDetailDialog;

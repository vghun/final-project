import React, { useState, useEffect, useRef } from "react";
import styles from "./VideoDetailDialog.module.scss";
import { likeReel, getComments, addComment, addReply } from "~/services/reelService";

function VideoDetailDialog({ reels, currentIndex, onClose, onToggleLike, onChangeVideo, idUser }) {
  const reel = reels[currentIndex];
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [newReply, setNewReply] = useState("");
  const videoRef = useRef(null);

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
            onEnded={handleEnded}
          />
        </div>

        {/* Right - Info + Comments */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <h2>{reel.title}</h2>
            <button onClick={onClose} className={styles.closeBtn}>✖</button>
          </div>
          <p className={styles.desc}>{reel.description}</p>
          <div className={styles.meta}>
            <span>{reel.views} lượt xem</span> • <span>{reel.createdAt}</span>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.likeBtn}
              onClick={handleLike}
            >
              <img
                src={reel.isLiked ? "/liked.png" : "/like.png"}
                alt="like"
                className={styles.likeIcon}
              />
              <span>{reel.likesCount || 0}</span>
            </button>
            <button
              className={styles.shareBtn}
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              🔗 Chia sẻ
            </button>
          </div>

          <div className={styles.comments}>
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
                      <span className={styles.author}>{cmt.User?.fullName || "Ẩn danh"}</span>
                      <span className={styles.time}>
                        {new Date(cmt.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className={styles.content}>{cmt.content}</p>

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
                          <div>
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
                        placeholder="Trả lời..."
                      />
                      <button onClick={() => handleAddReply(cmt.idComment)}>Gửi</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.addComment}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Thêm bình luận..."
              />
              <button onClick={handleAddComment}>Gửi</button>
            </div>
          </div>
        </div>
      </div>

      {/* Nút chuyển video */}
      <div className={styles.navContainer}>
        <button
          className={`${styles.navBtn} ${styles.prevBtn}`}
          disabled={currentIndex === 0}
          onClick={() => onChangeVideo(currentIndex - 1)}
        >
          ▲
        </button>
        <button
          className={`${styles.navBtn} ${styles.nextBtn}`}
          disabled={currentIndex === reels.length - 1}
          onClick={() => onChangeVideo(currentIndex + 1)}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export default VideoDetailDialog;
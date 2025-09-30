// VideoDetailDialog.jsx
import React, { useState } from "react";
import styles from "./VideoDetailDialog.module.scss";

function VideoDetailDialog({ reel, onClose, onToggleLike }) {
  const [comments, setComments] = useState(reel.comments || []);
  const [newComment, setNewComment] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [newReply, setNewReply] = useState("");

  const addComment = () => {
    if (!newComment.trim()) return;
    const newCmt = {
      id: Date.now(),
      author: "Bạn",
      content: newComment,
      time: "vừa xong",
      replies: [],
    };
    setComments([...comments, newCmt]);
    setNewComment("");
  };

  const addReply = (commentId) => {
    if (!newReply.trim()) return;
    const updatedComments = comments.map((c) =>
      c.id === commentId
        ? {
            ...c,
            replies: [
              ...c.replies,
              { id: Date.now(), author: "Bạn", content: newReply },
            ],
          }
        : c
    );
    setComments(updatedComments);
    setNewReply("");
    setActiveReply(null);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        {/* Left - Video */}
        <div className={styles.videoSection}>
          <video
            src={reel.videoUrl}
            poster={reel.thumbnail}
            controls
            autoPlay
            loop
            muted
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
              className={`${styles.likeBtn} ${reel.isLiked ? styles.liked : ""}`}
              onClick={() => onToggleLike(reel.id)}
            >
              ❤️ {reel.likes}
            </button>
            <button className={styles.shareBtn}>🔗 Chia sẻ</button>
          </div>

          <div className={styles.comments}>
            <h4>Bình luận</h4>
            <div className={styles.commentList}>
              {comments.map((cmt) => (
                <div key={cmt.id} className={styles.comment}>
                  <div className={styles.cmtHeader}>
                    <span className={styles.author}>{cmt.author}</span>
                    <span className={styles.time}>{cmt.time}</span>
                  </div>
                  <p>{cmt.content}</p>
                  <button
                    className={styles.replyBtn}
                    onClick={() => setActiveReply(cmt.id)}
                  >
                    Trả lời
                  </button>
                  {cmt.replies?.length > 0 && (
                    <div className={styles.replies}>
                      {cmt.replies.map((rep) => (
                        <div key={rep.id} className={styles.reply}>
                          <span className={styles.author}>{rep.author}</span>:{" "}
                          {rep.content}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeReply === cmt.id && (
                    <div className={styles.replyForm}>
                      <input
                        type="text"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Trả lời..."
                      />
                      <button onClick={() => addReply(cmt.id)}>Gửi</button>
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
              <button onClick={addComment}>Gửi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoDetailDialog;
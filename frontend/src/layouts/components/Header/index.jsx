// src/components/Header/Header.jsx
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";

import styles from "./Header.module.scss";
import { faChevronDown, faCut } from "@fortawesome/free-solid-svg-icons";

import Button from "~/components/Button";
import Modal from "~/components/Modal";
import UserMenu from "~/components/Popper/UserMenu";
import { useAuth } from "~/context/AuthContext";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import {
  fetchMyNotifications,
  markNotificationAsRead,
} from "~/services/notificationService";

const cx = classNames.bind(styles);

function Header() {
  const [showModal, setShowModal] = useState(false);
  const { user, isLogin, accessToken } = useAuth();

  const [showNotify, setShowNotify] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotify, setLoadingNotify] = useState(false);

  // State cho custom dialog chi tiết thông báo
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notifyRef = useRef(null);
  const dialogRef = useRef(null); // Ref cho dialog để loại trừ khi click outside

  // Fetch thông báo
  useEffect(() => {
    if (isLogin && accessToken) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isLogin, accessToken]);

  const loadNotifications = async () => {
    if (!accessToken) return;
    setLoadingNotify(true);
    const { unreadCount: count, notifications: list } = await fetchMyNotifications(accessToken);
    setUnreadCount(count);
    setNotifications(list);
    setLoadingNotify(false);
  };

  // Click vào thông báo → mở dialog chi tiết, giữ dropdown mở
  const handleNotificationClick = async (noti) => {
    setSelectedNotification(noti);

    // Đánh dấu đã đọc nếu chưa đọc
    if (!noti.isRead && accessToken) {
      const success = await markNotificationAsRead(noti.idNotification, accessToken);
      if (success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.idNotification === noti.idNotification ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // Click outside: chỉ đóng dropdown khi KHÔNG có dialog chi tiết đang mở
  useEffect(() => {
    function handleClickOutside(event) {
      // Nếu click ngoài cả notify wrapper VÀ dialog → đóng dropdown
      if (
        notifyRef.current &&
        !notifyRef.current.contains(event.target) &&
        (!dialogRef.current || !dialogRef.current.contains(event.target))
      ) {
        setShowNotify(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className={cx("wrapper")}>
        <div className={cx("inner")}>
          {/* Left */}
          <div className={cx("left-section")}>
            <div className={cx("logo")}>
              <div className={cx("logo-icon")}>
                <FontAwesomeIcon icon={faCut} className={cx("logo-icon-inner")} />
              </div>
              <span>Barbershop</span>
            </div>
          </div>

          {/* Middle */}
          <div className={cx("mid-section")}>
            <div className={cx("nav-menu")}>
              <Button href="/" text className={cx("menu-button")}>
                Trang chủ
              </Button>
              <Button href="/reels" text className={cx("menu-button")}>
                Video Ngắn
              </Button>
              <Button href="/team" text className={cx("menu-button")}>
                Thợ
              </Button>
              <Button href="/about" text className={cx("menu-button")}>
                Về chúng tôi
              </Button>
            </div>
          </div>

          {/* Right */}
          <div className={cx("right-section")}>
            {!isLogin && (
              <div className={cx("not-logged")}>
                <Button
                  rounded
                  onClick={() => setShowModal(true)}
                  className={cx("guest-button")}
                >
                  <span>Thành viên</span>
                  <img
                    src="/user.png"
                    alt="Avatar của thành viên"
                    className={cx("user-avatar")}
                  />
                </Button>
              </div>
            )}

            {isLogin && (
              <div className={cx("notification-wrapper")} ref={notifyRef}>
                {/* Chỉ phần chuông mới toggle dropdown */}
                <div
                  className={cx("bell-trigger")}
                  onClick={() => setShowNotify((prev) => !prev)}
                >
                  <FontAwesomeIcon icon={faBell} className={cx("bell-icon")} />
                  {unreadCount > 0 && (
                    <span className={cx("badge")}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>

                {/* Dropdown - KHÔNG có onClick để tránh toggle lại */}
                {showNotify && (
                  <div className={cx("notify-dropdown")}>
                    {loadingNotify ? (
                      <div className={cx("notify-item")}>Đang tải...</div>
                    ) : notifications.length === 0 ? (
                      <div className={cx("notify-item")}>Không có thông báo</div>
                    ) : (
                      notifications.map((noti) => (
                        <div
                          key={noti.idNotification}
                          className={cx("notify-item", { unread: !noti.isRead })}
                          onClick={() => handleNotificationClick(noti)}
                        >
                          <p className={cx("title")}>{noti.title}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {isLogin && (
              <UserMenu>
                <div className={cx("logged")}>
                  <span>{user.fullName}</span>
                  <div className={cx("user-avatar")}>
                    <img
                      src={user.image || "/user.png"}
                      alt={user.fullName}
                    />
                  </div>
                  <div className={cx("faChevronDown-icon")}>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </div>
              </UserMenu>
            )}
          </div>
        </div>
      </header>

      {/* Modal login cũ */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Custom Dialog chi tiết thông báo */}
      {selectedNotification && (
        <div className={cx("custom-dialog-overlay")} onClick={() => setSelectedNotification(null)}>
          <div
            ref={dialogRef}
            className={cx("custom-dialog")}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={cx("dialog-title")}>{selectedNotification.title}</h3>
            {selectedNotification.content ? (
              <p className={cx("dialog-content")}>
                {selectedNotification.content}
              </p>
            ) : (
              <p className={cx("dialog-content", "no-content")}>
                Không có nội dung chi tiết.
              </p>
            )}
            <button
              className={cx("dialog-close-btn")}
              onClick={() => setSelectedNotification(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
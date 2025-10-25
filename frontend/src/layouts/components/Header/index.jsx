import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import styles from "./Header.module.scss";
import { faChevronDown, faCut } from "@fortawesome/free-solid-svg-icons";

import Button from "~/components/Button";
import Modal from "~/components/Modal";
import UserMenu from "~/components/Popper/UserMenu";
import { useAuth } from "~/context/AuthContext";

const cx = classNames.bind(styles);

function Header() {
  const [showModal, setShowModal] = useState(false);
  const { user, isLogin } = useAuth();

  return (
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
          <Button href="/" text className={cx("menu-button")}>Trang chủ</Button>
          <Button href="/reels" text className={cx("menu-button")}>Video Ngắn</Button>
          <Button href="/team" text className={cx("menu-button")}>Thợ</Button>
          <Button href="/about" text className={cx("menu-button")}>Về chúng tôi</Button>
        </div>

        </div>

        {/* Right */}
        <div className={cx("right-section")}>
          {!isLogin && (
            <div className={cx("not-logged")}>
              <Button rounded onClick={() => setShowModal(true)} className={cx("guest-button")}>
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
            <UserMenu>
              <div className={cx("logged")}>
                <span>{user.fullName}</span>
                <div className={cx("user-avatar")}>
                  <img
                    src={user.avatar || "/user.png"}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
}

export default Header;

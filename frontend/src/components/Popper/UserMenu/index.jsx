import { useState, useRef } from "react";
import Tippy from "@tippyjs/react/headless";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "~/context/AuthContext"; 
import { useNavigate } from "react-router-dom";

import styles from "./UserMenu.module.scss";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import {
  faCalendar,
  faGift,
  faRightFromBracket,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function UserMenu({ children }) {
  const { logout } = useAuth();
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef();
  const navigate = useNavigate();

  const hideMenu = () => setVisible(false);
  const toggleMenu = () => setVisible((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/");
    hideMenu();
  };

  const handleProfileClick = () => {
    navigate("/profile");
    hideMenu();
  };

  const renderResult = (attrs) => (
  <div className={cx("menu-list")} tabIndex="-1" {...attrs}>
    <PopperWrapper className={cx("menu-popper")}>
      <div className={cx("menu-body")}>
        <div className={cx("body")}>
          <button className={cx("menu-item")} onClick={handleProfileClick}>
            <FontAwesomeIcon icon={faUserCircle} />
            <div>Hồ sơ cá nhân</div>
          </button>
          <a className={cx("menu-item")} href="#">
            <FontAwesomeIcon icon={faCalendar} />
            <div>Lịch hẹn của tôi</div>
          </a>
          <a className={cx("menu-item")} href="#">
            <FontAwesomeIcon icon={faGift} />
            <div>Điểm tích luỹ</div>
          </a>
        </div>
        <div className={cx("footer")}>
          <button className={cx("menu-item")} onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            <div>Đăng xuất</div>
          </button>
        </div>
      </div>
    </PopperWrapper>
  </div>
);


  return (
    <div ref={triggerRef}>
      <Tippy
        interactive
        visible={visible}
        placement="bottom-end"
        onClickOutside={hideMenu}
        render={renderResult}
      >
        <div onClick={toggleMenu}>{children}</div>
      </Tippy>
    </div>
  );
}

export default UserMenu;

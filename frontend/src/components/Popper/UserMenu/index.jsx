import { useState, useRef } from "react";
import Tippy from "@tippyjs/react/headless";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef();
  const toggleMenu = () => setVisible((prev) => !prev);
  const hideMenu = () => setVisible(false);
  const renderResult = (attrs) => (
    <div className={cx("menu-list")} tabIndex="-1" {...attrs}>
      <PopperWrapper className={cx("menu-popper")}>
        <div className={cx("menu-body")}>
          <div className={cx("body")}>
            <a className={cx("item")} href="/profile">
              <FontAwesomeIcon icon={faUserCircle} />
              <div>Hồ sơ cá nhân</div>
            </a>
            <a className={cx("item")} href="#">
              <FontAwesomeIcon icon={faCalendar} />
              <div>Lịch hẹn của tôi</div>
            </a>
            <a className={cx("item")} href="#">
              <FontAwesomeIcon icon={faGift} />
              <div>Điểm tích luỹ</div>
            </a>
          </div>
          <div className={cx("footer")}>
            <a className={cx("logout")} href="/">
              <FontAwesomeIcon icon={faRightFromBracket} />
              <div>Đăng xuất</div>
            </a>
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

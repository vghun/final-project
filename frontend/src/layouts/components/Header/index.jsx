import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import styles from "./Header.module.scss";
import {
  faChevronDown,
  faCut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

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
        <div className={cx("left-section")}>
          <div className={cx("logo")}>
            <div className={cx("logo-icon")}>
              <FontAwesomeIcon icon={faCut} className={cx("logo-icon-inner")} />
            </div>
            <span>Barbershop</span>
          </div>
        </div>

        <div className={cx("mid-section")}>
          <div className={cx("nav-menu")}>
            <Button href={"/"} text>
              Trang chủ
            </Button>
            <Button href={"/team"} text>
              Chi nhánh & Thợ
            </Button>
            <Button href={"/service"} text>
              Dịch vụ
            </Button>
            <Button href={"/products"} text>
              Sản phẩm
            </Button>
            <Button href={"/about"} text>
              Về chúng tôi
            </Button>
          </div>
        </div>

        <div className={cx("right-section")}>
          {!isLogin && (
            <div className={cx("not-logged")}>
              <Button
                rounded
                leftIcon={<FontAwesomeIcon icon={faUser} />}
                onClick={() => setShowModal(true)}
              >
                Thành viên
              </Button>
            </div>
          )}

          {isLogin && (
            <UserMenu>
              <div className={cx("logged")}>
                <div className={cx("user-icon")}>
                  <FontAwesomeIcon
                    icon={faUser}
                    className={cx("user-icon-inner")}
                  />
                </div>
                <span>{user.fullName}</span>
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

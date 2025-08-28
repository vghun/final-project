import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ForgetPass from "./ForgetPass";
import styles from "./Modal.module.scss";
import classNames from "classnames/bind";
import NewPass from "./NewPass";

const cx = classNames.bind(styles);

function Modal({ isOpen, onClose }) {
  const [modalType, setModalType] = useState("login");

  const renderModalContent = () => {
    switch (modalType) {
      case "register":
        return <Register onSwitch={setModalType} onClose={onClose} />;
      case "forgetpass":
        return <ForgetPass onSwitch={setModalType} />;
      case "newpass":
        return <NewPass onSwitch={setModalType} />;
      default:
        return <Login onSwitch={setModalType} onClose={onClose} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        <button className={cx("close")} onClick={onClose}>
          ×
        </button>
        {renderModalContent()}
      </div>
    </div>
  );
}

export default Modal;

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
  const [modalData, setModalData] = useState({}); // thêm state để giữ data (vd: email)

  // custom lại onSwitch để vừa đổi trang vừa lưu data
  const handleSwitch = (type, data = {}) => {
    setModalType(type);
    setModalData(data);
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "register":
        return <Register onSwitch={handleSwitch} onClose={onClose} />;
      case "forgetpass":
        return <ForgetPass onSwitch={handleSwitch} />;
      case "newpass":
        return (
          <NewPass
            onSwitch={handleSwitch}
            email={modalData.email} // truyền email vào đây
          />
        );
      default:
        return <Login onSwitch={handleSwitch} onClose={onClose} />;
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

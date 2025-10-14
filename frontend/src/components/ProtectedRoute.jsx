import { useAuth } from "~/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "~/components/Modal";

export function ProtectedRoute({ children }) {
  const { isLogin } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      setShowModal(true);
    }
  }, [isLogin]);

  const handleClose = () => {
    setShowModal(false);
    if (!isLogin) {
      navigate("/"); // Nếu tắt modal mà chưa login → về Home
    }
  };

  const handleLoginSuccess = () => {
    setShowModal(false);
    // Vào thẳng route hiện tại (children)
  };

  if (isLogin) {
    return children; // Nếu đã login → render bình thường
  }

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

import { useAuth } from "~/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "~/components/Modal";

export function ProtectedRoute({ children, requiredRole }) {
  const { isLogin, user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Nếu chưa đăng nhập → mở modal
    if (!isLogin) {
      setShowModal(true);
    }
    // Nếu đăng nhập mà không đủ quyền → chuyển hướng về Home
    else if (requiredRole && user?.role !== requiredRole) {
      navigate("/");
    }
  }, [isLogin, user, requiredRole, navigate]);

  const handleClose = () => {
    setShowModal(false);
    if (!isLogin) {
      navigate("/"); // Nếu tắt modal mà chưa login → về Home
    }
  };

  const handleLoginSuccess = () => {
    setShowModal(false);
    // Vào lại trang hiện tại sau khi login thành công
  };

  // Nếu đã đăng nhập và có quyền hợp lệ → render nội dung
  if (isLogin && (!requiredRole || user?.role === requiredRole)) {
    return children;
  }

  // Nếu chưa login → hiển thị modal
  return (
    <Modal
      isOpen={showModal}
      onClose={handleClose}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

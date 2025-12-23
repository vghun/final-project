import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { useAuth } from "~/context/AuthContext";
import ServiceCard from "~/components/ServiceCard";
import AIChat from "../../components/AIChat/AIChat";
import Modal from "~/components/Modal";
import { fetchHotServicesPaged } from "~/services/serviceService";
import RevealSection from "~/components/RevealSection/RevealSection";
import AddBannerModal from "~/components/AddBannerModal";
import { fetchActiveBanners, uploadBanner } from "~/services/bannerService";
import { useToast } from "~/context/ToastContext";
const DEFAULT_BANNER = "/brand.jpg";

const Home = () => {
  const { isLogin, user, accessToken } = useAuth();
  const chatRef = useRef(null);
  const sliderRef = useRef(null);

  const [hot, setHot] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 4;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nextRoute, setNextRoute] = useState(null);
  const [showAddBanner, setShowAddBanner] = useState(false);

  /* ===== BANNER ===== */
  /* ===== BANNER ===== */
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const { showToast } = useToast();


  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchActiveBanners();

        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        } else {
          setBanners([]); // fallback dùng DEFAULT_BANNER
        }
      } catch (err) {
        console.error("Lỗi load banner:", err);
        setBanners([]);
      }
    };

    loadBanners();
  }, []);


  /* Chỉ chạy auto-slide khi có nhiều hơn 1 banner */
  useEffect(() => {
    if (banners.length <= 1) {
      setCurrentBanner(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  /* ================== */

  useEffect(() => {
    const loadHot = async () => {
      try {
        const data = await fetchHotServicesPaged(page, limit);
        setHot(data.data);
      } catch (err) {
        console.error("Lỗi load dịch vụ hot:", err);
      }
    };
    loadHot();
  }, [page]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideWidth =
      slider.querySelector(`.${styles.slideItem}`)?.offsetWidth || 280;
    let scrollPosition = 0;

    const scrollSlider = () => {
      scrollPosition += slideWidth;
      slider.scrollTo({ left: scrollPosition, behavior: "smooth" });
    };

    const interval = setInterval(scrollSlider, 3000);
    return () => clearInterval(interval);
  }, [hot]);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookingClick = () => {
    if (isLogin) {
      window.location.href = "/booking";
    } else {
      setNextRoute("/booking");
      setShowLoginModal(true);
    }
  };

  /* Banner hiện tại */
  // 1. Sửa currentBannerImage
  const currentBannerImage =
    banners.length > 0
      ? banners[currentBanner]  // ← banners là mảng string → lấy trực tiếp
      : DEFAULT_BANNER;
  
  /* Xử lý click dot */
  const handleDotClick = (index) => {
    if (banners.length > 1) {
      setCurrentBanner(index);
    }
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <RevealSection
        className={styles.heroSection}
        style={{ backgroundImage: `url(${currentBannerImage})` }}
      >
        <div className={styles.overlay}></div>

        <div className={styles.heroContent}>
          <h1>Barbershop</h1>
          <p>Chăm sóc tóc cho quý ông – Phong cách & Chất lượng</p>

          <div className={styles.heroButtons}>
            <button className={styles.btnPrimary} onClick={handleBookingClick}>
              Đặt lịch
            </button>
            <button className={styles.btnSecondary} onClick={scrollToChat}>
              Tư vấn
            </button>
          </div>
        </div>

        {/* Nút Add Banner cho Admin - góc dưới bên phải */}
        {user?.role === "admin" && (
          <button
            className={styles.addBannerBtn}
            onClick={() => setShowAddBanner(true)}
          >
            + Thêm banner
          </button>
        )}

        {/* Dots indicator - giữa phía dưới */}
        <div className={styles.bannerDots}>
          {banners.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${(banners.length <= 1 ? 0 : currentBanner) === index
                ? styles.activeDot
                : ""
                }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </RevealSection>

      {/* Quiz CTA */}
      <RevealSection
        className={styles.quizCTASection}
        style={{ backgroundImage: `url(/consult.jpeg)` }}
      >
        <div className={styles.overlay}></div>
        <div className={styles.quizCTAContent}>
          <h2>Tìm kiểu tóc hoàn hảo cho bạn!</h2>
          <p>
            Bạn chưa chắc chắn kiểu tóc nào phù hợp? Hãy khám phá ngay phong cách
            tóc dựa trên chất tóc, khuôn mặt và sở thích của bạn.
          </p>
          <button
            className={styles.btnPrimary}
            onClick={() => (window.location.href = "/hair-consult")}
          >
            Bắt đầu tư vấn
          </button>
        </div>
      </RevealSection>

      {/* AI Chat */}
      <RevealSection className={styles.section} ref={chatRef}>
        <div className={styles.container}>
          <AIChat />
        </div>
      </RevealSection>

      {/* Dịch vụ hot */}
      <RevealSection className={styles.section}>
        <div className={styles.container}>
          <div className={styles.textCenter}>
            <h3 className={styles.title}>Dịch vụ hot nhất</h3>
            <p className={styles.subtitle}>
              Những dịch vụ được khách hàng yêu thích và đặt nhiều nhất
            </p>
          </div>

          <div className={styles.sliderWrapper} ref={sliderRef}>
            <div className={styles.slider}>
              {hot.concat(hot).map((s, i) => (
                <div key={`${s.idService}-${i}`} className={styles.slideItem}>
                  <ServiceCard {...s} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <AddBannerModal
        isOpen={showAddBanner}
        onClose={() => setShowAddBanner(false)}
        onSubmit={async (data) => {
          try {
            const formData = new FormData();
            formData.append("image", data.image);
            if (data.title) formData.append("title", data.title);
            if (data.startAt) formData.append("startAt", data.startAt);
            if (data.endAt) formData.append("endAt", data.endAt);

            await uploadBanner(formData, accessToken);

            // Reload banner
            const refreshed = await fetchActiveBanners();
            setBanners(refreshed);
            setCurrentBanner(0);

            // HIỆN TOAST THÀNH CÔNG theo ToastContext của bạn
            showToast({ text: "Thêm banner thành công!", type: "success" });
          } catch (err) {
            console.error("Upload banner lỗi:", err);
            showToast({ text: "Upload banner thất bại!", type: "error" });
          }
        }}
      />
    </div>
  );
};

export default Home;
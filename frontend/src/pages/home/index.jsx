import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import { useAuth } from "~/context/AuthContext";
import Button from "~/components/Button";
import ServiceCard from "~/components/ServiceCard"; 
import AIChat from "../../components/AIChat/AIChat";
import Modal from "~/components/Modal";
import { fetchHotServicesPaged } from "~/services/serviceService";

const Home = () => {
  const { isLogin } = useAuth();
  const chatRef = useRef(null);
  const sliderRef = useRef(null);

  const [hot, setHot] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nextRoute, setNextRoute] = useState(null);

  useEffect(() => {
    const loadHot = async () => {
      try {
        const data = await fetchHotServicesPaged(page, limit);
        setHot(data.data);
        setTotal(data.total);
      } catch (err) {
        console.error("Lỗi load dịch vụ hot:", err);
      }
    };
    loadHot();
  }, [page]);

  // Slider tự động
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideWidth = slider.querySelector(`.${styles.slideItem}`)?.offsetWidth || 280;
    const totalWidth = slideWidth * hot.length;
    let scrollPosition = 0;

    const scrollSlider = () => {
      scrollPosition += slideWidth;
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
        slider.scrollTo({ left: 0, behavior: "auto" });
      } else {
        slider.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }
    };

    const interval = setInterval(scrollSlider, 3000);
    return () => clearInterval(interval);
  }, [hot]);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookingClick = () => {
    if (isLogin) {
      window.location.href = "/booking"; // Hoặc dùng useNavigate
    } else {
      setNextRoute("/booking");
      setShowLoginModal(true);
    }
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section
        className={styles.heroSection}
        style={{ backgroundImage: `url(/brand.jpg)` }}
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
      </section>

      {/* AI Chat Section */}
      <section className={styles.section} ref={chatRef}>
        <div className={styles.container}>
          <AIChat />
        </div>
      </section>

      {/* Dịch vụ hot */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.textCenter}>
            <h3 className={styles.title}>Dịch vụ hot nhất</h3>
            <p className={styles.subtitle}>
              Những dịch vụ được khách hàng yêu thích và đặt nhiều nhất
            </p>
          </div>

          <div className={styles.sliderWrapper} ref={sliderRef}>
            <div className={styles.slider}>
              {hot.slice(0, 6).map((s) => (
                <div key={s.idService} className={styles.slideItem}>
                  <ServiceCard
                    id={s.idService}
                    image={s.image}
                    name={s.name}
                    description={s.description}
                    price={s.price}
                    duration={s.duration}
                  />
                </div>
              ))}
              {hot.slice(0, 6).map((s) => (
                <div key={`duplicate-${s.idService}`} className={styles.slideItem}>
                  <ServiceCard
                    id={s.idService}
                    image={s.image}
                    name={s.name}
                    description={s.description}
                    price={s.price}
                    duration={s.duration}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Login */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          if (!isLogin && nextRoute) {
            window.location.href = "/"; // Quay về Home nếu chưa login
          }
        }}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          if (nextRoute) {
            window.location.href = nextRoute; // Đi vào Booking
            setNextRoute(null);
          }
        }}
      />
    </div>
  );
};

export default Home;

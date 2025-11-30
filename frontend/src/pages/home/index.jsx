import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { useAuth } from "~/context/AuthContext";
import ServiceCard from "~/components/ServiceCard";
import AIChat from "../../components/AIChat/AIChat";
import Modal from "~/components/Modal";
import { fetchHotServicesPaged } from "~/services/serviceService";
import RevealSection from "~/components/RevealSection/RevealSection";

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
        console.log("API fetchHotServicesPaged result:", data);
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

    const slideWidth =
      slider.querySelector(`.${styles.slideItem}`)?.offsetWidth || 280;
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
      window.location.href = "/booking";
    } else {
      setNextRoute("/booking");
      setShowLoginModal(true);
    }
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
<RevealSection
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
</RevealSection>

<RevealSection
  className={styles.quizCTASection}
  style={{ backgroundImage: `url(/consult.jpeg)` }}
>
  <div className={styles.overlay}></div>
  <div className={styles.quizCTAContent}>
    <h2>Tìm kiểu tóc hoàn hảo cho bạn!</h2>
    <p>
      Bạn chưa chắc chắn kiểu tóc nào phù hợp? Hãy khám phá ngay phong cách tóc
      dựa trên chất tóc, khuôn mặt và sở thích của bạn.
    </p>
    <button
      className={styles.btnPrimary}
      onClick={() => (window.location.href = "/hair-consult")}
    >
      Bắt đầu tư vấn
    </button>
  </div>
</RevealSection>


      {/* AI Chat Section */}
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
      </RevealSection>

      {/* Modal Login */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          if (!isLogin && nextRoute) {
            window.location.href = "/";
          }
        }}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          if (nextRoute) {
            window.location.href = nextRoute;
            setNextRoute(null);
          }
        }}
      />
    </div>
  );
};

export default Home;

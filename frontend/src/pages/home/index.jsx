import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import ServiceCard from "~/components/ServiceCard"; 
import AIChat from "../../components/AIChat/AIChat";

import {
  fetchHotServicesPaged,
} from "~/services/serviceService";

const Home = () => {
  const chatRef = useRef(null);
  const sliderRef = useRef(null); // Thêm ref cho slider

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [hot, setHot] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;

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

  // Tự động trượt slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideWidth = slider.querySelector(`.${styles.slideItem}`)?.offsetWidth || 280;
    const totalWidth = slideWidth * hot.length;
    let scrollPosition = 0;

    const scrollSlider = () => {
      scrollPosition += slideWidth;
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0; // Quay về đầu để tạo vòng lặp vô hạn
        slider.scrollTo({ left: 0, behavior: "auto" }); // Reset không animation
      } else {
        slider.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }
    };

    const interval = setInterval(scrollSlider, 3000); // Trượt mỗi 3 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [hot]);

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
            <Link to="/booking">
              <button className={styles.btnPrimary}>Đặt lịch</button>
            </Link>
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

      {/* Dịch vụ hot nhất */}
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
              {/* Nhân đôi danh sách để tạo hiệu ứng lặp vô hạn */}
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
    </div>
  );
};

export default Home;
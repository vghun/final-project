import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import Button from "~/components/Button";
// import ServiceCard from "~/components/ServiceCard"; 
import AIChat from "../../components/AIChat/AIChat";

import {
  fetchLatestServices,
  fetchHotServices
} from "~/services/serviceService";

const Home = () => {
  const [latest, setLatest] = useState([]);
  const [hot, setHot] = useState([]);
  const chatRef = useRef(null);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        const [latestData, hotData] = await Promise.all([
          fetchLatestServices(),
          fetchHotServices()
        ]);
        setLatest(latestData);
        setHot(hotData);
      } catch (err) {
        console.error("Lỗi load dịch vụ:", err);
      }
    };

    loadServices();
  }, []);

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

      {/* Dịch vụ mới nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Dịch vụ mới nhất</h3>
          <div className={styles.grid}>
            {latest.map((s) => (
              <div
                key={s.idService}
                style={{
                  border: "1px solid #ccc",
                  padding: "16px",
                  textAlign: "center"
                }}
              >
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dịch vụ hot nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.textCenter}>
            <h3 className={styles.title}>Dịch vụ hot nhất</h3>
            <p className={styles.subtitle}>
              Những dịch vụ được khách hàng đặt nhiều nhất
            </p>
          </div>
          <div className={styles.grid}>
            {hot.map((s) => (
              <div
                key={s.idService}
                style={{
                  border: "1px solid #ccc",
                  padding: "16px",
                  textAlign: "center"
                }}
              >
                {s.name}
              </div>
            ))}
          </div>
          <div className={styles.textCenter}>
            <Link to="/services">
              <Button size="lg">Xem tất cả dịch vụ</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

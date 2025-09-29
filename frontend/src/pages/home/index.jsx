import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import Button from "~/components/Button";
import ServiceCard from "~/components/ServiceCard"; 
import AIChat from "../../components/AIChat/AIChat";

import {
  fetchHotServicesPaged,
} from "~/services/serviceService";

const Home = () => {
  const chatRef = useRef(null);

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
              Những dịch vụ được khách hàng đặt nhiều nhất
            </p>
          </div>
          <div className={styles.grid}>
            {hot.map((s) => (
              <ServiceCard
                key={s.idService}
                id={s.idService}
                image={s.image}
                name={s.name}
                description={s.description}
                price={s.price}
                duration={s.duration}
              />
            ))}
          </div>
        </div>
      </section>
      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Trang trước
        </button>
        <span>
          {page} / {Math.ceil(total / limit)}
        </span>
        <button
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage((p) => p + 1)}
        >
          Trang sau
        </button>
      </div>


    </div>
  );
};

export default Home;

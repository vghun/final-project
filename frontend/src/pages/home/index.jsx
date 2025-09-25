import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import Button from "~/components/Button";
import ServiceCard from "~/components/ServiceCard"; // thay vì ProductCard
import AIChat from "../../components/AIChat/AIChat";

import {
  fetchLatestServices,
  fetchHotServices
} from "~/services/serviceService";

const Home = () => {
  const [latest, setLatest] = useState([]);
  const [hot, setHot] = useState([]);
  const chatRef = useRef(null);

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
      {/* Hero section giữ nguyên */}

      {/* Dịch vụ mới nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Dịch vụ mới nhất</h3>
          <div className={styles.grid}>
            {latest.map((s) => (
              <ServiceCard
                key={s.idService}
                id={s.idService}
                image={"/service.png"} // TODO: nếu có cột ảnh thì lấy từ DB
                category={s.category?.name || "Khác"}
                name={s.name}
                description={s.description}
                price={Number(s.price)}
                duration={s.duration}
              />
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
              <ServiceCard
                key={s.idService}
                id={s.idService}
                image={"/service.png"}
                category={s.category?.name || "Khác"}
                name={s.name}
                description={s.description}
                price={Number(s.price)}
                duration={s.duration}
              />
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

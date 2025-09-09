import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { ShoppingBag } from "lucide-react";
import Badge from "~/components/Badge";
import Button from "~/components/Button";
import { Link } from "react-router-dom";

import {
  fetchLatestProducts,
  fetchBestSellingProducts,
  fetchMostViewedProducts,
  fetchTopDiscountProducts
} from "~/services/productService";

const Home = () => {
  const [latest, setLatest] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [topDiscount, setTopDiscount] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [latestData, bestData, viewedData, discountData] =
          await Promise.all([
            fetchLatestProducts(),
            fetchBestSellingProducts(),
            fetchMostViewedProducts(),
            fetchTopDiscountProducts()
          ]);
        setLatest(latestData);
        setBestSelling(bestData);
        setMostViewed(viewedData);
        setTopDiscount(discountData);
      } catch (err) {
        console.error("Lỗi load sản phẩm:", err);
      }
    };

    loadProducts();
  }, []);

  const renderProducts = (products) =>
    products.map((p) => (
      <div key={p.id} className={styles.card}>
        <div className={styles.cardImage}>
          <img src={p.image} alt={p.name} />
        </div>
        <h4 className={styles.cardTitle}>{p.name}</h4>
        <p className={styles.cardDesc}>{p.description}</p>
        <div className={styles.cardFooter}>
          <span className={styles.price}>{p.price}đ</span>
          {p.discount > 0 && (
            <Badge variant="secondary">-{p.discount}%</Badge>
          )}
        </div>
      </div>
    ));

  return (
    <div className={styles.home}>
      {/* Sản phẩm mới nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Sản phẩm mới nhất</h3>
          <div className={styles.grid}>{renderProducts(latest)}</div>
        </div>
      </section>

      {/* Bán chạy nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.textCenter}>
            <h3 className={styles.title}>Sản phẩm bán chạy</h3>
            <p className={styles.subtitle}>
              Những sản phẩm chăm sóc tóc được yêu thích nhất
            </p>
          </div>
          <div className={styles.grid}>{renderProducts(bestSelling)}</div>
          <div className={styles.textCenter}>
            <Link to="/products">
              <Button size="lg">
                <ShoppingBag className={styles.iconSmall} />
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Xem nhiều nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Sản phẩm xem nhiều nhất</h3>
          <div className={styles.grid}>{renderProducts(mostViewed)}</div>
        </div>
      </section>

      {/* Khuyến mãi cao nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Khuyến mãi cao nhất</h3>
          <div className={styles.grid}>{renderProducts(topDiscount)}</div>
        </div>
      </section>
    </div>
  );
};

export default Home;

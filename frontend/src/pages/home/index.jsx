import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import Button from "~/components/Button";
import ProductCard from "~/components/ProductCard";

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

  // Fake rating & reviews
  const withFakeRating = (products) =>
    products.map((p) => ({
      ...p,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      reviews: Math.floor(Math.random() * 200) + 1
    }));

  return (
    <div className={styles.home}>
      {/* Sản phẩm mới nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Sản phẩm mới nhất</h3>
          <div className={styles.grid}>
            {withFakeRating(latest).map((p) => (
              <ProductCard
              key={p.id}
              id={p.id}
              image={p.image}
              badge={null} // hoặc "Bán chạy" nếu muốn custom
              category={p.category?.name || "Khác"}
              name={p.name}
              brand={"Thương hiệu A"}
              rating={(Math.random() * 2 + 3).toFixed(1)}
              reviews={Math.floor(Math.random() * 200) + 1}
              description={p.description}
              price={Number(p.price)}
              discount={p.discount}
              outOfStock={false}
            />
            ))}
          </div>
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
          <div className={styles.grid}>
            {withFakeRating(bestSelling).map((p) => (
              <ProductCard
              key={p.id}
              id={p.id}
              image={p.image}
              badge={null} // hoặc "Bán chạy" nếu muốn custom
              category={p.category?.name || "Khác"}
              name={p.name}
              brand={"Thương hiệu A"}
              rating={(Math.random() * 2 + 3).toFixed(1)}
              reviews={Math.floor(Math.random() * 200) + 1}
              description={p.description}
              price={Number(p.price)}
              discount={p.discount}
              outOfStock={false}
            />
            ))}
          </div>
          <div className={styles.textCenter}>
            <Link to="/products">
              <Button size="lg">Xem tất cả sản phẩm</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Xem nhiều nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Sản phẩm xem nhiều nhất</h3>
          <div className={styles.grid}>
            {withFakeRating(mostViewed).map((p) => (
              <ProductCard
              key={p.id}
              id={p.id}
              image={p.image}
              badge={null} // hoặc "Bán chạy" nếu muốn custom
              category={p.category?.name || "Khác"}
              name={p.name}
              brand={"Thương hiệu A"}
              rating={(Math.random() * 2 + 3).toFixed(1)}
              reviews={Math.floor(Math.random() * 200) + 1}
              description={p.description}
              price={Number(p.price)}
              discount={p.discount}
              outOfStock={false}
            />
            ))}
          </div>
        </div>
      </section>

      {/* Khuyến mãi cao nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Khuyến mãi cao nhất</h3>
          <div className={styles.grid}>
            {withFakeRating(topDiscount).map((p) => (
              <ProductCard
              key={p.id}
              id={p.id}
              image={p.image}
              badge={null} // hoặc "Bán chạy" nếu muốn custom
              category={p.category?.name || "Khác"}
              name={p.name}
              brand={"Thương hiệu A"}
              rating={(Math.random() * 2 + 3).toFixed(1)}
              reviews={Math.floor(Math.random() * 200) + 1}
              description={p.description}
              price={Number(p.price)}
              discount={p.discount}
              outOfStock={false}
            />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

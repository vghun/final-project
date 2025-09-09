import React from "react";
import styles from "./Home.module.scss";
import { ShoppingBag } from "lucide-react";
import Badge from "~/components/Badge";
import Button from "~/components/Button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Sản phẩm mới nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Sản phẩm mới nhất</h3>
          <div className={styles.grid}>
            {/* TODO: Map 8 sản phẩm mới nhất */}
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
            {/* TODO: Map 6 sản phẩm bán chạy */}
            <div className={styles.card}>
              <div className={styles.cardImage}>
                <ShoppingBag className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>Wax tạo kiểu Gatsby</h4>
              <p className={styles.cardDesc}>
                Giữ nếp lâu, không bết dính
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.price}>250.000đ</span>
                <Badge variant="secondary">Bán chạy #1</Badge>
              </div>
            </div>
          </div>
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
          <div className={styles.grid}>
            {/* TODO: Map 8 sản phẩm xem nhiều */}
          </div>
        </div>
      </section>

      {/* Khuyến mãi cao nhất */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Khuyến mãi cao nhất</h3>
          <div className={styles.grid}>
            {/* TODO: Map 4 sản phẩm khuyến mãi */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

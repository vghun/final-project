import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import SidebarFilter from "~/components/SideBarFilter";
import ProductCard from "~/components/ProductCard";
import { fetchPagedProducts } from "~/services/productService";

const cx = classNames.bind(styles);

function Product() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15; // mỗi trang 12 sản phẩm

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchPagedProducts(page, limit);
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Lỗi load sản phẩm:", err);
      }
    };
    loadProducts();
  }, [page]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("inner")}>
        <div className={cx("header")}>
          <h2>Sản phẩm chăm sóc tóc</h2>
          <p>Các sản phẩm chất lượng cao cho việc chăm sóc tóc tại nhà</p>
        </div>

        <div className={cx("section")}>
          <div className={cx("left-section")}>
            <SidebarFilter />
          </div>

          <div className={cx("right-section")}>
            <p>Tìm thấy {total} sản phẩm</p>
            <div className={cx("product-list")}>
              {products.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  category={item.category?.name || "Khác"}
                  name={item.name}
                  brand={"Thương hiệu A"} // fake
                  rating={(Math.random() * 2 + 3).toFixed(1)}
                  reviews={Math.floor(Math.random() * 200) + 1}
                  description={item.description}
                  price={Number(item.price)}
                  discount={item.discount}
                  outOfStock={false}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className={cx("pagination")}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                « Trước
              </button>
              <span>
                Trang {page}/{totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;

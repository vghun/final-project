import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ProductDetails.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const cx = classNames.bind(styles);

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔹 data cứng demo (sau này thay API)
  const product = {
    id,
    category: "Sáp tóc",
    name: "Sáp vuốt tóc Premium",
    brand: "BarberPro",
    rating: 4.7,
    reviews: 31,
    stock: 25,
    price: 250000,
    oldPrice: 300000,
    description: "Sáp vuốt tóc cao cấp với độ bám tốt, không gây bết dính",
    longDescription:
      "Sáp vuốt tóc Premium được phát triển đặc biệt cho nam giới hiện đại...",
    images: [
      "https://tiendichshop.vn/wp-content/uploads/2021/02/refined-premium-pomade-3-1-768x768.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB90_e6kEo4VK70hT8WO0ym1Xhm_bCOLQFsQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB90_e6kEo4VK70hT8WO0ym1Xhm_bCOLQFsQ&s",
    ],
    features: [
      "Độ bám tốt, giữ kiểu lâu",
      "Không gây bết dính",
      "Dễ dàng rửa sạch",
      "Từ thành phần tự nhiên",
      "Hương thơm nam tính",
    ],
    volume: "100ml",
    origin: "Việt Nam",
    ingredients: "Nước, sáp ong, hương liệu tự nhiên...",
    usage: "Lấy một lượng vừa đủ, xoa đều và vuốt tóc theo ý muốn.",
  };

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className={cx("wrapper")}>
      <button onClick={() => navigate(-1)} className={cx("back")}>
        ← Quay lại cửa hàng
      </button>

      {/* Khối trên */}
      <div className={cx("top")}>
        <div className={cx("gallery")}>
          <Swiper
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
            className={cx("main-swiper")}
          >
            {product.images.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} alt={`${product.name}-${i}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Info */}
        <div className={cx("info")}>
          <span className={cx("category")}>{product.category}</span>
          <h2 className={cx("name")}>{product.name}</h2>
          <p className={cx("brand")}>{product.brand}</p>

          <div className={cx("rating")}>
            <i className="fa-solid fa-star"></i>
            <span>{product.rating}</span>
            <span className={cx("reviews")}>({product.reviews} đánh giá)</span>
            <span className={cx("stock")}>
              {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
            </span>
          </div>

          <div className={cx("price")}>
            <span className={cx("new")}>{product.price.toLocaleString()}đ</span>
            {product.oldPrice && (
              <span className={cx("old")}>
                {product.oldPrice.toLocaleString()}đ
              </span>
            )}
          </div>

          {product.oldPrice && (
            <p className={cx("discount")}>
              Tiết kiệm {(product.oldPrice - product.price).toLocaleString()}đ (
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              )}
              %)
            </p>
          )}

          <p className={cx("desc")}>{product.description}</p>

          {/* Quantity */}
          <div className={cx("quantity")}>
            <label>Số lượng:</label>
            <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>
              -
            </button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <button className={cx("btn-add")}>
            Thêm vào giỏ – {(product.price * quantity).toLocaleString()}đ
          </button>
        </div>
      </div>

      {/* Features */}
      <div className={cx("features")}>
        <h3>Đặc điểm nổi bật:</h3>
        <ul>
          {product.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      {/* Policies */}
      <div className={cx("policies")}>
        <div>🚚 Giao hàng miễn phí</div>
        <div>🛡️ Bảo hành chính hãng</div>
        <div>↩️ Đổi trả 7 ngày</div>
      </div>

      {/* Tabs */}
      <div className={cx("tabs")}>
        <button
          className={cx({ active: activeTab === "description" })}
          onClick={() => setActiveTab("description")}
        >
          Mô tả
        </button>
        <button
          className={cx({ active: activeTab === "ingredient" })}
          onClick={() => setActiveTab("ingredient")}
        >
          Thành phần
        </button>
        <button
          className={cx({ active: activeTab === "usage" })}
          onClick={() => setActiveTab("usage")}
        >
          Cách sử dụng
        </button>
        <button
          className={cx({ active: activeTab === "review" })}
          onClick={() => setActiveTab("review")}
        >
          Đánh giá
        </button>
      </div>

      <div className={cx("tab-content")}>
        {activeTab === "description" && (
          <>
            <h3>Mô tả sản phẩm</h3>
            <p>{product.longDescription}</p>
            <table>
              <tbody>
                <tr>
                  <td>Dung tích:</td>
                  <td>{product.volume}</td>
                  <td>Xuất xứ:</td>
                  <td>{product.origin}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        {activeTab === "ingredient" && <p>{product.ingredients}</p>}
        {activeTab === "usage" && <p>{product.usage}</p>}
        {activeTab === "review" && <p>Hiện chưa có đánh giá nào.</p>}
      </div>
    </div>
  );
}

export default ProductDetails;

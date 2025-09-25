import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ProductDetails.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import productApi from "~/apis/serviceAPI"; // ⬅️ gọi API backend

const cx = classNames.bind(styles);

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productApi.getById(id);
        setProduct(res.data);
        setActiveImage(res.data.image); // API chỉ trả về 1 ảnh
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Đang tải sản phẩm...</div>;
  }

  return (
    <div className={cx("wrapper")}>
      <button onClick={() => navigate(-1)} className={cx("back")}>
        ← Quay lại cửa hàng
      </button>

      {/* Khối trên */}
      <div className={cx("top")}>
        <div className={cx("gallery")}>
          <Swiper spaceBetween={10} navigation={true} modules={[Navigation]} className={cx("main-swiper")}>
            {[product.image].map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} alt={`${product.name}-${i}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Info */}
        <div className={cx("info")}>
          <span className={cx("category")}>{product.category?.name}</span>
          <h2 className={cx("name")}>{product.name}</h2>

          <div className={cx("price")}>
            <span className={cx("new")}>
              {(Number(product.price) * (1 - product.discount / 100)).toLocaleString()}đ
            </span>
            {product.discount > 0 && <span className={cx("old")}>{Number(product.price).toLocaleString()}đ</span>}
          </div>

          <p className={cx("desc")}>{product.description}</p>

          {/* Quantity */}
          <div className={cx("quantity")}>
            <label>Số lượng:</label>
            <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <button className={cx("btn-add")}>
            Thêm vào giỏ – {(Number(product.price) * (1 - product.discount / 100) * quantity).toLocaleString()}đ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={cx("tabs")}>
        <button className={cx({ active: activeTab === "description" })} onClick={() => setActiveTab("description")}>
          Mô tả
        </button>
        <button className={cx({ active: activeTab === "review" })} onClick={() => setActiveTab("review")}>
          Đánh giá
        </button>
      </div>

      <div className={cx("tab-content")}>
        {activeTab === "description" && (
          <>
            <h3>Mô tả sản phẩm</h3>
            <p>{product.description}</p>
          </>
        )}
        {activeTab === "review" && <p>Hiện chưa có đánh giá nào.</p>}
      </div>
    </div>
  );
}

export default ProductDetails;

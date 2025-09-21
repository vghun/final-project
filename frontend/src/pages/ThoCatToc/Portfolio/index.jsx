import React, { useState } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

import styles from "./Portfolio.module.scss";

const cx = classNames.bind(styles);

// dữ liệu cứng để test UI
const demoImages = [
  "/demo/portfolio1.jpg",
  "/demo/portfolio2.jpg",
  "/demo/portfolio3.jpg",
  "/demo/portfolio4.jpg",
  "/demo/portfolio5.jpg",
  "/demo/portfolio6.jpg",
];

function Portfolio() {
  const [images, setImages] = useState(demoImages);

  const handleAddImage = () => {
    // sau này đổi thành gọi API upload ảnh
    const newImage = "/demo/portfolio1.jpg";
    setImages((prev) => [...prev, newImage]);
  };

  return (
    <div className={cx("portfolio")}>
      <h3>Portfolio</h3>
      <p>Showcase các tác phẩm và dịch vụ của bạn</p>

      <div className={cx("grid")}>
        {images.map((src, index) => (
          <div key={index} className={cx("item")}>
            <img src={src} alt={`portfolio-${index}`} />
          </div>
        ))}
      </div>

      <button className={cx("addBtn")} onClick={handleAddImage}>
        <FontAwesomeIcon icon={faCamera} /> Thêm ảnh mới
      </button>
    </div>
  );
}

export default Portfolio;

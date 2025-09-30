import React, { useState } from "react";
import styles from "./SanPham.module.scss";
import WorkCard from "~/components/CustomerGalleryCard";

function SanPham() {
  const [works] = useState([
    {
      id: 1,
      customerName: "Nguyễn Văn A",
      barberName: "Thợ Tuấn",
      service: "Classic Cut",
      description: "Kiểu tóc cổ điển gọn gàng.",
      photos: ["/completed-haircut-1.jpg", "/completed-haircut-2.jpg"],
      date: "2025-01-14",
      likes: 23,
      comments: 5,
    },
    {
      id: 2,
      customerName: "Trần Minh B",
      barberName: "Thợ Dũng",
      service: "Fade + Beard",
      description: "Fade kết hợp tạo kiểu râu.",
      photos: [
        "/completed-haircut-3.jpg",
        "/completed-haircut-4.jpg",
        "/completed-haircut-5.jpg",
      ],
      date: "2025-01-13",
      likes: 45,
      comments: 8,
    },
    {
      id: 3,
      customerName: "Lê Thị C",
      barberName: "Thợ Hạnh",
      service: "Layer nữ",
      description: "Kiểu layer cho tóc nữ dài.",
      photos: ["/completed-haircut-6.jpg"],
      date: "2025-01-12",
      likes: 30,
      comments: 2,
    },
  ]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sản phẩm đã hoàn thành</h2>
      <p className={styles.subtitle}>
        Ảnh sản phẩm sau khi hoàn thành dịch vụ
      </p>

      {works.length > 0 ? (
        <div className={styles.grid}>
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Chưa có sản phẩm nào</p>
      )}
    </div>
  );
}

export default SanPham;

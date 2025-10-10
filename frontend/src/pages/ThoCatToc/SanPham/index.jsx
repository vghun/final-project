import React, { useEffect, useState } from "react";
import styles from "./SanPham.module.scss";
import WorkCard from "~/components/CustomerGalleryCard";
import { fetchBarberGallery } from "~/services/customerGalleryService";

function SanPham() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const idBarber = 7; // 👈 fix cứng tạm
        const data = await fetchBarberGallery(idBarber);

        // ✅ Gom nhóm theo idbooking (mỗi booking có tối đa 4 ảnh)
        const grouped = {};
        data.forEach((item) => {
          const id = item.idbooking;
          if (!grouped[id]) {
            grouped[id] = {
              idBooking: id,
              customerName: item.customerName,
              barberName: item.barberName,
              service: item.service,
              description: item.description || "",
              date: item.date,
              photos: [],
            };
          }
          grouped[id].photos.push(item.photo);
        });

        setWorks(Object.values(grouped));
      } catch (err) {
        console.error("Lỗi khi tải gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Đang tải...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sản phẩm đã hoàn thành</h2>
      <p className={styles.subtitle}>
        Ảnh sản phẩm sau khi hoàn thành dịch vụ
      </p>

      {works.length > 0 ? (
        <div className={styles.grid}>
          {works.map((work) => (
            <WorkCard key={work.idBooking} work={work} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Chưa có sản phẩm nào</p>
      )}
    </div>
  );
}

export default SanPham;

import React, { useEffect, useState } from "react";
import styles from "./Footer.module.scss";
import { BranchAPI } from "~/apis/branchAPI";

export default function Footer() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await BranchAPI.getAll(); // giả sử API trả về array
        setBranches(res);
      } catch (err) {
        console.error("Lỗi khi lấy chi nhánh:", err);
      }
    };

    fetchBranches();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo & Slogan */}
        <div className={styles.footerBrand}>
          <h2>BarberShop</h2>
          <p>Chuyên nghiệp – Sang trọng – Đẳng cấp</p>
        </div>

        {/* Quick Links */}
        <div className={styles.footerLinks}>
          <h3>Liên kết nhanh</h3>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/about">Về chúng tôi</a></li>
            <li><a href="/services">Dịch vụ</a></li>
            <li><a href="/booking">Đặt lịch</a></li>
          </ul>
        </div>

        {/* Branches */}
        <div className={styles.footerBranches}>
          <h3>Chi nhánh</h3>
          {branches.length ? (
            <ul>
              {branches.map(branch => (
                <li key={branch.idBranch}>
                  <strong>{branch.name}</strong><br />
                  <span>{branch.address}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Đang tải chi nhánh...</p>
          )}
        </div>

        {/* Social */}
        <div className={styles.footerSocial}>
          <h3>Mạng xã hội</h3>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/YourPage" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
            </a>
            <a href="https://www.instagram.com/YourProfile" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" />
            </a>
            <a href="https://www.tiktok.com/@YourProfile" target="_blank" rel="noopener noreferrer">
              <img src="https://img.freepik.com/vector-cao-cap/logo-tiktok_628407-1683.jpg?semt=ais_hybrid&w=740&q=80" alt="TikTok" />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2025 BarberShop. All rights reserved.</p>
      </div>
    </footer>
  );
}

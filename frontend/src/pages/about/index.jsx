import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.scss"; // SCSS vẫn dùng cho các phần còn lại

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Banner / tiêu đề */}
      <section
        className="about-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/banner.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
          padding: "150px 20px",
          color: "#fff",
          textShadow: "0 2px 10px rgba(0,0,0,0.6)",
        }}
      >
        <h1>Về Chúng Tôi</h1>
        <p>Chúng tôi mang đến trải nghiệm cắt tóc chuyên nghiệp và phong cách riêng cho mỗi khách hàng.</p>
      </section>

      {/* Giới thiệu */}
      <section className="about-intro">
        <h2>Giới Thiệu</h2>
        <p>
          BarberShop được thành lập năm 2015, chuyên cung cấp dịch vụ cắt tóc, tạo kiểu và chăm sóc tóc cho mọi đối tượng. Chúng tôi tự hào về sự chuyên nghiệp và tận tâm với khách hàng.
        </p>
      </section>

      {/* Sứ mệnh & tầm nhìn */}
      <section className="about-mission">
        <h2>Sứ Mệnh & Tầm Nhìn</h2>
        <ul>
          <li>Sứ mệnh: Mang đến trải nghiệm cắt tóc tuyệt vời, phong cách và chất lượng.</li>
          <li>Tầm nhìn: Trở thành tiệm barber hàng đầu trong khu vực, được khách hàng tin tưởng và yêu thích.</li>
        </ul>
      </section>

      {/* Kêu gọi hành động */}
      <section className="about-cta">
        <h2>Hãy Trải Nghiệm Dịch Vụ Của Chúng Tôi!</h2>
        <p>Đặt lịch hẹn ngay hôm nay để nhận sự phục vụ chuyên nghiệp từ đội ngũ barber của chúng tôi.</p>
        <button onClick={() => navigate("/booking")}>Đặt Lịch</button>
      </section>
    </div>
  );
}

export default About;

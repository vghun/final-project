import React, { useState } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faEdit, faStar } from "@fortawesome/free-solid-svg-icons";

import styles from "./HoSoCaNhan.module.scss";

const cx = classNames.bind(styles);

const demoProfile = {
  name: "Minh Tuấn",
  experience: "8 năm kinh nghiệm",
  branch: "Chi nhánh Quận 1",
  rating: 4.9,
  reviews: 1247,
  avatar: "https://via.placeholder.com/100",
  specialties: ["Classic Cut", "Beard Styling", "Hair Washing"],
};

function HoSoCaNhan() {
  const [profile, setProfile] = useState(demoProfile);

  const handleUploadVideo = () => {
    alert("Tính năng upload video sẽ được thêm sau!");
  };

  return (
    <div className={cx("profile")}>
      <h3>Hồ sơ cá nhân</h3>
      <p>Cập nhật thông tin và kinh nghiệm của bạn</p>

      {/* Thông tin chính */}
      <div className={cx("info")}>
        <div className={cx("avatarWrapper")}>
          <img src={profile.avatar} alt="Avatar" />
          <span className={cx("cameraIcon")}>
            <FontAwesomeIcon icon={faCamera} />
          </span>
        </div>

        <div className={cx("details")}>
          <h2>{profile.name}</h2>
          <div className={cx("experience")}>{profile.experience}</div>
          <div className={cx("branch")}>{profile.branch}</div>
          <div className={cx("rating")}>
            <FontAwesomeIcon icon={faStar} className={cx("star")} />
            {profile.rating} <span>({profile.reviews} đánh giá)</span>
          </div>
        </div>
      </div>

      {/* Chuyên môn */}
      <div className={cx("specialties")}>
        <h4>Chuyên môn</h4>
        <div className={cx("tags")}>
          {profile.specialties.map((skill, idx) => (
            <span key={idx} className={cx("tag")}>
              {skill}
            </span>
          ))}
          <button className={cx("editBtn")}>
            <FontAwesomeIcon icon={faEdit} />
            Chỉnh sửa
          </button>
        </div>
      </div>

      {/* Video giới thiệu */}
      <div className={cx("videoSection")}>
        <h4>Video giới thiệu</h4>
        <div className={cx("uploadBox")}>
          <FontAwesomeIcon icon={faCamera} className={cx("icon")} />
          <p>Chưa có video giới thiệu</p>
          <button className={cx("uploadBtn")} onClick={handleUploadVideo}>
            Tải lên video
          </button>
        </div>
      </div>
    </div>
  );
}

export default HoSoCaNhan;

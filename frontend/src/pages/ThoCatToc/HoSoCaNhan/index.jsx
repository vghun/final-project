import React, { useState } from "react";
import styles from "./HoSoCaNhan.module.scss";

function HoSoCaNhan() {
  const [isEditing, setIsEditing] = useState(false);

  const [barber, setBarber] = useState({
    name: "Minh Tuấn",
    avatar: "/professional-barber-portrait.jpg",
    branch: "Chi nhánh Quận 1",
    rating: 4.9,
    totalCustomers: 1247,
    experience: 8,
    specialties: ["Classic Cut", "Beard Styling", "Hair Washing"],
    expertise:
      "Chuyên gia cắt tóc nam với 8 năm kinh nghiệm. Thành thạo các kiểu tóc hiện đại và cổ điển.",
  });

  const [formData, setFormData] = useState({ ...barber });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setBarber(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(barber);
    setIsEditing(false);
  };

  const handleSpecialtyChange = (index, value) => {
    const newSpecs = [...formData.specialties];
    newSpecs[index] = value;
    setFormData((prev) => ({ ...prev, specialties: newSpecs }));
  };

  const addSpecialty = () => {
    setFormData((prev) => ({
      ...prev,
      specialties: [...prev.specialties, ""],
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatarBox}>
          <img src={barber.avatar} alt={barber.name} className={styles.avatar} />
          {isEditing && <button className={styles.changeAvatar}>Đổi ảnh</button>}
        </div>
        <div>
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className={styles.input}
              />
            </>
          ) : (
            <>
              <h2 className={styles.name}>{barber.name}</h2>
              <p className={styles.branch}>{barber.branch}</p>
            </>
          )}
          <p className={styles.rating}>
            ⭐ {barber.rating} ({barber.totalCustomers} đánh giá)
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Kinh nghiệm</h3>
        {isEditing ? (
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={styles.input}
          />
        ) : (
          <p>{barber.experience} năm kinh nghiệm trong ngành</p>
        )}
      </div>

      <div className={styles.section}>
        <h3>Chuyên môn</h3>
        {isEditing ? (
          <>
            <textarea
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              className={styles.textarea}
            />
            <div className={styles.specialties}>
              {formData.specialties.map((sp, i) => (
                <input
                  key={i}
                  type="text"
                  value={sp}
                  onChange={(e) => handleSpecialtyChange(i, e.target.value)}
                  className={styles.input}
                />
              ))}
              <button
                className={styles.addBtn}
                type="button"
                onClick={addSpecialty}
              >
                + Thêm
              </button>
            </div>
          </>
        ) : (
          <>
            <p>{barber.expertise}</p>
            <div className={styles.specialties}>
              {barber.specialties.map((sp, i) => (
                <span key={i} className={styles.badge}>
                  {sp}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.actions}>
        {isEditing ? (
          <>
            <button onClick={handleSave} className={styles.saveBtn}>
              Lưu
            </button>
            <button onClick={handleCancel} className={styles.cancelBtn}>
              Hủy
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
}

export default HoSoCaNhan;
